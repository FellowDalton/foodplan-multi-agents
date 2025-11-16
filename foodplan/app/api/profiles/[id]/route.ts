import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/**
 * GET /api/profiles/[id]
 * Get a specific profile by ID
 *
 * Family Sharing Model:
 * - RLS policies ensure user can only access profiles from their family
 * - Both parent accounts have access to all family profiles
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    // Fetch profile - RLS will automatically filter to user's family
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) {
      console.error('Error fetching profile:', error)
      return NextResponse.json(
        { error: 'Profile not found or you do not have access' },
        { status: 404 }
      )
    }

    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/profiles/[id]
 * Update a profile
 *
 * Family Sharing Model:
 * - RLS policies ensure user can only update profiles from their family
 * - Role changes are validated to prevent duplicates within the family
 * - Both parent accounts can update all family profiles
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
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
        { error: 'You do not belong to a family' },
        { status: 403 }
      )
    }

    const body = await request.json()

    // If role is being changed, check it's not already taken within this family
    if (body.role) {
      const validRoles = ['husband', 'wife', 'child1', 'child2']
      if (!validRoles.includes(body.role)) {
        return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
      }

      const { data: existingRole } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('family_id', familyMember.family_id)
        .eq('role', body.role)
        .neq('id', params.id)
        .single()

      if (existingRole) {
        return NextResponse.json(
          { error: `Role '${body.role}' is already assigned to another family member` },
          { status: 400 }
        )
      }
    }

    // Remove fields that shouldn't be updated
    const { id, family_id, created_at, updated_at, ...updateData } = body

    // Update profile - RLS will ensure user can only update profiles from their family
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating profile:', error)
      return NextResponse.json(
        { error: 'Failed to update profile or you do not have access' },
        { status: 500 }
      )
    }

    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/profiles/[id]
 * Delete a profile
 *
 * Family Sharing Model:
 * - RLS policies ensure user can only delete profiles from their family
 * - Both parent accounts can delete family profiles
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    // Delete profile - RLS will ensure user can only delete profiles from their family
    const { error } = await supabase
      .from('user_profiles')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Error deleting profile:', error)
      return NextResponse.json(
        { error: 'Failed to delete profile or you do not have access' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
