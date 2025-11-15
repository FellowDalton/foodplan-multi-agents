import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { CreateShoppingList, CreateShoppingListItem, RecipeIngredient } from '@/types';

export const dynamic = 'force-dynamic';

/**
 * Normalize unit names for aggregation
 */
function normalizeUnit(unit: string): string {
  const unitLower = unit.toLowerCase().trim();

  // Normalize common variations
  const unitMap: Record<string, string> = {
    'g': 'g',
    'gram': 'g',
    'grams': 'g',
    'kg': 'kg',
    'kilo': 'kg',
    'kilogram': 'kg',
    'kilograms': 'kg',
    'ml': 'ml',
    'milliliter': 'ml',
    'milliliters': 'ml',
    'l': 'l',
    'liter': 'l',
    'liters': 'l',
    'stk': 'stk',
    'piece': 'stk',
    'pieces': 'stk',
    'pcs': 'stk',
    'tbsp': 'tbsp',
    'tablespoon': 'tbsp',
    'tablespoons': 'tbsp',
    'tsp': 'tsp',
    'teaspoon': 'tsp',
    'teaspoons': 'tsp',
    'cup': 'cup',
    'cups': 'cup',
  };

  return unitMap[unitLower] || unitLower;
}

/**
 * Parse quantity string to number (e.g., "2.5", "1/2", "1 1/2")
 */
function parseQuantity(quantityStr: string): number {
  if (!quantityStr) return 0;

  const str = quantityStr.trim();

  // Handle fractions like "1/2"
  if (str.includes('/')) {
    const parts = str.split('/');
    if (parts.length === 2) {
      const numerator = parseFloat(parts[0]);
      const denominator = parseFloat(parts[1]);
      if (!isNaN(numerator) && !isNaN(denominator) && denominator !== 0) {
        return numerator / denominator;
      }
    }
  }

  // Handle mixed fractions like "1 1/2"
  if (str.includes(' ') && str.includes('/')) {
    const parts = str.split(' ');
    const whole = parseFloat(parts[0]);
    const fraction = parseQuantity(parts.slice(1).join(' '));
    if (!isNaN(whole)) {
      return whole + fraction;
    }
  }

  // Handle simple numbers
  const num = parseFloat(str);
  return isNaN(num) ? 0 : num;
}

/**
 * Convert units if possible (e.g., 1000g -> 1kg)
 */
function convertAndFormat(quantity: number, unit: string): { quantity: string; unit: string } {
  const normalizedUnit = normalizeUnit(unit);

  // Convert g to kg if >= 1000
  if (normalizedUnit === 'g' && quantity >= 1000) {
    return {
      quantity: (quantity / 1000).toString(),
      unit: 'kg'
    };
  }

  // Convert ml to l if >= 1000
  if (normalizedUnit === 'ml' && quantity >= 1000) {
    return {
      quantity: (quantity / 1000).toString(),
      unit: 'l'
    };
  }

  return {
    quantity: quantity.toString(),
    unit: normalizedUnit
  };
}

/**
 * Aggregate ingredients by name and unit
 */
function aggregateIngredients(ingredients: RecipeIngredient[]): RecipeIngredient[] {
  const aggregated = new Map<string, { totalQuantity: number; unit: string }>();

  for (const ingredient of ingredients) {
    const nameLower = ingredient.name.toLowerCase().trim();
    const unit = normalizeUnit(ingredient.unit);
    const key = `${nameLower}|${unit}`;

    const quantity = parseQuantity(ingredient.quantity);

    if (aggregated.has(key)) {
      const existing = aggregated.get(key)!;
      existing.totalQuantity += quantity;
    } else {
      aggregated.set(key, {
        totalQuantity: quantity,
        unit: unit
      });
    }
  }

  // Convert back to RecipeIngredient array
  const result: RecipeIngredient[] = [];

  for (const [key, value] of Array.from(aggregated.entries())) {
    const [name, _] = key.split('|');
    const formatted = convertAndFormat(value.totalQuantity, value.unit);

    result.push({
      name: name.charAt(0).toUpperCase() + name.slice(1), // Capitalize first letter
      quantity: formatted.quantity,
      unit: formatted.unit
    });
  }

  return result;
}

/**
 * Find matching deals for an ingredient
 */
async function findDealForIngredient(
  supabase: any,
  ingredientName: string
): Promise<string | null> {
  const nameLower = ingredientName.toLowerCase();

  // Search in current deals (from JSON files via deals table if populated)
  // For now, we'll return null since deals are stored in JSON files
  // In a production system, you'd search the deals database table

  // TODO: Implement deal matching when deals are in database
  // For now, just return null
  return null;
}

/**
 * POST /api/shopping-lists/generate
 * Generate a shopping list from a meal plan
 *
 * Request body:
 * {
 *   meal_plan_id: string (required)
 *   title?: string (optional, defaults to "Shopping List for Week X")
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
    if (!body.meal_plan_id) {
      return NextResponse.json(
        { error: 'Missing required field: meal_plan_id' },
        { status: 400 }
      );
    }

    // Fetch meal plan with all items and recipes
    const { data: mealPlan, error: planError } = await supabase
      .from('meal_plans')
      .select(`
        *,
        items:meal_plan_items(
          *,
          recipe:recipes(*)
        )
      `)
      .eq('id', body.meal_plan_id)
      .eq('family_id', familyMember.family_id)
      .single();

    if (planError) {
      if (planError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Meal plan not found' },
          { status: 404 }
        );
      }
      console.error('Error fetching meal plan:', planError);
      return NextResponse.json(
        { error: 'Failed to fetch meal plan' },
        { status: 500 }
      );
    }

    // Collect all ingredients from recipes
    const allIngredients: RecipeIngredient[] = [];

    for (const item of mealPlan.items || []) {
      if (item.recipe && item.recipe.ingredients) {
        allIngredients.push(...item.recipe.ingredients);
      }
    }

    if (allIngredients.length === 0) {
      return NextResponse.json(
        { error: 'No ingredients found in meal plan recipes' },
        { status: 400 }
      );
    }

    // Aggregate ingredients
    const aggregatedIngredients = aggregateIngredients(allIngredients);

    // Create shopping list
    const title = body.title || `Shopping List - Week ${mealPlan.week_number}, ${mealPlan.year}`;

    const shoppingListData: CreateShoppingList = {
      family_id: familyMember.family_id,
      meal_plan_id: body.meal_plan_id,
      title: title,
      is_completed: false,
    };

    const { data: shoppingList, error: listError } = await supabase
      .from('shopping_lists')
      .insert(shoppingListData)
      .select()
      .single();

    if (listError) {
      console.error('Error creating shopping list:', listError);
      return NextResponse.json(
        { error: 'Failed to create shopping list' },
        { status: 500 }
      );
    }

    // Create items for each aggregated ingredient
    const itemsToInsert: CreateShoppingListItem[] = [];

    for (const ingredient of aggregatedIngredients) {
      // Try to find a matching deal
      const dealId = await findDealForIngredient(supabase, ingredient.name);

      itemsToInsert.push({
        shopping_list_id: shoppingList.id,
        name: ingredient.name,
        quantity: ingredient.quantity,
        unit: ingredient.unit,
        is_checked: false,
        store_preference: 'any',
        deal_id: dealId || undefined,
        product_id: undefined,
        category_id: undefined,
        estimated_price: undefined,
        notes: undefined,
      });
    }

    // Bulk insert items
    const { data: items, error: itemsError } = await supabase
      .from('shopping_list_items')
      .insert(itemsToInsert)
      .select(`
        *,
        deal:deals(*),
        category:categories(*)
      `);

    if (itemsError) {
      console.error('Error creating shopping list items:', itemsError);
      // Delete the shopping list since items failed
      await supabase.from('shopping_lists').delete().eq('id', shoppingList.id);
      return NextResponse.json(
        { error: 'Failed to create shopping list items' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        shoppingList: {
          ...shoppingList,
          items: items
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
