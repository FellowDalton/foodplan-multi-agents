import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getClaudeClient, isClaudeConfigured, CLAUDE_MODEL } from '@/lib/claude';
import type {
  RecipeSuggestionRequest,
  RecipeSuggestionsResponse,
  RecipeSuggestion,
  UserProfile,
  DealWithStore,
  DealsAPIResponse
} from '@/types';

export const dynamic = 'force-dynamic';

/**
 * POST /api/recipes/suggest
 *
 * Generate AI-powered recipe suggestions based on family dietary restrictions
 * and optionally current deals from Danish supermarkets.
 *
 * Body: RecipeSuggestionRequest
 */
export async function POST(request: NextRequest) {
  try {
    // Check if Claude API is configured
    if (!isClaudeConfigured()) {
      return NextResponse.json<RecipeSuggestionsResponse>(
        {
          success: false,
          error: 'Claude API is not configured. Please add ANTHROPIC_API_KEY to your environment variables.',
        },
        { status: 500 }
      );
    }

    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json<RecipeSuggestionsResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body: RecipeSuggestionRequest = await request.json();

    // Validate required fields
    if (!body.family_id) {
      return NextResponse.json<RecipeSuggestionsResponse>(
        { success: false, error: 'family_id is required' },
        { status: 400 }
      );
    }

    // Verify user has access to this family
    const { data: familyMember, error: memberError } = await supabase
      .from('family_members')
      .select('family_id')
      .eq('user_id', user.id)
      .eq('family_id', body.family_id)
      .single();

    if (memberError || !familyMember) {
      return NextResponse.json<RecipeSuggestionsResponse>(
        { success: false, error: 'You do not have access to this family' },
        { status: 403 }
      );
    }

    // Fetch family profiles to get dietary restrictions
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('family_id', body.family_id);

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
      return NextResponse.json<RecipeSuggestionsResponse>(
        { success: false, error: 'Failed to fetch family profiles' },
        { status: 500 }
      );
    }

    if (!profiles || profiles.length === 0) {
      return NextResponse.json<RecipeSuggestionsResponse>(
        {
          success: false,
          error: 'No family profiles found. Please set up family profiles first.'
        },
        { status: 400 }
      );
    }

    // Analyze dietary restrictions
    const restrictions = analyzeDietaryRestrictions(profiles as UserProfile[]);

    // Optionally fetch current deals
    let deals: DealWithStore[] | null = null;
    if (body.use_deals) {
      deals = await fetchCurrentDeals();
    }

    // Build Claude prompt
    const prompt = buildRecipePrompt(
      body,
      restrictions,
      deals
    );

    // Call Claude API
    const claude = getClaudeClient();
    const response = await claude.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // Parse Claude's response
    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response format from Claude');
    }

    // Extract JSON from response (Claude might wrap it in markdown code blocks)
    let recipes: RecipeSuggestion[];
    try {
      const jsonMatch = content.text.match(/```json\n([\s\S]*?)\n```/) ||
                        content.text.match(/```\n([\s\S]*?)\n```/);
      const jsonText = jsonMatch ? jsonMatch[1] : content.text;
      recipes = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('Error parsing Claude response:', parseError);
      console.error('Raw response:', content.text);
      return NextResponse.json<RecipeSuggestionsResponse>(
        {
          success: false,
          error: 'Failed to parse recipe suggestions. Please try again.'
        },
        { status: 500 }
      );
    }

    // Return successful response
    return NextResponse.json<RecipeSuggestionsResponse>({
      success: true,
      data: {
        recipes,
        family_restrictions: restrictions,
        deals_used: !!deals,
      },
    });

  } catch (error) {
    console.error('Error in POST /api/recipes/suggest:', error);
    return NextResponse.json<RecipeSuggestionsResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}

/**
 * Analyze dietary restrictions from family profiles
 */
function analyzeDietaryRestrictions(profiles: UserProfile[]) {
  const glutenFreeCount = profiles.filter(p => p.is_gluten_free).length;
  const nutAllergies = profiles.filter(p => p.has_nut_allergy).length;
  const avoidSaturatedFat = profiles.some(p => p.avoid_saturated_fat);
  const avoidPotatoes = profiles.some(p => p.avoid_potatoes);
  const canEatAlmonds = profiles.every(p => !p.has_nut_allergy || p.can_eat_almonds);
  const canEatSweetPotatoes = profiles.every(p => p.can_eat_sweet_potatoes);

  return {
    gluten_free_count: glutenFreeCount,
    nut_allergies: nutAllergies,
    avoid_saturated_fat: avoidSaturatedFat,
    avoid_potatoes: avoidPotatoes,
    can_eat_almonds: canEatAlmonds,
    can_eat_sweet_potatoes: canEatSweetPotatoes,
    total_members: profiles.length,
  };
}

/**
 * Fetch current deals from the deals API
 */
async function fetchCurrentDeals(): Promise<DealWithStore[] | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/deals`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      console.warn('Failed to fetch deals:', response.statusText);
      return null;
    }

    const data: DealsAPIResponse = await response.json();

    if (!data.success || !data.data) {
      return null;
    }

    // Return top 50 deals for prompt efficiency
    return data.data.deals.slice(0, 50);
  } catch (error) {
    console.error('Error fetching deals:', error);
    return null;
  }
}

/**
 * Build the comprehensive prompt for Claude
 */
function buildRecipePrompt(
  request: RecipeSuggestionRequest,
  restrictions: ReturnType<typeof analyzeDietaryRestrictions>,
  deals: DealWithStore[] | null
): string {
  const numRecipes = request.num_recipes || 3;
  const mealType = request.meal_type || 'dinner';
  const cuisine = request.cuisine || 'any';
  const maxTime = request.max_cooking_time || 60;

  let prompt = `You are a family meal planning assistant for a Danish family of ${restrictions.total_members} people.

CRITICAL DIETARY RESTRICTIONS (MUST BE FOLLOWED):
- ${restrictions.gluten_free_count} out of ${restrictions.total_members} members require gluten-free meals
- ${restrictions.nut_allergies} member(s) have nut allergies`;

  if (restrictions.can_eat_almonds) {
    prompt += ` (but raw almonds are OK)`;
  }

  if (restrictions.avoid_saturated_fat) {
    prompt += `\n- 1 member should avoid saturated fat`;
  }

  if (restrictions.avoid_potatoes) {
    prompt += `\n- 1 member cannot eat potatoes`;
    if (restrictions.can_eat_sweet_potatoes) {
      prompt += ` (but sweet potatoes are fine)`;
    }
  }

  // Add deals information if available
  if (deals && deals.length > 0) {
    prompt += `\n\nCURRENT DEALS AT DANISH SUPERMARKETS:\n`;
    const dealsByCategory: Record<string, DealWithStore[]> = {};

    deals.forEach(deal => {
      if (!dealsByCategory[deal.category]) {
        dealsByCategory[deal.category] = [];
      }
      dealsByCategory[deal.category].push(deal);
    });

    Object.entries(dealsByCategory).forEach(([category, categoryDeals]) => {
      prompt += `\n${category}:\n`;
      categoryDeals.slice(0, 10).forEach(deal => {
        prompt += `  - ${deal.normalized_name}: ${deal.price} kr`;
        if (deal.quantity && deal.unit_type) {
          prompt += ` (${deal.quantity} ${deal.unit_type})`;
        }
        prompt += ` at ${deal.store_name}\n`;
      });
    });
  }

  prompt += `\n\nTASK:
Please suggest ${numRecipes} ${mealType} recipe(s) that:
1. Are COMPLETELY SAFE for all family members (respect ALL dietary restrictions)
2. Are suitable for ${restrictions.total_members} people`;

  if (deals && deals.length > 0) {
    prompt += `\n3. Use ingredients currently on sale when possible to save money`;
  }

  prompt += `\n${deals ? '4' : '3'}. Take less than ${maxTime} minutes to prepare and cook combined`;

  if (cuisine !== 'any') {
    prompt += `\n${deals ? '5' : '4'}. Feature ${cuisine} cuisine`;
  }

  prompt += `\n\nIMPORTANT RECIPE REQUIREMENTS:
- ALL recipes MUST be gluten-free (or include gluten-free substitutions)
- NO nuts except raw almonds (if almonds are allowed)
- Use lean proteins and avoid high saturated fat ingredients
- NO regular potatoes (sweet potatoes are fine)
- Recipes should be family-friendly and kid-approved
- Include precise measurements for all ingredients
- Provide clear, step-by-step instructions

Return your response as a JSON array with this EXACT structure (no additional text):

\`\`\`json
[
  {
    "title": "Recipe name in Danish",
    "description": "Brief appetizing description",
    "prep_time_minutes": 15,
    "cook_time_minutes": 30,
    "servings": ${restrictions.total_members},
    "ingredients": [
      {
        "name": "Ingredient name",
        "quantity": "200",
        "unit": "g"
      }
    ],
    "instructions": "Step 1: Do this.\\nStep 2: Do that.\\nStep 3: Finish.",
    "dietary_tags": ["gluten-free", "nut-free", "low-fat"],
    "on_sale_ingredients": ["chicken", "tomatoes"]${deals ? ',' : ''}${deals ? '\n    "estimated_cost": 120' : ''}
  }
]
\`\`\`

Remember: Safety first! All recipes must be safe for family members with gluten intolerance, nut allergies, and other restrictions.`;

  return prompt;
}
