# Google OAuth Authentication Setup with Supabase

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Step 1: Configure Google Cloud Console](#step-1-configure-google-cloud-console)
- [Step 2: Configure Supabase Dashboard](#step-2-configure-supabase-dashboard)
- [Step 3: Configure Environment Variables](#step-3-configure-environment-variables)
- [Step 4: Test the Authentication Flow](#step-4-test-the-authentication-flow)
- [Understanding the Authentication Flow](#understanding-the-authentication-flow)
- [Implementation Details](#implementation-details)
- [Troubleshooting](#troubleshooting)
- [Security Best Practices](#security-best-practices)
- [FAQ](#faq)

---

## Overview

This guide walks you through setting up Google OAuth authentication for your FoodPlan application using Supabase as the authentication provider. With Google OAuth, users can sign in using their existing Google accounts without needing to create and remember separate credentials.

### What You'll Achieve

By following this guide, you'll enable users to:
- Sign in with their Google account
- Sign up for new accounts automatically through Google OAuth
- Have their sessions managed securely by Supabase
- Be automatically redirected to the dashboard after successful authentication

### Architecture Overview

The authentication system consists of:
- **Supabase Auth**: Handles OAuth flow and session management
- **Google Cloud Console**: Provides OAuth credentials
- **Next.js Application**: Frontend authentication pages and callback handler
- **Middleware**: Automatically refreshes user sessions on each request

---

## Prerequisites

Before you begin, ensure you have:

1. **A Supabase Project**
   - If you don't have one, create a free account at [https://supabase.com](https://supabase.com)
   - Note your project URL and API keys

2. **A Google Account**
   - Required to access Google Cloud Console
   - This can be a personal or organizational account

3. **Basic Understanding of:**
   - OAuth 2.0 flow (helpful but not required)
   - Environment variables
   - Next.js application structure

4. **Development Environment**
   - Node.js 18+ installed
   - Your FoodPlan project cloned and dependencies installed

---

## Step 1: Configure Google Cloud Console

### 1.1 Create a Google Cloud Project

1. Navigate to [Google Cloud Console](https://console.cloud.google.com)
2. Click on the project dropdown at the top of the page
3. Click "New Project"
4. Enter a project name (e.g., "FoodPlan Auth")
5. Select your organization if applicable
6. Click "Create"

**Screenshot Description**: You'll see a form with a "Project name" field, optional "Organization" dropdown, and "Location" field. The "Create" button is at the bottom right.

### 1.2 Enable Google+ API (or Google Identity Services)

1. In your Google Cloud Project, go to "APIs & Services" > "Library"
2. Search for "Google+ API" or "Google Identity Services"
3. Click on the API from the search results
4. Click "Enable"
5. Wait for the API to be enabled (usually takes a few seconds)

**Note**: Google is transitioning to Google Identity Services, but either will work for OAuth authentication.

### 1.3 Configure OAuth Consent Screen

1. Go to "APIs & Services" > "OAuth consent screen"
2. Select "External" user type (or "Internal" if using Google Workspace)
3. Click "Create"

4. **Fill in App Information:**
   - App name: `FoodPlan` (or your app name)
   - User support email: Your email address
   - App logo: (Optional) Upload your app logo
   - App domain: Leave blank for development

5. **Add Developer Contact Information:**
   - Email addresses: Your email address
   - Click "Save and Continue"

6. **Scopes Section:**
   - Click "Add or Remove Scopes"
   - Add these scopes:
     - `userinfo.email`
     - `userinfo.profile`
   - Click "Update"
   - Click "Save and Continue"

7. **Test Users Section:**
   - For development, add your test user email addresses
   - Click "Save and Continue"

8. **Summary:**
   - Review your settings
   - Click "Back to Dashboard"

**Screenshot Description**: The OAuth consent screen configuration has multiple steps shown as tabs at the top. Each step has forms to fill out with various fields and dropdowns.

### 1.4 Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" at the top
3. Select "OAuth client ID"

4. **Configure the OAuth Client:**
   - Application type: Select "Web application"
   - Name: `FoodPlan Web Client` (or any name you prefer)

5. **Add Authorized JavaScript Origins:**
   - For local development:
     ```
     http://localhost:3000
     ```
   - For production:
     ```
     https://your-production-domain.com
     ```

6. **Add Authorized Redirect URIs:**

   This is the most critical step! You need to add the Supabase callback URL.

   The format is: `https://<your-project-ref>.supabase.co/auth/v1/callback`

   **How to find your project-ref:**
   - Go to your Supabase dashboard
   - Your project URL looks like: `https://abcdefghijklmnop.supabase.co`
   - The part before `.supabase.co` is your project-ref (e.g., `abcdefghijklmnop`)

   **Add this exact URL:**
   ```
   https://your-project-ref.supabase.co/auth/v1/callback
   ```

   Replace `your-project-ref` with your actual Supabase project reference ID.

7. Click "Create"

8. **Save Your Credentials:**
   - A modal will appear with your Client ID and Client Secret
   - **IMPORTANT**: Copy both values immediately
   - Client ID: Looks like `123456789-abc123def456.apps.googleusercontent.com`
   - Client Secret: Looks like `GOCSPX-abc123def456ghi789`
   - Store these securely - you'll need them in the next step

**Screenshot Description**: The credentials page shows a table with your OAuth 2.0 Client IDs. After creation, you'll see a modal with your Client ID and Client Secret with copy buttons next to each.

---

## Step 2: Configure Supabase Dashboard

### 2.1 Access Authentication Settings

1. Go to your Supabase Dashboard at [https://app.supabase.com](https://app.supabase.com)
2. Select your project
3. Navigate to "Authentication" in the left sidebar
4. Click on "Providers" (or "Auth Providers")

**Screenshot Description**: The sidebar has icons and labels. Authentication section includes sub-items like Users, Policies, Providers, etc.

### 2.2 Enable Google Provider

1. In the providers list, find "Google"
2. Click on "Google" to open its configuration
3. Toggle "Enable Sign in with Google" to ON

### 2.3 Configure Google Provider

Fill in the following fields:

1. **Client ID (OAuth)**
   - Paste the Client ID you copied from Google Cloud Console
   - Format: `123456789-abc123def456.apps.googleusercontent.com`

2. **Client Secret (OAuth)**
   - Paste the Client Secret you copied from Google Cloud Console
   - Format: `GOCSPX-abc123def456ghi789`

3. **Redirect URL**
   - This should be automatically filled in
   - Verify it shows: `https://<your-project-ref>.supabase.co/auth/v1/callback`
   - This is the URL you added to Google Cloud Console

4. **Additional Settings (Optional):**
   - Skip if duplicate emails: OFF (default)
   - You can leave other advanced settings as default

5. Click "Save" at the bottom of the form

**Screenshot Description**: The Google provider configuration form has input fields for Client ID and Client Secret, followed by a read-only field showing the redirect URL. There are also toggle switches for various options.

### 2.4 Verify Configuration

After saving:
1. The Google provider should now show as "Enabled" with a green indicator
2. Verify the redirect URL matches what you configured in Google Cloud Console
3. If there's a mismatch, you'll get authentication errors

---

## Step 3: Configure Environment Variables

### 3.1 Locate Your Supabase Credentials

1. In your Supabase Dashboard, go to "Settings" > "API"
2. You'll find:
   - **Project URL**: `https://your-project-ref.supabase.co`
   - **Anon public key**: A long JWT token starting with `eyJ...`
   - **Service role key**: Another JWT token (keep this secret!)

### 3.2 Update Your .env File

1. In your FoodPlan project root, find or create a `.env` file
2. If you have a `.env.sample` file, copy it to `.env`:
   ```bash
   cp .env.sample .env
   ```

3. Update the following variables in your `.env` file:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key-here

# Optional: Service role key for admin operations
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**Important Notes:**
- Replace `your-project-ref` with your actual Supabase project reference
- Replace the keys with your actual keys from the Supabase dashboard
- The `NEXT_PUBLIC_` prefix means these variables are exposed to the browser
- The service role key should NEVER be exposed to the browser (no `NEXT_PUBLIC_` prefix)
- **NO additional Google OAuth environment variables are needed!** The Google credentials are stored in Supabase, not in your application.

### 3.3 Verify Your Configuration

Your `.env` file should look something like this (with your actual values):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYyMzAwMDAwMCwiZXhwIjoxOTM4NTc2MDAwfQ.abc123def456
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjIzMDAwMDAwLCJleHAiOjE5Mzg1NzYwMDB9.xyz789abc123
```

### 3.4 Restart Your Development Server

After updating environment variables, restart your development server:

```bash
npm run dev
```

The server should start without errors. If you see errors about missing environment variables, double-check your `.env` file.

---

## Step 4: Test the Authentication Flow

### 4.1 Start Your Application

1. Ensure your development server is running:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:3000/auth/signin
   ```

### 4.2 Test Sign In

1. You should see a "Sign in to your account" page
2. Click the "Sign in with Google" button
3. You'll be redirected to Google's login page

**What happens during the redirect:**
- The button shows "Redirecting to Google..."
- Your browser navigates to `accounts.google.com`
- Google displays its OAuth consent screen

### 4.3 Google OAuth Consent

On Google's page, you'll:
1. See which Google account you're signed in with
2. See what permissions the app is requesting:
   - Access to your email address
   - Access to your basic profile information
3. Click "Continue" or "Allow" to grant permissions

**First-time users:** If this is the first time using this app, you might see additional consent screens.

### 4.4 Callback and Redirect

After clicking "Allow":
1. Google redirects back to your app at `/auth/callback`
2. The callback handler exchanges the authorization code for a session
3. You're automatically redirected to `/dashboard` (or the specified `next` parameter)
4. You should now be logged in!

### 4.5 Verify Authentication

To verify you're logged in:

1. **Check the Network Tab:**
   - Open browser DevTools (F12)
   - Go to Application > Cookies
   - Look for Supabase session cookies (they start with `sb-`)

2. **Check Your Dashboard:**
   - You should see your authenticated dashboard page
   - If your app displays user info, you should see your name/email

3. **Check Supabase Dashboard:**
   - Go to Supabase Dashboard > Authentication > Users
   - You should see your new user entry with your Google email

### 4.6 Test Sign Out and Sign Up

1. **Test Sign Out:**
   - If you have a sign-out button, click it
   - You should be logged out and cookies cleared
   - Navigate to `/auth/signin` again to test re-authentication

2. **Test Sign Up Flow:**
   - Navigate to `/auth/signup`
   - Click "Sign up with Google"
   - The flow is identical to sign-in (Google handles both cases)
   - If you're already authenticated with Google, it may skip the consent screen

---

## Understanding the Authentication Flow

### Complete OAuth Flow Diagram

```
User                     Your App              Supabase              Google
 |                          |                     |                     |
 |  1. Click "Sign in"      |                     |                     |
 |------------------------->|                     |                     |
 |                          |                     |                     |
 |                          | 2. Request OAuth    |                     |
 |                          |   with redirectTo   |                     |
 |                          |-------------------->|                     |
 |                          |                     |                     |
 |                          |                     | 3. Redirect to      |
 |                          |                     |    Google OAuth     |
 |                          |                     |-------------------->|
 |                          |                     |                     |
 |  4. Google consent page  |                     |                     |
 |<--------------------------------------------------------------------|
 |                          |                     |                     |
 |  5. User approves        |                     |                     |
 |-------------------------------------------------------------------->|
 |                          |                     |                     |
 |                          |                     | 6. Auth code        |
 |                          |                     |<--------------------|
 |                          |                     |                     |
 |  7. Redirect to callback |                     |                     |
 |<-------------------------------------------------|                     |
 |  /auth/callback?code=... |                     |                     |
 |                          |                     |                     |
 |  8. GET /auth/callback   |                     |                     |
 |------------------------->|                     |                     |
 |                          |                     |                     |
 |                          | 9. Exchange code    |                     |
 |                          |    for session      |                     |
 |                          |-------------------->|                     |
 |                          |                     |                     |
 |                          | 10. Session + User  |                     |
 |                          |<--------------------|                     |
 |                          |                     |                     |
 |  11. Set cookies &       |                     |                     |
 |      redirect to app     |                     |                     |
 |<-------------------------|                     |                     |
 |  (Now authenticated)     |                     |                     |
```

### Key Components Explained

#### 1. Sign-In Page (`/app/auth/signin/page.tsx`)

This is where users initiate authentication:

```typescript
const { error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
  },
})
```

**What it does:**
- Creates a Supabase client using browser context
- Calls `signInWithOAuth` with provider set to 'google'
- Specifies where to redirect after successful authentication
- The `redirectTo` URL points to your callback handler
- Supabase handles the actual redirect to Google

#### 2. Callback Handler (`/app/auth/callback/route.ts`)

This API route handles the OAuth callback:

```typescript
export async function GET(request: NextRequest) {
  const code = requestUrl.searchParams.get('code')
  const supabase = await createClient()
  const { data, error } = await supabase.auth.exchangeCodeForSession(code)
  // ... redirect user to dashboard
}
```

**What it does:**
- Extracts the authorization code from the URL query parameter
- Creates a server-side Supabase client with cookie handling
- Exchanges the code for a full user session
- Sets secure HTTP-only cookies with the session tokens
- Redirects the user to their intended destination (e.g., `/dashboard`)
- Handles errors and redirects back to sign-in if something fails

#### 3. Supabase Client Files

**Browser Client (`/lib/supabase/client.ts`):**
```typescript
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```
- Used in client components (pages, interactive UI)
- Reads session from cookies automatically
- Handles real-time subscriptions

**Server Client (`/lib/supabase/server.ts`):**
```typescript
export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) { /* ... */ },
      },
    }
  )
}
```
- Used in server components and API routes
- Explicitly handles cookie reading and writing
- Required for Server Components in Next.js 13+

**Middleware Client (`/lib/supabase/middleware.ts`):**
```typescript
export async function updateSession(request: NextRequest) {
  // Creates Supabase client with middleware cookie handling
  // Gets user session
  // Updates cookies if needed
  // Returns response with fresh cookies
}
```
- Runs on every request (configured in `middleware.ts`)
- Automatically refreshes expired sessions
- Keeps cookies in sync between browser and server
- Critical for maintaining login state

#### 4. Middleware Configuration (`/middleware.ts`)

```typescript
export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
```

**What it does:**
- Intercepts all requests (except static files and images)
- Calls `updateSession` to refresh the user's session
- Ensures cookies are always up to date
- Prevents users from being logged out due to expired tokens

### Session Management

**Cookie Names:**
- `sb-<project-ref>-auth-token`: Access token (short-lived, ~1 hour)
- `sb-<project-ref>-auth-token-code-verifier`: PKCE verifier for security

**Session Lifecycle:**
1. **Creation**: When user completes OAuth flow
2. **Storage**: Stored as HTTP-only cookies (secure, not accessible to JavaScript)
3. **Refresh**: Automatically refreshed by middleware before expiration
4. **Validation**: Checked on every request by middleware
5. **Expiration**: Access tokens expire after ~1 hour, refresh tokens after 7 days (configurable)

---

## Implementation Details

### Files Created/Modified

Here's a complete list of files that implement Google OAuth authentication:

#### Authentication Pages

1. **`/app/auth/signin/page.tsx`**
   - Sign-in page with Google OAuth button
   - Client-side component
   - Handles OAuth initiation
   - Displays loading states and errors

2. **`/app/auth/signup/page.tsx`**
   - Sign-up page (functionally identical to sign-in for OAuth)
   - Explains that accounts are created automatically
   - Uses the same OAuth flow

#### API Routes

3. **`/app/auth/callback/route.ts`**
   - OAuth callback handler (API route)
   - Exchanges authorization code for session
   - Sets secure cookies
   - Handles errors and redirects
   - Server-side only

#### Supabase Utilities

4. **`/lib/supabase/client.ts`**
   - Browser-side Supabase client factory
   - Used in Client Components
   - Reads session from cookies

5. **`/lib/supabase/server.ts`**
   - Server-side Supabase client factory
   - Used in Server Components and API routes
   - Handles cookie reading and writing

6. **`/lib/supabase/middleware.ts`**
   - Middleware-specific Supabase client
   - Session refresh logic
   - Cookie synchronization

#### Middleware

7. **`/middleware.ts`**
   - Next.js middleware entry point
   - Calls Supabase session updater
   - Runs on every request
   - Configured to ignore static files

### Code Examples

#### How to Check Authentication in Server Components

```typescript
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function ProtectedPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/signin')
  }

  return (
    <div>
      <h1>Welcome, {user.email}</h1>
      {/* Protected content */}
    </div>
  )
}
```

#### How to Check Authentication in Client Components

```typescript
'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export default function ProfileComponent() {
  const [user, setUser] = useState(null)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (!user) return <div>Not logged in</div>

  return <div>Logged in as {user.email}</div>
}
```

#### How to Sign Out

```typescript
'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function SignOutButton() {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth/signin')
    router.refresh() // Refresh to clear server-side cache
  }

  return (
    <button onClick={handleSignOut}>
      Sign Out
    </button>
  )
}
```

---

## Troubleshooting

### Common Errors and Solutions

#### Error: "redirect_uri_mismatch"

**Symptom:** Google shows an error page saying the redirect URI doesn't match.

**Cause:** The redirect URI in Google Cloud Console doesn't match what Supabase is sending.

**Solution:**
1. Go to Google Cloud Console > Credentials
2. Edit your OAuth 2.0 Client ID
3. Verify the Authorized Redirect URI is EXACTLY:
   ```
   https://<your-project-ref>.supabase.co/auth/v1/callback
   ```
4. Make sure there are no extra spaces or trailing slashes
5. Click "Save"
6. Wait 5-10 minutes for changes to propagate
7. Clear your browser cache and try again

#### Error: "invalid_client"

**Symptom:** Google OAuth fails with "invalid_client" error.

**Cause:** Client ID or Client Secret is incorrect in Supabase.

**Solution:**
1. Go to Google Cloud Console > Credentials
2. Click on your OAuth 2.0 Client ID
3. Copy the Client ID and Client Secret again
4. Go to Supabase Dashboard > Authentication > Providers > Google
5. Paste the credentials again (ensure no extra spaces)
6. Click "Save"
7. Try authenticating again

#### Error: "Access blocked: This app's request is invalid"

**Symptom:** Google shows this error when trying to authenticate.

**Cause:** OAuth consent screen is not properly configured or app is not verified.

**Solution:**
1. Go to Google Cloud Console > OAuth consent screen
2. Ensure all required fields are filled:
   - App name
   - User support email
   - Developer contact email
3. Ensure the app is in "Testing" mode with your email as a test user
4. Ensure required scopes are added (`userinfo.email`, `userinfo.profile`)
5. Click "Save and Continue"

#### Error: "Cookies not set" or "Session not found"

**Symptom:** After successful Google authentication, the user is not logged in.

**Cause:** Cookies are not being set properly, often due to middleware issues or browser settings.

**Solution:**
1. Verify middleware is properly configured:
   - Check `/middleware.ts` exists and calls `updateSession`
   - Verify the `matcher` config allows authentication routes
2. Check browser settings:
   - Ensure cookies are enabled
   - Disable "Block third-party cookies" for localhost
3. Check environment variables:
   - Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
   - Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct
4. Clear browser cookies and try again
5. Check browser console for cookie-related errors

#### Error: "No session created" after callback

**Symptom:** Callback succeeds but no session is established.

**Cause:** Code exchange failed or cookies weren't set properly.

**Solution:**
1. Check server logs for errors in the callback handler
2. Verify Supabase credentials in `.env` are correct
3. Ensure `createClient` in server context is using the server client (not browser client)
4. Try enabling verbose logging in the callback route:
   ```typescript
   console.log('Code:', code)
   console.log('Exchange result:', data, error)
   ```
5. Check that your Supabase project is not paused or rate-limited

#### Error: "Failed to fetch" or network errors

**Symptom:** Authentication fails with network or fetch errors.

**Cause:** Environment variables are incorrect or Supabase project is unreachable.

**Solution:**
1. Verify your `.env` file:
   - `NEXT_PUBLIC_SUPABASE_URL` should start with `https://`
   - Should end with `.supabase.co`
   - No trailing slash
2. Check your Supabase project status in the dashboard
3. Verify your project is not paused (free tier projects pause after inactivity)
4. Test connectivity to Supabase:
   ```bash
   curl https://your-project-ref.supabase.co
   ```
5. Restart your development server after changing `.env`

#### Users Can't Access Protected Routes

**Symptom:** Users are authenticated but get redirected to login when accessing protected pages.

**Cause:** Server-side session is not being read correctly.

**Solution:**
1. Ensure you're using the correct Supabase client:
   - Server Components: `import { createClient } from '@/lib/supabase/server'`
   - Client Components: `import { createClient } from '@/lib/supabase/client'`
   - API Routes: Use server client
2. Check that middleware is running on the protected route
3. Verify cookies are being sent with requests (check DevTools > Network)
4. Try clearing cookies and logging in again

---

## Security Best Practices

### Environment Variables

1. **Never Commit `.env` to Git**
   - Add `.env` to `.gitignore`
   - Use `.env.sample` as a template
   - Document what variables are needed

2. **Protect Your Service Role Key**
   - Never use it in client-side code
   - Never expose it in environment variables starting with `NEXT_PUBLIC_`
   - Only use it in server-side code or API routes
   - Treat it like a password

3. **Use Different Projects for Development and Production**
   - Create separate Supabase projects
   - Use different Google OAuth clients
   - Prevents accidental exposure of production data

### OAuth Configuration

1. **Restrict Authorized Domains**
   - In Google Cloud Console, only add domains you control
   - Remove unnecessary redirect URIs
   - Don't use wildcard domains

2. **Use HTTPS in Production**
   - Never use HTTP for OAuth in production
   - Ensure SSL/TLS is properly configured
   - Supabase handles this for the callback, but your app needs it too

3. **Validate Redirect URLs**
   - The callback handler validates the `next` parameter
   - Only allow relative URLs or same-origin URLs
   - Prevents open redirect vulnerabilities

### Session Management

1. **Use HTTP-Only Cookies**
   - Supabase automatically sets cookies as HTTP-only
   - This prevents XSS attacks from stealing tokens
   - Never try to access these cookies with JavaScript

2. **Enable Middleware for All Routes**
   - Ensures sessions are always refreshed
   - Prevents expired token issues
   - Keeps security tokens up to date

3. **Implement Proper Sign-Out**
   - Call `supabase.auth.signOut()`
   - Clear any local state
   - Redirect to public page
   - Use `router.refresh()` to clear server cache

### User Data

1. **Minimal Scope Requests**
   - Only request scopes you need (email, profile)
   - Don't ask for calendar, drive, etc. unless necessary
   - Users trust you more with minimal requests

2. **Handle User Data Responsibly**
   - Don't store Google tokens in your database (Supabase handles this)
   - Only store necessary user information
   - Follow GDPR/privacy regulations
   - Provide a way for users to delete their data

### Production Checklist

Before deploying to production:

- [ ] Google OAuth consent screen is verified (or publish app for external users)
- [ ] Production domain is added to Authorized JavaScript Origins
- [ ] Production Supabase callback URL is added to Authorized Redirect URIs
- [ ] All environment variables are set in your hosting platform
- [ ] HTTPS is enabled on your domain
- [ ] Test OAuth flow in production environment
- [ ] Error logging is configured
- [ ] Session timeout is appropriate for your use case
- [ ] Privacy policy and terms of service are linked from OAuth consent screen

---

## FAQ

### General Questions

**Q: Do I need to create different OAuth clients for development and production?**

A: It's recommended but not required. You can use one OAuth client and add both localhost and production URLs to the Authorized Redirect URIs. However, using separate clients gives you better tracking and security isolation.

**Q: Can users sign in with other providers besides Google?**

A: Yes! Supabase supports many providers (GitHub, Facebook, Apple, etc.). You'd need to configure each provider separately in both the provider's developer console and Supabase dashboard. The code implementation would be similar.

**Q: What happens if a user signs in with Google, then tries to sign up again?**

A: Supabase recognizes the email and associates it with the existing account. The user will be signed in to their existing account. There's no duplicate account creation.

**Q: How long do sessions last?**

A: Access tokens expire after approximately 1 hour. Refresh tokens expire after 7 days by default. The middleware automatically refreshes tokens before they expire, so users stay logged in as long as they're active.

**Q: Can I customize the Google OAuth consent screen?**

A: Yes, in Google Cloud Console under "OAuth consent screen", you can customize the app name, logo, privacy policy URL, and terms of service URL.

### Technical Questions

**Q: Why do I need three different Supabase clients (client, server, middleware)?**

A: Each has a different use case:
- **Client**: For browser/React components, works with React hooks and real-time features
- **Server**: For Server Components and API routes, handles cookies properly in Next.js
- **Middleware**: For session refresh on every request, uses a different cookie API

**Q: Can I use email/password authentication alongside Google OAuth?**

A: Yes! Supabase supports multiple authentication methods simultaneously. You can add a traditional email/password sign-in form next to the Google button. Users can choose their preferred method.

**Q: How do I get user information after they sign in?**

A: Use `supabase.auth.getUser()`:
```typescript
const { data: { user } } = await supabase.auth.getUser()
// user.email, user.user_metadata, etc.
```

**Q: Where is user data stored?**

A: User data is stored in Supabase's `auth.users` table. You can create additional tables that reference the user ID. Google profile information is in `user.user_metadata`.

**Q: Can I customize what data I get from Google?**

A: You can request additional scopes, but be aware this requires additional permissions from users. Example:
```typescript
await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    scopes: 'email profile https://www.googleapis.com/auth/calendar.readonly'
  }
})
```

**Q: How do I handle user profile pictures from Google?**

A: Google profile pictures are available in user metadata:
```typescript
const { data: { user } } = await supabase.auth.getUser()
const avatarUrl = user.user_metadata.avatar_url
```

**Q: What's the difference between NEXT_PUBLIC_ variables and regular environment variables?**

A: `NEXT_PUBLIC_` variables are exposed to the browser and can be used in client components. Regular variables are server-side only. NEVER put sensitive data (like service role keys) in `NEXT_PUBLIC_` variables.

### Troubleshooting Questions

**Q: Why am I getting logged out after a few minutes?**

A: This usually means middleware isn't running or cookies aren't being set properly. Verify:
1. Middleware is configured correctly
2. Cookie matcher includes your routes
3. Browser allows cookies

**Q: The OAuth flow redirects to Google but then fails. Why?**

A: Common causes:
1. Redirect URI mismatch between Google and Supabase
2. OAuth consent screen not configured
3. App not in testing mode with your email as test user
4. Google+ API not enabled

**Q: Can I test this without deploying to production?**

A: Yes! You can use `localhost:3000` as an Authorized JavaScript Origin. Google OAuth works perfectly on localhost for testing.

**Q: How do I debug OAuth issues?**

A:
1. Check browser console for errors
2. Check Network tab for failed requests
3. Add console.log statements in callback handler
4. Check Supabase logs in dashboard
5. Verify all URLs match exactly (no trailing slashes, correct protocol)

**Q: Does this work with Next.js app router?**

A: Yes! This implementation is built for Next.js 13+ with the app router. It uses Server Components, route handlers, and middleware properly.

---

## Additional Resources

### Documentation Links

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Supabase OAuth Guide](https://supabase.com/docs/guides/auth/social-login)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Next.js Authentication Patterns](https://nextjs.org/docs/authentication)

### Support

If you encounter issues not covered in this guide:

1. Check the Supabase Discord community
2. Review GitHub issues in the Supabase repository
3. Check Google's OAuth troubleshooting guide
4. Consult Next.js documentation for SSR/middleware issues

---

## Conclusion

You now have a fully functional Google OAuth authentication system! Users can sign in securely using their Google accounts, and sessions are automatically managed by Supabase and your Next.js middleware.

### What You've Accomplished

- Configured Google OAuth in Google Cloud Console
- Enabled Google provider in Supabase
- Set up environment variables
- Implemented sign-in, sign-up, and callback pages
- Configured automatic session refresh with middleware
- Learned security best practices
- Prepared for production deployment

### Next Steps

1. **Customize the UI**: Style the sign-in/sign-up pages to match your brand
2. **Add Protected Routes**: Create pages that require authentication
3. **User Profile**: Create a profile page where users can view/edit their information
4. **Dashboard**: Build a dashboard that shows user-specific data
5. **Add Other Providers**: Consider adding GitHub, Facebook, or other OAuth providers
6. **Deploy**: Follow the production checklist and deploy your application

Happy coding!
