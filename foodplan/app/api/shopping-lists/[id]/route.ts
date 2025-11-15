import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

/**
 * GET /api/shopping-lists/[id]
 * Fetch a specific shopping list with all its items
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
        { error: 'User is not part of a family. Please join or create a family first.' },
        { status: 400 }
      );
    }

    // Fetch shopping list with items
    const { data: shoppingList, error } = await supabase
      .from('shopping_lists')
      .select(`
        *,
        meal_plan:meal_plans(id, week_start_date),
        items:shopping_list_items(
          *,
          deal:deals(*),
          category:categories(*)
        )
      `)
      .eq('id', params.id)
      .eq('family_id', familyMember.family_id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Shopping list not found' },
          { status: 404 }
        );
      }
      console.error('Error fetching shopping list:', error);
      return NextResponse.json(
        { error: 'Failed to fetch shopping list' },
        { status: 500 }
      );
    }

    return NextResponse.json({ shoppingList });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/shopping-lists/[id]
 * Update a shopping list
 *
 * Request body:
 * {
 *   title?: string
 *   is_completed?: boolean
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
        { error: 'User is not part of a family. Please join or create a family first.' },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Build update object
    const updates: any = {};
    if (body.title !== undefined) updates.title = body.title;
    if (body.is_completed !== undefined) updates.is_completed = body.is_completed;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    // Update shopping list
    const { data: shoppingList, error } = await supabase
      .from('shopping_lists')
      .update(updates)
      .eq('id', params.id)
      .eq('family_id', familyMember.family_id)
      .select()
      .single();

    if (error) {
      console.error('Error updating shopping list:', error);
      return NextResponse.json(
        { error: 'Failed to update shopping list' },
        { status: 500 }
      );
    }

    return NextResponse.json({ shoppingList });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/shopping-lists/[id]
 * Delete a shopping list (and all its items via cascade)
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
        { error: 'User is not part of a family. Please join or create a family first.' },
        { status: 400 }
      );
    }

    // Delete shopping list (items will be cascade deleted)
    const { error } = await supabase
      .from('shopping_lists')
      .delete()
      .eq('id', params.id)
      .eq('family_id', familyMember.family_id);

    if (error) {
      console.error('Error deleting shopping list:', error);
      return NextResponse.json(
        { error: 'Failed to delete shopping list' },
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
