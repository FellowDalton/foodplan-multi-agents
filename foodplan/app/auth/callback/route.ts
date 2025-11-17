import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * OAuth Callback Handler
 *
 * This route handles the OAuth callback from Google authentication.
 * Flow:
 * 1. User initiates OAuth sign-in from /auth/signin
 * 2. User authenticates with Google
 * 3. Google redirects here with an authorization code
 * 4. We exchange the code for a Supabase session
 * 5. User is redirected to their intended destination
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/dashboard'

  // If there's no code, something went wrong with the OAuth flow
  if (!code) {
    console.error('OAuth callback: No code provided')
    return NextResponse.redirect(
      new URL('/auth/signin?error=no_code', requestUrl.origin)
    )
  }

  try {
    // Create Supabase client with cookie handling
    const supabase = await createClient()

    // Exchange the authorization code for a session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('OAuth callback error:', error.message)
      return NextResponse.redirect(
        new URL('/auth/signin?error=callback_failed', requestUrl.origin)
      )
    }

    if (!data.session) {
      console.error('OAuth callback: No session created')
      return NextResponse.redirect(
        new URL('/auth/signin?error=no_session', requestUrl.origin)
      )
    }

    // Session created successfully
    console.log('OAuth callback successful for user:', data.user?.email)

    // Redirect to the next URL (sanitize to prevent open redirect)
    // Ensure next URL is relative or same origin
    const nextUrl = next.startsWith('/')
      ? new URL(next, requestUrl.origin)
      : new URL('/dashboard', requestUrl.origin)

    return NextResponse.redirect(nextUrl)

  } catch (error) {
    // Catch any unexpected errors
    console.error('Unexpected error in OAuth callback:', error)
    return NextResponse.redirect(
      new URL('/auth/signin?error=callback_failed', requestUrl.origin)
    )
  }
}
