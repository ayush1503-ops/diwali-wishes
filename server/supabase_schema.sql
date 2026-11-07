-- ============================================================================
-- DiwaliWish Database Schema (Supabase PostgreSQL)
-- Run this in your Supabase SQL Editor
-- ============================================================================

-- Enable extensions
create extension if not exists "uuid-ossp";

-- ============================================================================
-- 1. profiles (replaces users collection)
-- ============================================================================
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  email text unique not null,
  role text check (role in ('user', 'admin')) default 'user',
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes
create index idx_profiles_email on profiles(email);
create index idx_profiles_role on profiles(role);

-- ============================================================================
-- 2. wishes (replaces wishes collection)
-- ============================================================================
create table wishes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete set null,
  recipient_name text not null,
  birthdate date not null,
  zodiac_sign text not null,
  theme text check (theme in ('royal-gold', 'traditional-diya', 'modern-neon', 'rangoli', 'fireworks')) default 'royal-gold',
  prediction text not null,
  wish_message text not null,
  lucky_color text,
  lucky_number integer,
  lucky_flower text,
  personality_trait text,
  share_slug text unique,
  is_public boolean default true,
  views integer default 0,
  shares integer default 0,
  downloads integer default 0,
  generated_by text default 'template',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes
create index idx_wishes_user_id on wishes(user_id);
create index idx_wishes_share_slug on wishes(share_slug);
create index idx_wishes_created_at on wishes(created_at desc);

-- ============================================================================
-- 3. wish_templates (replaces wishTemplates collection)
-- ============================================================================
create table wish_templates (
  id uuid default uuid_generate_v4() primary key,
  category text check (category in ('prosperity', 'joy', 'light', 'health', 'love', 'success')) not null,
  message text not null,
  language text default 'en' check (language in ('en', 'hi', 'mr', 'ta', 'te', 'bn')),
  is_active boolean default true,
  created_by uuid references profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================================
-- 4. predictions (replaces predictions collection)
-- ============================================================================
create table predictions (
  id uuid default uuid_generate_v4() primary key,
  zodiac_sign text unique not null,
  message text not null,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================================
-- 5. analytics (replaces analytics collection)
-- ============================================================================
create table analytics (
  id uuid default uuid_generate_v4() primary key,
  wish_id uuid references wishes(id) on delete set null,
  action text not null,
  ip_address text,
  created_at timestamptz default now()
);

-- ============================================================================
-- Row Level Security (RLS) Policies
-- ============================================================================

-- Profiles: users can read their own, admins can read all
alter table profiles enable row level security;
create policy "Public profiles are viewable by everyone" on profiles
  for select using (true);
create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);
create policy "Admins can manage all profiles" on profiles
  for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- Wishes: public wishes viewable by all, owners can manage their own
alter table wishes enable row level security;
create policy "Public wishes are viewable by everyone" on wishes
  for select using (is_public = true);
create policy "Owners can view their own wishes" on wishes
  for select using (auth.uid() = user_id);
create policy "Anyone can insert wishes" on wishes
  for insert with check (true);
create policy "Owners can update own wishes" on wishes
  for update using (auth.uid() = user_id);
create policy "Owners can delete own wishes" on wishes
  for delete using (auth.uid() = user_id);
create policy "Admins can manage all wishes" on wishes
  for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- Wish templates: active templates viewable by all, admins manage
alter table wish_templates enable row level security;
create policy "Active templates are viewable by everyone" on wish_templates
  for select using (is_active = true);
create policy "Admins manage all templates" on wish_templates
  for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- Predictions: active predictions viewable by all, admins manage
alter table predictions enable row level security;
create policy "Active predictions are viewable by everyone" on predictions
  for select using (is_active = true);
create policy "Admins manage all predictions" on predictions
  for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- Analytics: admins can read all, anyone can insert
alter table analytics enable row level security;
create policy "Anyone can insert analytics" on analytics
  for insert with check (true);
create policy "Admins can read analytics" on analytics
  for select using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- ============================================================================
-- Seed: Admin user (create via Supabase Auth, then insert profile)
-- ============================================================================
-- After creating the admin user in Supabase Auth, run:
-- insert into profiles (id, name, email, role) values ('<auth-user-id>', 'Admin', 'admin@diwaliwish.com', 'admin');
