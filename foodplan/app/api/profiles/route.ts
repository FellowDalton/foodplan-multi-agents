import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { CreateUserProfile } from '@/types'

/**
 * GET /api/profiles
 * Fetch all user profiles that belong to the authenticated user's family
 *
 * Family Sharing Model:
 * - Profiles are linked to families via family_id
 * - Both parent accounts can view all profiles in their family
 * - RLS policies enforce access control at the database level
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

    // Get user's family_id from family_members table
    const { data: familyMember, error: memberError } = await supabase
      .from('family_members')
      .select('family_id')
      .eq('user_id', user.id)
      .single()

    if (memberError) {
      // User doesn't have a family yet - return empty array
      if (memberError.code === 'PGRST116') {
        return NextResponse.json({ profiles: [] })
      }

      console.error('Error fetching family membership:', memberError)
      return NextResponse.json(
        { error: 'Failed to fetch family membership' },
        { status: 500 }
      )
    }

    // Fetch all profiles for this family
    // RLS policies will enforce that user can only see profiles from their family
    const { data: profiles, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('family_id', familyMember.family_id)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching profiles:', error)
      return NextResponse.json(
        { error: 'Failed to fetch profiles' },
        { status: 500 }
      )
    }

    return NextResponse.json({ profiles })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/profiles
 * Create a new user profile for the authenticated user's family
 *
 * Body: CreateUserProfile (without family_id - we get it from the user's family membership)
 * - family_id is automatically added from the user's family
 * - Validates that role is not already taken within the family
 * - Maximum 4 profiles per family (husband, wife, child1, child2)
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

    // Get user's family_id
    const { data: familyMember, error: memberError } = await supabase
      .from('family_members')
      .select('family_id')
      .eq('user_id', user.id)
      .single()

    if (memberError) {
      console.error('Error fetching family membership:', memberError)
      return NextResponse.json(
        { error: 'You must create a family before adding profiles' },
        { status: 400 }
      )
    }

    const body = await request.json()

    // Validate required fields
    if (!body.email || !body.role) {
      return NextResponse.json(
        { error: 'Missing required fields: email and role are required' },
        { status: 400 }
      )
    }

    // Validate role
    const validRoles = ['husband', 'wife', 'child1', 'child2']
    if (!validRoles.includes(body.role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }

    // Check if role is already taken within this family
    const { data: existingRole } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('family_id', familyMember.family_id)
      .eq('role', body.role)
      .single()

    if (existingRole) {
      return NextResponse.json(
        { error: `Role '${body.role}' is already assigned to another family member` },
        { status: 400 }
      )
    }

    // Check if family already has 4 profiles
    const { data: existingProfiles, error: countError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('family_id', familyMember.family_id)

    if (countError) {
      console.error('Error counting profiles:', countError)
      return NextResponse.json(
        { error: 'Failed to check existing profiles' },
        { status: 500 }
      )
    }

    if (existingProfiles && existingProfiles.length >= 4) {
      return NextResponse.json(
        { error: 'Maximum of 4 family member profiles allowed' },
        { status: 400 }
      )
    }

    // Prepare profile data with defaults
    const profileData: CreateUserProfile = {
      family_id: familyMember.family_id, // Add the user's family_id
      email: body.email,
      full_name: body.full_name || '',
      role: body.role,
      is_gluten_free: body.is_gluten_free ?? true, // Default true (3/4 family members)
      has_nut_allergy: body.has_nut_allergy ?? false,
      can_eat_almonds: body.can_eat_almonds ?? true,
      avoid_saturated_fat: body.avoid_saturated_fat ?? false,
      avoid_potatoes: body.avoid_potatoes ?? false,
      can_eat_sweet_potatoes: body.can_eat_sweet_potatoes ?? true,
    }

    // Insert profile
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .insert(profileData)
      .select()
      .single()

    if (error) {
      console.error('Error creating profile:', error)
      return NextResponse.json(
        { error: 'Failed to create profile' },
        { status: 500 }
      )
    }

    return NextResponse.json({ profile }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
