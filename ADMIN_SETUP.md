# Admin Setup — Create Your Admin Account

## Prerequisites

Your Supabase project must be running with the schema deployed:

1. Go to **https://rhvgwujxvvziilkjqblt.supabase.co** → **SQL Editor**
2. Paste and run the entire contents of `server/supabase_schema.sql`

## Step 1: Create Admin User via Supabase Auth API

Run this in your terminal (replace with your actual service role key if different):

```bash
curl -X POST "https://rhvgwujxvvziilkjqblt.supabase.co/auth/v1/admin/users" \
  -H "apikey: YOUR_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@diwaliwish.com","password":"Admin123!","email_confirm":true}'
```

Get your `YOUR_SERVICE_ROLE_KEY` from Supabase Dashboard → Settings → API.

## Step 2: Insert Admin Profile

Run `server/admin_setup.sql` in your Supabase SQL Editor, replacing `<AUTH_USER_ID>` with the ID from Step 1:

```sql
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
```

## Step 3: Verify

In Supabase SQL Editor:

```sql
select id, name, email, role, is_active from profiles where email = 'admin@diwaliwish.com';
```

You should see your admin user with `role = 'admin'` and `is_active = true`.

## Step 4: Log In

Go to your deployed app:
**https://diwali-wish-app-delta.vercel.app**

Click **Log In** and use:
- **Email:** `admin@diwaliwish.com`
- **Password:** `Admin123!`

You'll have access to the **Admin Panel** at `/admin` where you can:
- Manage wish templates
- View users
- View analytics
- Block/deactivate users

## Demo User (Optional)

To test as a regular user, register a new account at:
**https://diwali-wish-app-delta.vercel.app/register**

Use any email and password — you'll get access to "My Wishes" but not the admin panel.
