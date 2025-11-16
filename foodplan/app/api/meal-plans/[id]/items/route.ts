import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { CreateMealPlanItem } from '@/types';

export const dynamic = 'force-dynamic';

/**
 * GET /api/meal-plans/[id]/items
 * Fetch all items in a meal plan
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's family_id
    const { data: familyMember, error: memberError } = await supabase
      .from('family_members')
      .select('family_id')
      .eq('user_id', user.id)
      .single();

    if (memberError) {
      return NextResponse.json(
        { error: 'User is not part of a family' },
        { status: 400 }
      );
    }

    // Verify meal plan belongs to user's family
    const { data: mealPlan } = await supabase
      .from('meal_plans')
      .select('id')
      .eq('id', params.id)
      .eq('family_id', familyMember.family_id)
      .single();

    if (!mealPlan) {
      return NextResponse.json(
        { error: 'Meal plan not found or access denied' },
        { status: 404 }
      );
    }

    // Fetch all meal plan items with recipes
    const { data: items, error } = await supabase
      .from('meal_plan_items')
      .select(`
        *,
        recipe:recipes(*)
      `)
      .eq('meal_plan_id', params.id)
      .order('day_of_week', { ascending: true })
      .order('meal_type', { ascending: true });

    if (error) {
      console.error('Error fetching meal plan items:', error);
      return NextResponse.json(
        { error: 'Failed to fetch meal plan items' },
        { status: 500 }
      );
    }

    return NextResponse.json({ items });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/meal-plans/[id]/items
 * Add a meal to the plan
 *
 * Request body:
 * {
 *   recipe_id: string,
 *   day_of_week: number (0-6, where 0=Monday),
 *   meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack',
 *   custom_notes?: string
 * }
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's family_id
    const { data: familyMember, error: memberError } = await supabase
      .from('family_members')
      .select('family_id')
      .eq('user_id', user.id)
      .single();

    if (memberError) {
      return NextResponse.json(
        { error: 'User is not part of a family' },
        { status: 400 }
      );
    }

    // Verify meal plan belongs to user's family
    const { data: mealPlan } = await supabase
      .from('meal_plans')
      .select('id')
      .eq('id', params.id)
      .eq('family_id', familyMember.family_id)
      .single();

    if (!mealPlan) {
      return NextResponse.json(
        { error: 'Meal plan not found or access denied' },
        { status: 404 }
      );
    }

    const body = await request.json();

    // Validate required fields
    if (typeof body.day_of_week !== 'number' || !body.meal_type) {
      return NextResponse.json(
        { error: 'Missing required fields: day_of_week, meal_type' },
        { status: 400 }
      );
    }

    // Validate day_of_week range
    if (body.day_of_week < 0 || body.day_of_week > 6) {
      return NextResponse.json(
        { error: 'day_of_week must be between 0 and 6' },
        { status: 400 }
      );
    }

    // Validate meal_type
    const validMealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
    if (!validMealTypes.includes(body.meal_type)) {
      return NextResponse.json(
        { error: 'Invalid meal_type. Must be breakfast, lunch, dinner, or snack' },
        { status: 400 }
      );
    }

    // Check if item already exists for this day/meal combination
    const { data: existingItem } = await supabase
      .from('meal_plan_items')
      .select('id')
      .eq('meal_plan_id', params.id)
      .eq('day_of_week', body.day_of_week)
      .eq('meal_type', body.meal_type)
      .single();

    if (existingItem) {
      return NextResponse.json(
        { error: 'A meal already exists for this day and meal type' },
        { status: 409 }
      );
    }

    // Prepare meal plan item data
    const itemData: CreateMealPlanItem = {
      meal_plan_id: params.id,
      recipe_id: body.recipe_id || null,
      day_of_week: body.day_of_week,
      meal_type: body.meal_type,
      custom_notes: body.custom_notes || null,
    };

    // Insert meal plan item
    const { data: item, error } = await supabase
      .from('meal_plan_items')
      .insert(itemData)
      .select(`
        *,
        recipe:recipes(*)
      `)
      .single();

    if (error) {
      console.error('Error creating meal plan item:', error);
      return NextResponse.json(
        { error: 'Failed to create meal plan item' },
        { status: 500 }
      );
    }

    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
