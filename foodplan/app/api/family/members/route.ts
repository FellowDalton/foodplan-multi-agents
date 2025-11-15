import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/**
 * GET /api/family/members
 * Get all parent accounts that belong to the user's family
 *
 * Returns the list of parent accounts (husband & wife) who can manage the family
 */
export async function GET() {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // First, get the user's family_id
    const { data: userMembership, error: membershipError } = await supabase
      .from('family_members')
      .select('family_id')
      .eq('user_id', user.id)
      .single()

    if (membershipError) {
      console.error('Error fetching user membership:', membershipError)
      return NextResponse.json(
        { error: 'You do not belong to a family' },
        { status: 404 }
      )
    }

    // Get all members of this family
    const { data: members, error: membersError } = await supabase
      .from('family_members')
      .select('user_id, role, created_at')
      .eq('family_id', userMembership.family_id)

    if (membersError) {
      console.error('Error fetching family members:', membersError)
      return NextResponse.json(
        { error: 'Failed to fetch family members' },
        { status: 500 }
      )
    }

    return NextResponse.json({ members })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/family/members
 * Invite another parent to join the family
 *
 * Body: { email: string } - Email of the other parent to invite
 *
 * For MVP: This just validates the request and returns the family ID
 * The other parent will need to:
 * 1. Sign up with their own auth account
 * 2. Use the family ID to join during their setup
 *
 * Future enhancement: Send email invitation with magic link
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Validate email
    if (!body.email || typeof body.email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Get user's family
    const { data: userMembership, error: membershipError } = await supabase
      .from('family_members')
      .select('family_id')
      .eq('user_id', user.id)
      .single()

    if (membershipError) {
      console.error('Error fetching user membership:', membershipError)
      return NextResponse.json(
        { error: 'You do not belong to a family' },
        { status: 404 }
      )
    }

    // Check how many parents already exist in this family
    const { data: existingMembers, error: countError } = await supabase
      .from('family_members')
      .select('user_id')
      .eq('family_id', userMembership.family_id)

    if (countError) {
      console.error('Error counting family members:', countError)
      return NextResponse.json(
        { error: 'Failed to check family members' },
        { status: 500 }
      )
    }

    if (existingMembers && existingMembers.length >= 2) {
      return NextResponse.json(
        { error: 'Family already has 2 parent accounts' },
        { status: 400 }
      )
    }

    // For MVP: Return the family ID that the other parent can use to join
    // In production, you would send an email invitation here
    return NextResponse.json({
      message: 'Share this family ID with the other parent',
      family_id: userMembership.family_id,
      invite_email: body.email,
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
