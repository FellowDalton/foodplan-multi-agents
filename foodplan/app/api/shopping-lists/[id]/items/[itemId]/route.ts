import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

/**
 * PATCH /api/shopping-lists/[id]/items/[itemId]
 * Update a shopping list item
 *
 * Request body:
 * {
 *   name?: string
 *   quantity?: string
 *   unit?: string
 *   is_checked?: boolean
 *   category_id?: string
 *   store_preference?: 'netto' | 'rema' | 'meny' | 'any'
 *   notes?: string
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
        { error: 'User is not part of a family. Please join or create a family first.' },
        { status: 400 }
      );
    }

    // Verify list belongs to family
    const { data: list } = await supabase
      .from('shopping_lists')
      .select('id')
      .eq('id', params.id)
      .eq('family_id', familyMember.family_id)
      .single();

    if (!list) {
      return NextResponse.json(
        { error: 'Shopping list not found' },
        { status: 404 }
      );
    }

    const body = await request.json();

    // Build update object
    const updates: any = {};
    if (body.name !== undefined) updates.name = body.name;
    if (body.quantity !== undefined) updates.quantity = body.quantity;
    if (body.unit !== undefined) updates.unit = body.unit;
    if (body.is_checked !== undefined) updates.is_checked = body.is_checked;
    if (body.category_id !== undefined) updates.category_id = body.category_id;
    if (body.store_preference !== undefined) updates.store_preference = body.store_preference;
    if (body.notes !== undefined) updates.notes = body.notes;
    if (body.estimated_price !== undefined) updates.estimated_price = body.estimated_price;
    if (body.deal_id !== undefined) updates.deal_id = body.deal_id;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    // Update item
    const { data: item, error } = await supabase
      .from('shopping_list_items')
      .update(updates)
      .eq('id', params.itemId)
      .eq('shopping_list_id', params.id)
      .select(`
        *,
        deal:deals(*),
        category:categories(*)
      `)
      .single();

    if (error) {
      console.error('Error updating shopping list item:', error);
      return NextResponse.json(
        { error: 'Failed to update item' },
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
 * DELETE /api/shopping-lists/[id]/items/[itemId]
 * Remove an item from a shopping list
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
        { error: 'User is not part of a family. Please join or create a family first.' },
        { status: 400 }
      );
    }

    // Verify list belongs to family
    const { data: list } = await supabase
      .from('shopping_lists')
      .select('id')
      .eq('id', params.id)
      .eq('family_id', familyMember.family_id)
      .single();

    if (!list) {
      return NextResponse.json(
        { error: 'Shopping list not found' },
        { status: 404 }
      );
    }

    // Delete item
    const { error } = await supabase
      .from('shopping_list_items')
      .delete()
      .eq('id', params.itemId)
      .eq('shopping_list_id', params.id);

    if (error) {
      console.error('Error deleting shopping list item:', error);
      return NextResponse.json(
        { error: 'Failed to delete item' },
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
