# Database Schema Documentation

This document describes the complete database schema for the Foodplan application, including both the existing deal-tracking tables and the new meal planning features.

## Table of Contents

1. [Overview](#overview)
2. [Existing Schema](#existing-schema)
3. [New Schema (Meal Planning)](#new-schema-meal-planning)
4. [Relationships](#relationships)
5. [Running Migrations](#running-migrations)
6. [Dietary Restrictions](#dietary-restrictions)

---

## Overview

The Foodplan database consists of two main feature sets:

1. **Deal Tracking** (existing): Stores, categories, products, and price deals from Danish grocery stores
2. **Meal Planning** (new): User profiles, recipes, meal plans, and shopping lists

Both schemas are designed to work together - shopping list items can be linked to products and deals to suggest the best prices.

---

## Existing Schema

These tables were created previously and are NOT modified by the new migration:

### `stores`
Grocery stores in Denmark (Netto, Rema 1000, Meny)

### `categories`
Product categories (15 categories like dairy, meat, produce, etc.)

### `products`
Product names and information

### `deals`
Price history and current deals scraped from stores

### `price_metrics`
Historical price tracking and analytics

---

## New Schema (Meal Planning)

### `user_profiles`

User profiles with dietary restrictions for each family member.

**Columns:**
- `id` (UUID, primary key) - References auth.users
- `email` (TEXT) - User's email address
- `full_name` (TEXT) - User's full name
- `role` (TEXT) - Family member role: 'husband', 'wife', 'child1', 'child2'

**Dietary Restrictions:**
- `is_gluten_free` (BOOLEAN) - Default true (3 out of 4 family members)
- `has_nut_allergy` (BOOLEAN) - Default false (true for husband)
- `can_eat_almonds` (BOOLEAN) - Default true (husband can eat almonds despite nut allergy)
- `avoid_saturated_fat` (BOOLEAN) - Default false (true for wife)
- `avoid_potatoes` (BOOLEAN) - Default false (true for wife)
- `can_eat_sweet_potatoes` (BOOLEAN) - Default true (wife can eat sweet potatoes)

**Timestamps:**
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

---

### `recipes`

Recipe collection with ingredients and dietary information.

**Columns:**
- `id` (UUID, primary key)
- `user_id` (UUID) - References user_profiles
- `title` (TEXT, required) - Recipe name
- `description` (TEXT) - Recipe description
- `ingredients` (JSONB) - Array of {name, quantity, unit}
- `instructions` (TEXT) - Cooking instructions
- `prep_time_minutes` (INTEGER) - Preparation time
- `cook_time_minutes` (INTEGER) - Cooking time
- `servings` (INTEGER) - Number of servings

**Dietary Flags:**
- `is_gluten_free` (BOOLEAN)
- `contains_nuts` (BOOLEAN)
- `nut_types` (TEXT[]) - Array: 'almonds', 'walnuts', 'peanuts', etc.
- `saturated_fat_level` (TEXT) - 'low', 'medium', or 'high'
- `contains_potatoes` (BOOLEAN)
- `contains_sweet_potatoes` (BOOLEAN)

**Metadata:**
- `image_url` (TEXT) - Recipe image
- `source` (TEXT) - 'ai_generated', 'user_created', or 'imported'
- `tags` (TEXT[]) - Recipe tags
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

---

### `meal_plans`

Weekly meal plans for users.

**Columns:**
- `id` (UUID, primary key)
- `user_id` (UUID) - References user_profiles
- `week_start_date` (DATE) - First day of the week (Monday)
- `week_number` (INTEGER) - Week number (1-52)
- `year` (INTEGER) - Year
- `is_active` (BOOLEAN) - Whether this is the active plan
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

**Constraints:**
- UNIQUE(user_id, week_start_date) - One plan per week per user

---

### `meal_plan_items`

Individual meals within a meal plan.

**Columns:**
- `id` (UUID, primary key)
- `meal_plan_id` (UUID) - References meal_plans
- `recipe_id` (UUID, nullable) - References recipes
- `day_of_week` (INTEGER) - 0=Monday, 1=Tuesday, ..., 6=Sunday
- `meal_type` (TEXT) - 'breakfast', 'lunch', 'dinner', or 'snack'
- `custom_notes` (TEXT) - Notes for non-recipe meals
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

**Constraints:**
- UNIQUE(meal_plan_id, day_of_week, meal_type) - One meal per slot

---

### `shopping_lists`

Shopping lists, optionally linked to meal plans.

**Columns:**
- `id` (UUID, primary key)
- `user_id` (UUID) - References user_profiles
- `meal_plan_id` (UUID, nullable) - References meal_plans
- `title` (TEXT) - List title
- `is_completed` (BOOLEAN) - Whether shopping is done
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

---

### `shopping_list_items`

Items on a shopping list, optionally linked to products and deals.

**Columns:**
- `id` (UUID, primary key)
- `shopping_list_id` (UUID) - References shopping_lists
- `product_id` (UUID, nullable) - References products (for price matching)
- `deal_id` (UUID, nullable) - References deals (for suggested deals)
- `name` (TEXT, required) - Item name
- `quantity` (TEXT) - Quantity needed
- `unit` (TEXT) - Unit of measurement
- `category_id` (UUID, nullable) - References categories
- `is_checked` (BOOLEAN) - Whether item is checked off
- `estimated_price` (DECIMAL) - Estimated price
- `store_preference` (TEXT) - 'netto', 'rema', 'meny', or 'any'
- `notes` (TEXT) - Additional notes
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

---

## Relationships

### Entity Relationship Diagram

```
auth.users (Supabase Auth)
    ↓
user_profiles (1:1)
    ↓
    ├── recipes (1:many)
    │       ↓
    │   meal_plan_items (references recipe_id)
    │
    ├── meal_plans (1:many)
    │       ↓
    │   meal_plan_items (many:1)
    │
    └── shopping_lists (1:many)
            ↓
        shopping_list_items (many:1)
            ├── products (optional)
            ├── deals (optional)
            └── categories (optional)
```

### Key Relationships

1. **User Profiles**
   - 1:1 with auth.users (each user has one profile)
   - 1:many with recipes (users can create many recipes)
   - 1:many with meal_plans (users can have many weekly plans)
   - 1:many with shopping_lists (users can create many lists)

2. **Recipes**
   - Belong to one user
   - Can be used in many meal_plan_items

3. **Meal Plans**
   - Belong to one user
   - Contain many meal_plan_items (7 days × 4 meals = up to 28 items)
   - Can be linked to shopping_lists

4. **Shopping Lists**
   - Belong to one user
   - Optionally linked to one meal_plan
   - Contain many shopping_list_items

5. **Shopping List Items**
   - Belong to one shopping_list
   - Optionally linked to products (for existing product catalog)
   - Optionally linked to deals (for current promotions)
   - Optionally categorized (for grouping in the list)

---

## Running Migrations

### Option 1: Supabase Dashboard (Recommended)

1. Log in to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy the contents of `/foodplan/supabase/migrations/add_meal_planning_schema.sql`
5. Paste into the SQL Editor
6. Click **Run**

### Option 2: Supabase CLI

If you have the Supabase CLI installed locally:

```bash
cd foodplan
supabase db reset  # This will run all migrations
```

Or to run a specific migration:

```bash
supabase db push
```

### Verification

After running the migration, verify the tables were created:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'user_profiles',
    'recipes',
    'meal_plans',
    'meal_plan_items',
    'shopping_lists',
    'shopping_list_items'
  );
```

You should see all 6 new tables listed.

### Check Row Level Security

Verify RLS is enabled:

```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'user_profiles',
    'recipes',
    'meal_plans',
    'meal_plan_items',
    'shopping_lists',
    'shopping_list_items'
  );
```

All tables should have `rowsecurity = true`.

---

## Dietary Restrictions

The schema is designed to accommodate the following family dietary requirements:

### Family Members

- **3 out of 4 members**: Gluten-free
- **Husband**:
  - Nut allergy (but can eat raw almonds)
  - Avoids nuts in general
- **Wife**:
  - Can't eat too much saturated fat
  - Can't eat potatoes (but can eat sweet potatoes)

### How It Works

1. **User Profiles**: Each family member has dietary flags set on their profile
2. **Recipe Filtering**: Recipes are tagged with dietary information
3. **Meal Plan Validation**: When adding a recipe to a meal plan, the app can check compatibility
4. **Shopping Lists**: Items can be filtered based on dietary needs

### Example: Recipe Compatibility Check

```typescript
import { Recipe, UserProfile } from '@/types';

function isRecipeCompatible(recipe: Recipe, user: UserProfile): boolean {
  // Check gluten
  if (user.is_gluten_free && !recipe.is_gluten_free) {
    return false;
  }

  // Check nuts
  if (user.has_nut_allergy && recipe.contains_nuts) {
    // Exception: user can eat almonds
    if (user.can_eat_almonds &&
        recipe.nut_types?.length === 1 &&
        recipe.nut_types[0] === 'almonds') {
      // OK to eat
    } else {
      return false;
    }
  }

  // Check saturated fat
  if (user.avoid_saturated_fat && recipe.saturated_fat_level === 'high') {
    return false;
  }

  // Check potatoes
  if (user.avoid_potatoes && recipe.contains_potatoes) {
    return false;
  }

  return true;
}
```

---

## Indexes

The migration creates indexes for common query patterns:

### User Profiles
- `idx_user_profiles_email` - Fast email lookups
- `idx_user_profiles_role` - Filter by family role

### Recipes
- `idx_recipes_user_id` - User's recipes
- `idx_recipes_dietary` - Filter by dietary requirements
- `idx_recipes_source` - Filter by source (AI vs user)
- `idx_recipes_tags` - GIN index for tag searches

### Meal Plans
- `idx_meal_plans_user_week` - Find user's plan for a specific week
- `idx_meal_plans_active` - Find active plans
- `idx_meal_plans_year_week` - Calendar lookups

### Meal Plan Items
- `idx_meal_plan_items_plan` - All items in a plan
- `idx_meal_plan_items_schedule` - Items by day and meal type
- `idx_meal_plan_items_recipe` - Find uses of a recipe

### Shopping Lists
- `idx_shopping_lists_user` - User's lists (sorted by date)
- `idx_shopping_lists_meal_plan` - Lists for a meal plan
- `idx_shopping_lists_completed` - Filter by completion status

### Shopping List Items
- `idx_shopping_list_items_list` - Items in a list
- `idx_shopping_list_items_checked` - Filter by checked status
- `idx_shopping_list_items_product` - Link to products
- `idx_shopping_list_items_deal` - Link to deals
- `idx_shopping_list_items_category` - Group by category

---

## Security (Row Level Security)

All tables have Row Level Security (RLS) enabled. Users can only access their own data:

- **Direct ownership**: user_profiles, recipes, meal_plans, shopping_lists
- **Indirect ownership**: meal_plan_items (through meal_plans), shopping_list_items (through shopping_lists)

RLS policies use `auth.uid()` to verify ownership before allowing SELECT, INSERT, UPDATE, or DELETE operations.

---

## Automatic Timestamps

All tables include `updated_at` triggers that automatically update the timestamp on every UPDATE operation. This ensures accurate change tracking without manual intervention.

---

## Next Steps

After running the migration:

1. Create a user profile for each family member
2. Set appropriate dietary restriction flags
3. Start adding recipes (manually or via AI generation)
4. Create weekly meal plans
5. Generate shopping lists from meal plans
6. Link shopping list items to products/deals for price optimization

---

## Support

For questions or issues with the database schema:

1. Check this documentation
2. Review the migration file: `/foodplan/supabase/migrations/add_meal_planning_schema.sql`
3. Check the TypeScript types: `/foodplan/types/index.ts`
4. Consult Supabase documentation: https://supabase.com/docs

---

**Last Updated**: 2025-11-15
**Schema Version**: 1.0
**Migration File**: `add_meal_planning_schema.sql`
