import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/**
 * POST /api/family/join
 * Join an existing family using a family ID
 *
 * This is used when a second parent wants to join an existing family
 * Body: { family_id: string }
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

    // Validate family_id
    if (!body.family_id || typeof body.family_id !== 'string') {
      return NextResponse.json(
        { error: 'Family ID is required' },
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

    // Verify the family exists
    const { data: family, error: familyError } = await supabase
      .from('families')
      .select('id, name')
      .eq('id', body.family_id)
      .single()

    if (familyError || !family) {
      return NextResponse.json(
        { error: 'Family not found. Please check the Family ID and try again.' },
        { status: 404 }
      )
    }

    // Check how many parents already exist in this family
    const { data: existingMembers, error: countError } = await supabase
      .from('family_members')
      .select('user_id')
      .eq('family_id', body.family_id)

    if (countError) {
      console.error('Error counting family members:', countError)
      return NextResponse.json(
        { error: 'Failed to check family members' },
        { status: 500 }
      )
    }

    if (existingMembers && existingMembers.length >= 2) {
      return NextResponse.json(
        { error: 'This family already has 2 parent accounts' },
        { status: 400 }
      )
    }

    // Add the user to the family
    const { error: memberError } = await supabase
      .from('family_members')
      .insert({
        family_id: body.family_id,
        user_id: user.id,
        role: 'parent',
      })

    if (memberError) {
      console.error('Error adding family member:', memberError)
      return NextResponse.json(
        { error: 'Failed to join family' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      family: family,
      message: `Successfully joined ${family.name}!`,
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
