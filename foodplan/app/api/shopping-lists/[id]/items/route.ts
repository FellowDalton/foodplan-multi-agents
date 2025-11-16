import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { CreateShoppingListItem } from '@/types';

export const dynamic = 'force-dynamic';

/**
 * GET /api/shopping-lists/[id]/items
 * Fetch all items in a shopping list
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

    // Fetch items
    const { data: items, error } = await supabase
      .from('shopping_list_items')
      .select(`
        *,
        deal:deals(*),
        category:categories(*)
      `)
      .eq('shopping_list_id', params.id)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching shopping list items:', error);
      return NextResponse.json(
        { error: 'Failed to fetch items' },
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
 * POST /api/shopping-lists/[id]/items
 * Add an item to a shopping list
 *
 * Request body:
 * {
 *   name: string (required)
 *   quantity?: string
 *   unit?: string
 *   category_id?: string
 *   store_preference?: 'netto' | 'rema' | 'meny' | 'any'
 *   deal_id?: string
 *   notes?: string
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

    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { error: 'Missing required field: name' },
        { status: 400 }
      );
    }

    // Prepare item data
    const itemData: CreateShoppingListItem = {
      shopping_list_id: params.id,
      name: body.name,
      quantity: body.quantity || null,
      unit: body.unit || null,
      category_id: body.category_id || null,
      deal_id: body.deal_id || null,
      product_id: body.product_id || null,
      is_checked: false,
      estimated_price: body.estimated_price || null,
      store_preference: body.store_preference || 'any',
      notes: body.notes || null,
    };

    // Insert item
    const { data: item, error } = await supabase
      .from('shopping_list_items')
      .insert(itemData)
      .select(`
        *,
        deal:deals(*),
        category:categories(*)
      `)
      .single();

    if (error) {
      console.error('Error creating shopping list item:', error);
      return NextResponse.json(
        { error: 'Failed to create item' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { item },
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
