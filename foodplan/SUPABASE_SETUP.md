# Supabase Authentication Setup Guide

This guide will help you set up Supabase authentication for the Foodplan app.

## 1. Get Your Supabase Credentials

1. Go to your Supabase project dashboard: https://app.supabase.com
2. Navigate to **Settings** > **API**
3. Copy the following values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **Anon/Public Key** (starts with `eyJhbG...`)

## 2. Configure Environment Variables

1. In the `/home/user/foodplan-multi-agents/foodplan/` directory, you'll find a `.env.local` file
2. Open it and replace the placeholder values:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here
```

## 3. Set Up Authentication in Supabase

### Enable Email Authentication

1. In your Supabase dashboard, go to **Authentication** > **Providers**
2. Make sure **Email** is enabled
3. Configure email settings:
   - **Enable Email Provider**: ON
   - **Confirm Email**: OFF (for simple family use)
   - **Secure Email Change**: OFF (for simple family use)

### Configure Site URL

1. Go to **Authentication** > **URL Configuration**
2. Set your Site URL:
   - For development: `http://localhost:3000`
   - For production: Your actual domain

3. Add Redirect URLs:
   - `http://localhost:3000/**` (for development)
   - Your production URL pattern (for production)

## 4. Optional: Set Up Row Level Security (RLS)

If you want to secure your database tables (stores, categories, deals), you can enable RLS:

### Example: Secure the `deals` table

```sql
-- Enable RLS on the deals table
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read all deals
CREATE POLICY "Allow authenticated users to read deals"
ON deals FOR SELECT
TO authenticated
USING (true);

-- Allow authenticated users to insert deals
CREATE POLICY "Allow authenticated users to insert deals"
ON deals FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update deals
CREATE POLICY "Allow authenticated users to update deals"
ON deals FOR UPDATE
TO authenticated
USING (true);

-- Allow authenticated users to delete deals
CREATE POLICY "Allow authenticated users to delete deals"
ON deals FOR DELETE
TO authenticated
USING (true);
```

Repeat similar policies for `stores` and `categories` tables.

## 5. Create Your First User

You have two options:

### Option A: Use the Sign Up Page
1. Start the development server: `npm run dev`
2. Navigate to: `http://localhost:3000/auth/signup`
3. Create an account with your email and password

### Option B: Create User in Supabase Dashboard
1. Go to **Authentication** > **Users**
2. Click **Add User**
3. Enter email and password
4. Click **Create User**

## 6. Test Authentication

1. Start the development server if not running:
   ```bash
   cd /home/user/foodplan-multi-agents/foodplan
   npm run dev
   ```

2. Visit `http://localhost:3000`
3. You should see "Sign In" and "Sign Up" buttons in the header
4. Click "Sign In" and log in with your credentials
5. After successful login, you should be redirected to `/dashboard`
6. You should see your email displayed in the header with a "Sign Out" button

## 7. Protected Routes

The following routes are automatically protected and require authentication:
- `/dashboard` - Main dashboard (already created)
- Any future routes starting with `/dashboard/*`

If a user tries to access these routes without being logged in, they'll be redirected to `/auth/signin`.

## Files Created

### Supabase Client Utilities
- `/lib/supabase/client.ts` - Browser client for Client Components
- `/lib/supabase/server.ts` - Server client for Server Components
- `/lib/supabase/middleware.ts` - Middleware helper for auth state

### Middleware
- `/middleware.ts` - Handles auth state refresh and route protection

### Authentication Pages
- `/app/auth/signin/page.tsx` - Sign in page
- `/app/auth/signup/page.tsx` - Sign up page

### Components
- `/components/AuthButton.tsx` - Sign in/out button with user email display
- `/components/UserProfile.tsx` - User profile display component

### Dashboard
- `/app/dashboard/page.tsx` - Protected dashboard page

### Configuration
- `.env.local` - Environment variables (YOU NEED TO FILL THIS IN)

## Troubleshooting

### "Invalid API key" error
- Make sure you've correctly copied the Anon key from Supabase
- Make sure there are no extra spaces in your `.env.local` file
- Restart the dev server after changing `.env.local`

### Redirect not working after sign in
- Check that your Site URL and Redirect URLs are configured in Supabase
- Make sure you're using `http://localhost:3000` (not `127.0.0.1`)

### Email not receiving confirmation
- Since this is for family use, we've disabled email confirmation
- Users can sign in immediately after signing up

## Next Steps

Once authentication is working, you can:
1. Add user profiles to store user preferences
2. Link meal plans to specific users
3. Add family member management
4. Set up RLS policies to ensure users only see their own data
