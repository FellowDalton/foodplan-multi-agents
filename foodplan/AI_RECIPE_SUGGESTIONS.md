# AI Recipe Suggestions Feature

This document describes the AI-powered recipe suggestion system integrated into the Foodplan application.

## Overview

The AI Recipe Suggestions feature uses Claude AI (Anthropic) to generate personalized recipe recommendations based on:

1. **Family Dietary Restrictions** - Fetched from user profiles (gluten-free, nut allergies, low saturated fat, no potatoes, etc.)
2. **Current Grocery Deals** - Optional integration with Danish supermarket deals (Netto, Rema, Meny)
3. **User Preferences** - Meal type, cuisine, cooking time, number of recipes

## Architecture

### Files Created

#### Backend (API Routes)
- `/app/api/recipes/suggest/route.ts` - Main AI suggestion endpoint (POST)
- `/app/api/recipes/route.ts` - Recipe CRUD operations (GET, POST)

#### Frontend (Pages & Components)
- `/app/dashboard/recipes/suggest/page.tsx` - Recipe suggestion interface
- `/components/RecipeSuggestionForm.tsx` - Form for user preferences
- `/components/RecipeCard.tsx` - Display recipe with ingredients & instructions
- `/components/SaveRecipeButton.tsx` - Save AI-generated recipe to database

#### Infrastructure
- `/lib/claude.ts` - Claude API client and configuration
- `/types/index.ts` - TypeScript types for recipe suggestions (updated)
- `.env.local` - Added ANTHROPIC_API_KEY configuration
- `.env.sample` - Added ANTHROPIC_API_KEY documentation

### Database Integration

Uses existing Supabase schema:
- `user_profiles` - Fetch family dietary restrictions
- `recipes` - Save AI-generated recipes
- `family_members` - Verify user access to family

## API Endpoints

### POST /api/recipes/suggest

Generate AI-powered recipe suggestions.

**Request Body:**
```json
{
  "family_id": "uuid",
  "meal_type": "dinner",
  "cuisine": "italian",
  "max_cooking_time": 60,
  "num_recipes": 3,
  "use_deals": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "recipes": [
      {
        "title": "Grilled Chicken with Roasted Vegetables",
        "description": "A healthy, gluten-free dinner",
        "prep_time_minutes": 15,
        "cook_time_minutes": 30,
        "servings": 4,
        "ingredients": [
          {
            "name": "Chicken breast",
            "quantity": "500",
            "unit": "g"
          }
        ],
        "instructions": "Step 1: ...\nStep 2: ...",
        "dietary_tags": ["gluten-free", "nut-free", "low-fat"],
        "on_sale_ingredients": ["chicken"],
        "estimated_cost": 120
      }
    ],
    "family_restrictions": {
      "gluten_free_count": 3,
      "nut_allergies": 1,
      "avoid_saturated_fat": true,
      "avoid_potatoes": true
    },
    "deals_used": true
  }
}
```

### POST /api/recipes

Save a recipe to the database.

**Request Body:**
```json
{
  "title": "Recipe Name",
  "description": "Description",
  "ingredients": [...],
  "instructions": "Steps...",
  "prep_time_minutes": 15,
  "cook_time_minutes": 30,
  "servings": 4,
  "is_gluten_free": true,
  "contains_nuts": false,
  "saturated_fat_level": "low",
  "contains_potatoes": false,
  "contains_sweet_potatoes": true,
  "source": "ai_generated",
  "tags": ["gluten-free", "healthy"]
}
```

## How It Works

### 1. User Workflow

1. User navigates to `/dashboard/recipes/suggest`
2. Fills out preference form:
   - Meal type (breakfast, lunch, dinner, snack)
   - Cuisine type (Danish, Italian, Asian, etc.)
   - Max cooking time (15-120 minutes)
   - Number of recipes (1-5)
   - Use current deals checkbox
3. Clicks "Generate Recipes"
4. AI generates recipes in 10-20 seconds
5. User reviews recipes with:
   - Dietary tags
   - Ingredients (with sale items highlighted)
   - Step-by-step instructions
   - Time estimates
6. User can save recipes to database

### 2. AI Prompt Engineering

The system builds a comprehensive prompt including:

```
You are a family meal planning assistant for a Danish family of 4 people.

CRITICAL DIETARY RESTRICTIONS (MUST BE FOLLOWED):
- 3 out of 4 members require gluten-free meals
- 1 member(s) have nut allergies (but raw almonds are OK)
- 1 member should avoid saturated fat
- 1 member cannot eat potatoes (but sweet potatoes are fine)

CURRENT DEALS AT DANISH SUPERMARKETS:
[List of current deals from Netto, Rema, Meny...]

TASK:
Please suggest 3 dinner recipe(s) that:
1. Are COMPLETELY SAFE for all family members
2. Are suitable for 4 people
3. Use ingredients currently on sale when possible
4. Take less than 60 minutes to prepare

...
```

### 3. Dietary Restriction Enforcement

The AI is instructed to:
- ✅ Make ALL recipes gluten-free (or provide substitutions)
- ✅ Avoid all nuts except raw almonds (if allowed)
- ✅ Use lean proteins and avoid high saturated fat
- ✅ Never use regular potatoes (sweet potatoes OK)
- ✅ Create family-friendly, kid-approved meals

### 4. Deal Integration

When `use_deals: true`:
1. Fetch current deals from `/api/deals`
2. Include top 50 deals in prompt (grouped by category)
3. Ask Claude to prioritize sale ingredients
4. Highlight sale ingredients in recipe display
5. Provide estimated cost savings

## Configuration

### Required Environment Variables

Add to `.env.local`:

```env
ANTHROPIC_API_KEY=sk-ant-...
```

Get your API key from: https://console.anthropic.com/

### Claude Model

Currently using: **claude-3-5-sonnet-20241022**

This model provides:
- Excellent instruction following for dietary restrictions
- Natural language understanding
- Structured JSON output
- Fast response times (10-20 seconds)

## Error Handling

The system handles:

1. **Missing API Key** - Shows friendly error message
2. **No Family Profiles** - Redirects to family setup
3. **Invalid JSON Response** - Attempts to extract JSON from markdown code blocks
4. **API Timeout** - Shows loading state with user-friendly message
5. **Authentication Errors** - Redirects to login

## UI Features

### RecipeSuggestionForm
- Meal type selector
- Cuisine dropdown
- Cooking time slider (15-120 min)
- Number of recipes (1-5)
- "Use deals" checkbox
- Loading state with spinner

### RecipeCard
- Expandable card design
- Dietary tags (gluten-free, nut-free, low-fat)
- Time breakdown (prep, cook, total)
- Estimated cost (if using deals)
- Ingredient list with sale highlighting
- Step-by-step instructions
- Save recipe button

### SaveRecipeButton
- One-click save to database
- Success confirmation
- Error handling
- Disabled state while saving

## Testing Instructions

### 1. Setup

```bash
# Install dependencies
npm install

# Add API key to .env.local
ANTHROPIC_API_KEY=sk-ant-your-key-here

# Start dev server
npm run dev
```

### 2. Test Flow

1. Navigate to http://localhost:3000/dashboard
2. Click "AI Recipes" card
3. Fill out preference form
4. Click "Generate Recipes"
5. Wait 10-20 seconds for AI generation
6. Review generated recipes
7. Expand recipe to see details
8. Click "Save Recipe" to save to database
9. Verify recipe appears in saved recipes

### 3. Dietary Restrictions Test

Test with family profiles:
- 3/4 members gluten-free
- 1 member nut allergy (almonds OK)
- 1 member avoid saturated fat
- 1 member no potatoes (sweet potatoes OK)

Verify:
- ALL recipes are gluten-free
- NO nuts except almonds
- Low-fat proteins used
- NO regular potatoes
- Sweet potatoes allowed

### 4. Deal Integration Test

Enable "Use current deals":
- Verify deals fetched from `/api/deals`
- Check sale ingredients highlighted in yellow
- Verify estimated cost shown
- Confirm recipes prioritize sale items

## Future Enhancements

Potential improvements:

1. **Streaming Responses** - Show recipes as they're generated
2. **Recipe Variations** - "Make it vegetarian", "Double the recipe"
3. **Shopping List Integration** - Auto-create shopping list from recipe
4. **Meal Plan Integration** - Add recipe directly to meal plan
5. **Recipe History** - Track previously generated recipes
6. **Favorite Recipes** - Star and filter favorite recipes
7. **Share Recipes** - Share with family members
8. **Print Recipes** - Print-friendly format
9. **Nutrition Info** - Calculate calories, macros, etc.
10. **Image Generation** - Generate recipe images with DALL-E

## Cost Estimation

Claude API pricing (as of Nov 2024):
- Input: ~$3 per million tokens
- Output: ~$15 per million tokens

Typical recipe generation:
- Input: ~1,500 tokens (dietary info + deals)
- Output: ~1,000 tokens (3 recipes)
- Cost per request: ~$0.02 USD

Budget for 100 recipe generations/month: ~$2 USD

## Security Considerations

1. **API Key Protection** - Never expose in client-side code
2. **Authentication** - All endpoints require valid Supabase auth
3. **Family Access Control** - Verify user has access to family_id
4. **Rate Limiting** - Consider adding rate limits for production
5. **Input Validation** - Validate all user inputs
6. **Error Messages** - Don't expose internal errors to users

## Troubleshooting

### "Claude API is not configured"
- Check ANTHROPIC_API_KEY in .env.local
- Restart dev server after adding key

### "Failed to parse recipe suggestions"
- Check Claude API response in server logs
- Verify JSON format in prompt
- May need to adjust prompt if Claude changes behavior

### "Failed to fetch family profiles"
- Verify user has created family
- Check family_members table has entry
- Verify RLS policies in Supabase

### Slow responses (>30 seconds)
- Normal for first request (cold start)
- Consider implementing caching
- May need to upgrade Claude tier for faster responses

## Support

For issues or questions:
- Check server logs: `npm run dev` output
- Review Claude API docs: https://docs.anthropic.com/
- Test API key: https://console.anthropic.com/

---

**Status**: ✅ Fully Implemented and Tested
**Build Status**: ✅ Passing
**TypeScript**: ✅ No Errors
**Dependencies**: ✅ @anthropic-ai/sdk@^0.32.0
