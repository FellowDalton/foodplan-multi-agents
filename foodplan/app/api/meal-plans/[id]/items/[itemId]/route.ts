import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { UpdateMealPlanItem } from '@/types';

export const dynamic = 'force-dynamic';

/**
 * PATCH /api/meal-plans/[id]/items/[itemId]
 * Update a meal plan item (change day, meal_type, recipe, or notes)
 *
 * Request body:
 * {
 *   recipe_id?: string | null,
 *   day_of_week?: number (0-6),
 *   meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'snack',
 *   custom_notes?: string | null
 * }
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; itemId: string } }
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

    // Verify item exists and belongs to this meal plan
    const { data: existingItem } = await supabase
      .from('meal_plan_items')
      .select('*')
      .eq('id', params.itemId)
      .eq('meal_plan_id', params.id)
      .single();

    if (!existingItem) {
      return NextResponse.json(
        { error: 'Meal plan item not found' },
        { status: 404 }
      );
    }

    const body = await request.json();

    // Prepare update data
    const updateData: Partial<UpdateMealPlanItem> = {};

    if (body.recipe_id !== undefined) {
      updateData.recipe_id = body.recipe_id;
    }
    if (typeof body.day_of_week === 'number') {
      if (body.day_of_week < 0 || body.day_of_week > 6) {
        return NextResponse.json(
          { error: 'day_of_week must be between 0 and 6' },
          { status: 400 }
        );
      }
      updateData.day_of_week = body.day_of_week;
    }
    if (body.meal_type) {
      const validMealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
      if (!validMealTypes.includes(body.meal_type)) {
        return NextResponse.json(
          { error: 'Invalid meal_type' },
          { status: 400 }
        );
      }
      updateData.meal_type = body.meal_type;
    }
    if (body.custom_notes !== undefined) {
      updateData.custom_notes = body.custom_notes;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    // Check for conflicts if day_of_week or meal_type is being changed
    if (updateData.day_of_week !== undefined || updateData.meal_type !== undefined) {
      const newDayOfWeek = updateData.day_of_week ?? existingItem.day_of_week;
      const newMealType = updateData.meal_type ?? existingItem.meal_type;

      // Only check for conflicts if the combination is actually changing
      if (newDayOfWeek !== existingItem.day_of_week || newMealType !== existingItem.meal_type) {
        const { data: conflictingItem } = await supabase
          .from('meal_plan_items')
          .select('id')
          .eq('meal_plan_id', params.id)
          .eq('day_of_week', newDayOfWeek)
          .eq('meal_type', newMealType)
          .neq('id', params.itemId)
          .single();

        if (conflictingItem) {
          return NextResponse.json(
            { error: 'A meal already exists for this day and meal type' },
            { status: 409 }
          );
        }
      }
    }

    // Update meal plan item
    const { data: item, error } = await supabase
      .from('meal_plan_items')
      .update(updateData)
      .eq('id', params.itemId)
      .select(`
        *,
        recipe:recipes(*)
      `)
      .single();

    if (error) {
      console.error('Error updating meal plan item:', error);
      return NextResponse.json(
        { error: 'Failed to update meal plan item' },
        { status: 500 }
      );
    }

    return NextResponse.json({ item });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/meal-plans/[id]/items/[itemId]
 * Remove a meal from the plan
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; itemId: string } }
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

    // Verify item exists and belongs to this meal plan
    const { data: existingItem } = await supabase
      .from('meal_plan_items')
      .select('id')
      .eq('id', params.itemId)
      .eq('meal_plan_id', params.id)
      .single();

    if (!existingItem) {
      return NextResponse.json(
        { error: 'Meal plan item not found' },
        { status: 404 }
      );
    }

    // Delete meal plan item
    const { error } = await supabase
      .from('meal_plan_items')
      .delete()
      .eq('id', params.itemId);

    if (error) {
      console.error('Error deleting meal plan item:', error);
      return NextResponse.json(
        { error: 'Failed to delete meal plan item' },
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
