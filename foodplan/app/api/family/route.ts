import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { CreateFamily } from '@/types'

/**
 * GET /api/family
 * Get the authenticated user's family information
 *
 * Family Sharing Model:
 * - Two parent auth accounts can manage all family profiles
 * - Parents are linked to families via family_members junction table
 * - This endpoint returns the family the current user belongs to
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

    // Get the user's family membership
    // A parent can only belong to one family at a time
    const { data: familyMember, error: memberError } = await supabase
      .from('family_members')
      .select('family_id, role, created_at, family:families(*)')
      .eq('user_id', user.id)
      .single()

    if (memberError) {
      // User doesn't belong to a family yet (first-time user)
      if (memberError.code === 'PGRST116') {
        return NextResponse.json({ family: null })
      }

      console.error('Error fetching family membership:', memberError)
      return NextResponse.json(
        { error: 'Failed to fetch family' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      family: familyMember.family,
      role: familyMember.role
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/family
 * Create a new family and add the current user as a parent member
 *
 * This is used during first-time setup when a user signs up
 * Body: { name: string } - e.g., "The Smith Family"
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

    // Validate family name
    if (!body.name || typeof body.name !== 'string' || !body.name.trim()) {
      return NextResponse.json(
        { error: 'Family name is required' },
        { status: 400 }
      )
    }

    // Check if user already belongs to a family
    const { data: existingMembership } = await supabase
      .from('family_members')
      .select('family_id')
      .eq('user_id', user.id)
      .single()

    if (existingMembership) {
      return NextResponse.json(
        { error: 'You already belong to a family' },
        { status: 400 }
      )
    }

    // Create the family
    const familyData: CreateFamily = {
      name: body.name.trim(),
    }

    const { data: family, error: familyError } = await supabase
      .from('families')
      .insert(familyData)
      .select()
      .single()

    if (familyError) {
      console.error('Error creating family:', familyError)
      return NextResponse.json(
        { error: 'Failed to create family' },
        { status: 500 }
      )
    }

    // Add the user as a family member (parent role)
    const { error: memberError } = await supabase
      .from('family_members')
      .insert({
        family_id: family.id,
        user_id: user.id,
        role: 'parent',
      })

    if (memberError) {
      console.error('Error adding family member:', memberError)
      // Try to clean up the family we just created
      await supabase.from('families').delete().eq('id', family.id)

      return NextResponse.json(
        { error: 'Failed to add you to the family' },
        { status: 500 }
      )
    }

    return NextResponse.json({ family }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
