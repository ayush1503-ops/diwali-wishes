-- ============================================================================
-- Admin Setup for DiwaliWish
-- Run this in your Supabase SQL Editor: https://rhvgwujxvvziilkjqblt.supabase.co/project/sql
-- ============================================================================

-- Step 1: Create the admin user in Supabase Auth
-- Note: You must first create the user via Supabase Auth UI or API,
-- then insert their profile here.

-- Option A: If you already created 'admin@diwaliwish.com' in Supabase Auth,
-- get their auth user ID and replace '<AUTH_USER_ID>' below:

insert into profiles (id, name, email, role, is_active)
values (
  '<AUTH_USER_ID>',
  'Admin',
  'admin@diwaliwish.com',
  'admin',
  true
)
on conflict (email) do update
set role = 'admin', is_active = true;

-- ============================================================================
-- Alternative: Create admin via Supabase Auth API (run in your terminal)
-- ============================================================================

/*
1. Create the auth user:
   curl -X POST "https://rhvgwujxvvziilkjqblt.supabase.co/auth/v1/admin/users" \
     -H "apikey: YOUR_SERVICE_ROLE_KEY" \
     -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@diwaliwish.com","password":"Admin123!","email_confirm":true}'

2. Copy the returned 'id' and replace '<AUTH_USER_ID>' in the SQL above, then run this SQL.
*/

-- ============================================================================
-- Verify admin was created
-- ============================================================================

select id, name, email, role, is_active, created_at
from profiles
where email = 'admin@diwaliwish.com';
