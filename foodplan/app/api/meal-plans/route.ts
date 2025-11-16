import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { CreateMealPlan, MealPlan } from '@/types';

export const dynamic = 'force-dynamic';

/**
 * Calculate ISO week number and year from a date
 */
function getISOWeekInfo(date: Date): { week: number; year: number } {
  const target = new Date(date.valueOf());
  const dayNumber = (date.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNumber + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
  }
  const week = 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
  return { week, year: target.getFullYear() };
}

/**
 * GET /api/meal-plans
 * Fetch meal plans for the authenticated user's family
 *
 * Query params:
 * - week: YYYY-MM-DD (optional) - Get meal plan for specific week with all items
 */
export async function GET(request: NextRequest) {
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
        { error: 'User is not part of a family. Please join or create a family first.' },
        { status: 400 }
      );
    }

    const familyId = familyMember.family_id;
    const { searchParams } = new URL(request.url);
    const weekParam = searchParams.get('week');

    if (weekParam) {
      // Fetch specific week's meal plan with all items and recipes
      const { data: mealPlan, error: planError } = await supabase
        .from('meal_plans')
        .select(`
          *,
          items:meal_plan_items(
            *,
            recipe:recipes(*)
          )
        `)
        .eq('family_id', familyId)
        .eq('week_start_date', weekParam)
        .single();

      if (planError) {
        if (planError.code === 'PGRST116') {
          // No meal plan found for this week
          return NextResponse.json({ mealPlan: null });
        }
        console.error('Error fetching meal plan:', planError);
        return NextResponse.json(
          { error: 'Failed to fetch meal plan' },
          { status: 500 }
        );
      }

      return NextResponse.json({ mealPlan });
    } else {
      // Fetch all meal plans for the family
      const { data: mealPlans, error: plansError } = await supabase
        .from('meal_plans')
        .select('*')
        .eq('family_id', familyId)
        .order('week_start_date', { ascending: false });

      if (plansError) {
        console.error('Error fetching meal plans:', plansError);
        return NextResponse.json(
          { error: 'Failed to fetch meal plans' },
          { status: 500 }
        );
      }

      return NextResponse.json({ mealPlans });
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/meal-plans
 * Create a new meal plan for a specific week
 *
 * Request body:
 * {
 *   week_start_date: "YYYY-MM-DD" (ISO format, should be a Monday)
 * }
 */
export async function POST(request: NextRequest) {
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
        { error: 'User is not part of a family. Please join or create a family first.' },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Validate required fields
    if (!body.week_start_date) {
      return NextResponse.json(
        { error: 'Missing required field: week_start_date' },
        { status: 400 }
      );
    }

    // Parse and validate date
    const weekStartDate = new Date(body.week_start_date);
    if (isNaN(weekStartDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format for week_start_date' },
        { status: 400 }
      );
    }

    // Calculate week number and year
    const { week, year } = getISOWeekInfo(weekStartDate);

    // Check if meal plan already exists for this week
    const { data: existingPlan } = await supabase
      .from('meal_plans')
      .select('id')
      .eq('family_id', familyMember.family_id)
      .eq('week_start_date', body.week_start_date)
      .single();

    if (existingPlan) {
      return NextResponse.json(
        { error: 'Meal plan already exists for this week' },
        { status: 409 }
      );
    }

    // Prepare meal plan data
    const mealPlanData: CreateMealPlan = {
      family_id: familyMember.family_id,
      week_start_date: body.week_start_date,
      week_number: week,
      year: year,
      is_active: true,
    };

    // Insert meal plan
    const { data: mealPlan, error } = await supabase
      .from('meal_plans')
      .insert(mealPlanData)
      .select()
      .single();

    if (error) {
      console.error('Error creating meal plan:', error);
      return NextResponse.json(
        { error: 'Failed to create meal plan' },
        { status: 500 }
      );
    }

    // Return meal plan with empty items array
    return NextResponse.json(
      {
        mealPlan: {
          ...mealPlan,
          items: []
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
