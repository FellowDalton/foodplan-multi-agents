import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { CreateUserProfile } from '@/types'

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

    // Fetch all profiles for the authenticated user
    // Note: In a real app, you might filter by household or user_id if profiles are shared
    const { data: profiles, error } = await supabase
      .from('user_profiles')
      .select('*')
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

    // Check if role is already taken
    const { data: existingRole } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('role', body.role)
      .single()

    if (existingRole) {
      return NextResponse.json(
        { error: `Role '${body.role}' is already assigned to another family member` },
        { status: 400 }
      )
    }

    // Prepare profile data with defaults
    const profileData: CreateUserProfile = {
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
