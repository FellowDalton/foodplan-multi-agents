import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { CreateRecipe, Recipe } from '@/types';

export const dynamic = 'force-dynamic';

/**
 * GET /api/recipes
 * Fetch all recipes for the authenticated user's family
 */
export async function GET() {
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
      // User doesn't have a family yet - could return recipes by user_id
      // For now, return empty array
      return NextResponse.json({ recipes: [] });
    }

    // Fetch all recipes (could be filtered by family in the future)
    const { data: recipes, error } = await supabase
      .from('recipes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching recipes:', error);
      return NextResponse.json(
        { error: 'Failed to fetch recipes' },
        { status: 500 }
      );
    }

    return NextResponse.json({ recipes });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/recipes
 * Create a new recipe
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

    const body = await request.json();

    // Validate required fields
    if (!body.title) {
      return NextResponse.json(
        { error: 'Missing required field: title' },
        { status: 400 }
      );
    }

    // Prepare recipe data with defaults
    const recipeData: CreateRecipe = {
      user_id: user.id,
      title: body.title,
      description: body.description || null,
      ingredients: body.ingredients || [],
      instructions: body.instructions || null,
      prep_time_minutes: body.prep_time_minutes || null,
      cook_time_minutes: body.cook_time_minutes || null,
      servings: body.servings || 4,
      is_gluten_free: body.is_gluten_free ?? false,
      contains_nuts: body.contains_nuts ?? false,
      nut_types: body.nut_types || null,
      saturated_fat_level: body.saturated_fat_level || null,
      contains_potatoes: body.contains_potatoes ?? false,
      contains_sweet_potatoes: body.contains_sweet_potatoes ?? false,
      image_url: body.image_url || null,
      source: body.source || 'user_created',
      tags: body.tags || [],
    };

    // Insert recipe
    const { data: recipe, error } = await supabase
      .from('recipes')
      .insert(recipeData)
      .select()
      .single();

    if (error) {
      console.error('Error creating recipe:', error);
      return NextResponse.json(
        { error: 'Failed to create recipe' },
        { status: 500 }
      );
    }

    return NextResponse.json({ recipe }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
