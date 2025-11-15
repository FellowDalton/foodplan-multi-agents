import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { UpdateMealPlan } from '@/types';

export const dynamic = 'force-dynamic';

/**
 * GET /api/meal-plans/[id]
 * Fetch a specific meal plan with all items and recipes
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

    // Fetch meal plan with items and recipes
    const { data: mealPlan, error } = await supabase
      .from('meal_plans')
      .select(`
        *,
        items:meal_plan_items(
          *,
          recipe:recipes(*)
        )
      `)
      .eq('id', params.id)
      .eq('family_id', familyMember.family_id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Meal plan not found' },
          { status: 404 }
        );
      }
      console.error('Error fetching meal plan:', error);
      return NextResponse.json(
        { error: 'Failed to fetch meal plan' },
        { status: 500 }
      );
    }

    return NextResponse.json({ mealPlan });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/meal-plans/[id]
 * Update a meal plan (is_active status)
 *
 * Request body:
 * {
 *   is_active?: boolean
 * }
 */
export async function PATCH(
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

    const body = await request.json();

    // Verify ownership before update
    const { data: existingPlan } = await supabase
      .from('meal_plans')
      .select('id')
      .eq('id', params.id)
      .eq('family_id', familyMember.family_id)
      .single();

    if (!existingPlan) {
      return NextResponse.json(
        { error: 'Meal plan not found or access denied' },
        { status: 404 }
      );
    }

    // Prepare update data (only allow is_active to be updated)
    const updateData: Partial<UpdateMealPlan> = {};
    if (typeof body.is_active === 'boolean') {
      updateData.is_active = body.is_active;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    // Update meal plan
    const { data: mealPlan, error } = await supabase
      .from('meal_plans')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating meal plan:', error);
      return NextResponse.json(
        { error: 'Failed to update meal plan' },
        { status: 500 }
      );
    }

    return NextResponse.json({ mealPlan });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/meal-plans/[id]
 * Delete a meal plan and all its items (cascades)
 */
export async function DELETE(
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

    // Verify ownership before delete
    const { data: existingPlan } = await supabase
      .from('meal_plans')
      .select('id')
      .eq('id', params.id)
      .eq('family_id', familyMember.family_id)
      .single();

    if (!existingPlan) {
      return NextResponse.json(
        { error: 'Meal plan not found or access denied' },
        { status: 404 }
      );
    }

    // Delete meal plan (items will cascade delete due to ON DELETE CASCADE)
    const { error } = await supabase
      .from('meal_plans')
      .delete()
      .eq('id', params.id);

    if (error) {
      console.error('Error deleting meal plan:', error);
      return NextResponse.json(
        { error: 'Failed to delete meal plan' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
