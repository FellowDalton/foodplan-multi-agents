import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { CreateShoppingList, ShoppingList } from '@/types';

export const dynamic = 'force-dynamic';

/**
 * GET /api/shopping-lists
 * Fetch all shopping lists for the authenticated user's family
 *
 * Query params:
 * - is_completed: 'true' | 'false' (optional) - Filter by completion status
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
    const isCompletedParam = searchParams.get('is_completed');

    // Build query
    let query = supabase
      .from('shopping_lists')
      .select(`
        *,
        meal_plan:meal_plans(id, week_start_date),
        items:shopping_list_items(count)
      `)
      .eq('family_id', familyId)
      .order('created_at', { ascending: false });

    // Apply completion filter if provided
    if (isCompletedParam !== null) {
      query = query.eq('is_completed', isCompletedParam === 'true');
    }

    const { data: shoppingLists, error } = await query;

    if (error) {
      console.error('Error fetching shopping lists:', error);
      return NextResponse.json(
        { error: 'Failed to fetch shopping lists' },
        { status: 500 }
      );
    }

    return NextResponse.json({ shoppingLists });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/shopping-lists
 * Create a new shopping list
 *
 * Request body:
 * {
 *   title: string (required)
 *   meal_plan_id?: string (optional)
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
    if (!body.title) {
      return NextResponse.json(
        { error: 'Missing required field: title' },
        { status: 400 }
      );
    }

    // Prepare shopping list data
    const shoppingListData: CreateShoppingList = {
      family_id: familyMember.family_id,
      title: body.title,
      meal_plan_id: body.meal_plan_id || null,
      is_completed: false,
    };

    // Insert shopping list
    const { data: shoppingList, error } = await supabase
      .from('shopping_lists')
      .insert(shoppingListData)
      .select()
      .single();

    if (error) {
      console.error('Error creating shopping list:', error);
      return NextResponse.json(
        { error: 'Failed to create shopping list' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { shoppingList },
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
