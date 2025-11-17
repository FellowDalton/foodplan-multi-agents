# Supabase Google OAuth Authentication Setup Guide

This guide will help you set up Google OAuth authentication with Supabase for the Foodplan app.

## Overview

The Foodplan app uses **Google OAuth** for authentication, providing a secure and user-friendly sign-in experience. Users can sign in with their existing Google accounts instead of creating new passwords.

## 1. Get Your Supabase Credentials

1. Go to your Supabase project dashboard: https://app.supabase.com
2. Navigate to **Settings** > **API**
3. Copy the following values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **Project Reference** (the `xxxxx` part of your URL)
   - **Anon/Public Key** (starts with `eyJhbG...`)

## 2. Configure Environment Variables

1. In the `/home/user/foodplan-multi-agents/foodplan/` directory, create a `.env.local` file
2. Add your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here
```

**Note:** No additional environment variables are needed for Google OAuth. The configuration is done through the Supabase dashboard.

## 3. Set Up Google Cloud Console

### Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click **Select a project** → **New Project**
3. Enter a project name (e.g., "Foodplan Auth")
4. Click **Create**
5. Wait for the project to be created and select it

### Enable Google+ API

1. In the Google Cloud Console, navigate to **APIs & Services** > **Library**
2. Search for "Google+ API"
3. Click on it and click **Enable**

### Configure OAuth Consent Screen

1. Go to **APIs & Services** > **OAuth consent screen**
2. Select **External** user type (unless you have a Google Workspace)
3. Click **Create**
4. Fill in the required fields:
   - **App name**: Foodplan
   - **User support email**: Your email
   - **Developer contact information**: Your email
5. Click **Save and Continue**
6. Skip the Scopes section (click **Save and Continue**)
7. Add test users if needed (your own email)
8. Click **Save and Continue**

### Create OAuth 2.0 Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. Choose **Web application**
4. Enter a name (e.g., "Foodplan Web Client")
5. Under **Authorized redirect URIs**, add:
   ```
   https://<your-project-ref>.supabase.co/auth/v1/callback
   ```
   Replace `<your-project-ref>` with your actual Supabase project reference (e.g., `abcdefghijk`)
6. Click **Create**
7. **IMPORTANT:** Copy the **Client ID** and **Client Secret** - you'll need these in the next step

## 4. Configure Supabase Authentication

### Enable Google Provider

1. In your Supabase dashboard, go to **Authentication** > **Providers**
2. Find **Google** in the list of providers
3. Toggle it **ON**
4. Paste your Google OAuth credentials:
   - **Client ID**: From Google Cloud Console
   - **Client Secret**: From Google Cloud Console
5. The **Redirect URL** should already be filled in:
   ```
   https://<your-project-ref>.supabase.co/auth/v1/callback
   ```
6. Click **Save**

### Configure Site URL and Redirect URLs

1. In Supabase dashboard, go to **Authentication** > **URL Configuration**
2. Set your **Site URL**:
   - For development: `http://localhost:3000`
   - For production: Your actual domain (e.g., `https://foodplan.example.com`)
3. Add **Redirect URLs**:
   - `http://localhost:3000/auth/callback` (for development)
   - `https://your-domain.com/auth/callback` (for production)

## 5. Test Google OAuth Authentication

### Start the Development Server

```bash
cd /home/user/foodplan-multi-agents/foodplan
npm run dev
```

### Test the Sign-In Flow

1. Visit `http://localhost:3000`
2. You should see "Sign In" and "Sign Up" buttons in the header
3. Click **"Sign In"** or **"Sign Up"**
4. Click the **"Sign in with Google"** button
5. You'll be redirected to Google's login page
6. Choose your Google account and grant permissions
7. You'll be redirected back to the app at `/dashboard`
8. Your email should be displayed in the header with a "Sign Out" button

**First-time users:** When you sign in with Google for the first time, Supabase automatically creates your account. There's no separate sign-up process with OAuth!

## 6. How It Works

### Authentication Flow

```
1. User clicks "Sign in with Google"
   ↓
2. App redirects to Google login page
   ↓
3. User authenticates with Google
   ↓
4. Google redirects to: https://<project>.supabase.co/auth/v1/callback?code=xxx
   ↓
5. Supabase exchanges code for session
   ↓
6. Supabase redirects to: http://localhost:3000/auth/callback?next=/dashboard
   ↓
7. App callback handler sets session cookies
   ↓
8. User is redirected to /dashboard
```

### Files Involved

**Supabase Client Utilities:**
- `/lib/supabase/client.ts` - Browser client for Client Components
- `/lib/supabase/server.ts` - Server client for Server Components
- `/lib/supabase/middleware.ts` - Middleware helper for auth state

**Authentication Pages:**
- `/app/auth/signin/page.tsx` - Sign in page with Google OAuth button
- `/app/auth/signup/page.tsx` - Sign up page with Google OAuth button
- `/app/auth/callback/route.ts` - OAuth callback handler

**Middleware:**
- `/middleware.ts` - Handles auth state refresh and route protection

**Components:**
- `/components/AuthButton.tsx` - Sign in/out button with user email display
- `/components/UserProfile.tsx` - User profile display component

**Dashboard:**
- `/app/dashboard/page.tsx` - Protected dashboard page

## 7. Protected Routes

The following routes are automatically protected and require authentication:
- `/dashboard` - Main dashboard
- Any routes starting with `/dashboard/*`

If a user tries to access these routes without being logged in, they'll be redirected to `/auth/signin`.

## 8. Optional: Set Up Row Level Security (RLS)

If you want to secure your database tables, enable RLS:

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

Repeat similar policies for other tables (`stores`, `categories`, `meal_plans`, etc.)

## Troubleshooting

### "redirect_uri_mismatch" error

**Problem:** Google OAuth returns an error about redirect URI mismatch.

**Solution:**
1. Verify the redirect URI in Google Cloud Console exactly matches:
   ```
   https://<your-project-ref>.supabase.co/auth/v1/callback
   ```
2. Make sure you used your actual Supabase project reference (not a placeholder)
3. Check for typos, extra spaces, or http vs https
4. Wait a few minutes after adding the redirect URI (Google needs time to propagate changes)

### "invalid_client" error

**Problem:** Google returns an invalid client error.

**Solution:**
1. Verify your Client ID and Client Secret are correct in Supabase dashboard
2. Make sure you copied them without extra spaces
3. Try regenerating the credentials in Google Cloud Console

### "Access blocked" error

**Problem:** Google says "This app isn't verified" or "Access blocked: Foodplan has not completed the Google verification process"

**Solution:**
1. This is normal for apps in development
2. Add your email as a test user in Google Cloud Console:
   - Go to **OAuth consent screen**
   - Under "Test users", click **Add Users**
   - Add your email address
3. For production, you'll need to verify your app with Google

### Authentication works but user isn't redirected

**Problem:** User signs in successfully but stays on the auth page.

**Solution:**
1. Check that your Redirect URLs are configured in Supabase:
   - `http://localhost:3000/auth/callback`
2. Make sure you're using `http://localhost:3000` (not `127.0.0.1`)
3. Check browser console for errors
4. Verify the callback route exists at `/app/auth/callback/route.ts`

### "Invalid API key" error

**Problem:** App shows "Supabase not configured" or similar error.

**Solution:**
1. Make sure you've correctly copied the Anon key from Supabase
2. Check there are no extra spaces in your `.env.local` file
3. Restart the dev server after changing `.env.local`
4. Verify the environment variable names start with `NEXT_PUBLIC_`

### Session not persisting after refresh

**Problem:** User gets logged out when refreshing the page.

**Solution:**
1. Check that middleware is properly configured
2. Verify cookies are being set correctly (check browser DevTools → Application → Cookies)
3. Make sure you're not in private/incognito mode (cookies may not persist)
4. Check that the middleware is updating the session on each request

## Advanced Configuration

### Using Multiple OAuth Providers

You can add more OAuth providers (GitHub, Twitter, etc.) by:
1. Enabling them in Supabase dashboard
2. Configuring their respective developer consoles
3. The sign-in pages will automatically show all enabled providers

### Customizing the OAuth Flow

You can customize the redirect behavior by modifying the `redirectTo` parameter in:
- `/app/auth/signin/page.tsx`
- `/app/auth/signup/page.tsx`

Example:
```typescript
const { error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${window.location.origin}/auth/callback?next=/custom-page`,
  },
})
```

### Handling User Metadata

Google OAuth automatically provides:
- User's email
- User's full name
- User's profile picture URL

Access this data in your app:
```typescript
const { data: { user } } = await supabase.auth.getUser()

console.log(user.email)
console.log(user.user_metadata.full_name)
console.log(user.user_metadata.avatar_url)
```

## Next Steps

Once authentication is working, you can:
1. ✅ Users can sign in with Google OAuth
2. Create user profiles to store preferences
3. Link meal plans to specific users
4. Add family member management
5. Set up RLS policies to ensure users only see their own data
6. Add profile picture display using `user.user_metadata.avatar_url`
7. Customize the dashboard experience per user

## Additional Resources

- [Detailed Google OAuth Setup Guide](./docs/GOOGLE_AUTH_SETUP.md) - 35KB comprehensive guide
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Next.js App Router with Supabase](https://supabase.com/docs/guides/auth/server-side/nextjs)

## Security Best Practices

1. **Never commit secrets**: Keep `.env.local` in `.gitignore`
2. **Use RLS**: Always enable Row Level Security on sensitive tables
3. **Validate redirect URLs**: Only allow trusted domains in Supabase URL Configuration
4. **Keep dependencies updated**: Regularly update `@supabase/supabase-js` and `@supabase/ssr`
5. **Use HTTPS in production**: Never use HTTP for production authentication flows
6. **Review OAuth scopes**: Only request the minimum permissions needed from Google
7. **Monitor auth logs**: Check Supabase dashboard for suspicious authentication attempts

---

**Note:** This app uses Google OAuth exclusively. Email/password authentication has been replaced. If you need email/password auth, you'll need to modify the sign-in/sign-up pages to include those forms.
