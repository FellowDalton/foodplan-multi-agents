-- Migration: Add Meal Planning Schema
-- Description: Adds tables for user profiles, recipes, meal plans, and shopping lists
-- This extends the existing schema (stores, categories, products, deals, price_metrics)

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ====================
-- USER PROFILES TABLE
-- ====================
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT CHECK (role IN ('husband', 'wife', 'child1', 'child2')),

  -- Dietary restrictions
  is_gluten_free BOOLEAN DEFAULT true,
  has_nut_allergy BOOLEAN DEFAULT false,
  can_eat_almonds BOOLEAN DEFAULT true,
  avoid_saturated_fat BOOLEAN DEFAULT false,
  avoid_potatoes BOOLEAN DEFAULT false,
  can_eat_sweet_potatoes BOOLEAN DEFAULT true,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================
-- RECIPES TABLE
-- ====================
CREATE TABLE IF NOT EXISTS recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,

  -- Recipe details
  title TEXT NOT NULL,
  description TEXT,
  ingredients JSONB, -- Array of {name, quantity, unit}
  instructions TEXT,
  prep_time_minutes INTEGER,
  cook_time_minutes INTEGER,
  servings INTEGER,

  -- Dietary flags
  is_gluten_free BOOLEAN DEFAULT false,
  contains_nuts BOOLEAN DEFAULT false,
  nut_types TEXT[], -- Array of nut types: 'almonds', 'walnuts', 'peanuts', etc.
  saturated_fat_level TEXT CHECK (saturated_fat_level IN ('low', 'medium', 'high')),
  contains_potatoes BOOLEAN DEFAULT false,
  contains_sweet_potatoes BOOLEAN DEFAULT false,

  -- Metadata
  image_url TEXT,
  source TEXT CHECK (source IN ('ai_generated', 'user_created', 'imported')) DEFAULT 'user_created',
  tags TEXT[],

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================
-- MEAL PLANS TABLE
-- ====================
CREATE TABLE IF NOT EXISTS meal_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,

  -- Week information
  week_start_date DATE NOT NULL,
  week_number INTEGER NOT NULL,
  year INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Ensure only one active meal plan per week per user
  UNIQUE(user_id, week_start_date)
);

-- ====================
-- MEAL PLAN ITEMS TABLE
-- ====================
CREATE TABLE IF NOT EXISTS meal_plan_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meal_plan_id UUID REFERENCES meal_plans(id) ON DELETE CASCADE,
  recipe_id UUID REFERENCES recipes(id) ON DELETE SET NULL,

  -- Meal timing
  day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Monday, 6=Sunday
  meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),

  -- Custom notes for non-recipe meals
  custom_notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Ensure only one meal per day/meal_type combination
  UNIQUE(meal_plan_id, day_of_week, meal_type)
);

-- ====================
-- SHOPPING LISTS TABLE
-- ====================
CREATE TABLE IF NOT EXISTS shopping_lists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  meal_plan_id UUID REFERENCES meal_plans(id) ON DELETE SET NULL,

  title TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT false,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================
-- SHOPPING LIST ITEMS TABLE
-- ====================
CREATE TABLE IF NOT EXISTS shopping_list_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shopping_list_id UUID REFERENCES shopping_lists(id) ON DELETE CASCADE,

  -- Link to existing products/deals for price matching
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  deal_id UUID REFERENCES deals(id) ON DELETE SET NULL,

  -- Item details
  name TEXT NOT NULL,
  quantity TEXT,
  unit TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,

  -- Shopping status
  is_checked BOOLEAN DEFAULT false,
  estimated_price DECIMAL(10, 2),
  store_preference TEXT CHECK (store_preference IN ('netto', 'rema', 'meny', 'any')) DEFAULT 'any',
  notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================
-- INDEXES FOR PERFORMANCE
-- ====================

-- User profiles indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);

-- Recipes indexes
CREATE INDEX IF NOT EXISTS idx_recipes_user_id ON recipes(user_id);
CREATE INDEX IF NOT EXISTS idx_recipes_dietary ON recipes(user_id, is_gluten_free, contains_nuts);
CREATE INDEX IF NOT EXISTS idx_recipes_source ON recipes(source);
CREATE INDEX IF NOT EXISTS idx_recipes_tags ON recipes USING GIN(tags);

-- Meal plans indexes
CREATE INDEX IF NOT EXISTS idx_meal_plans_user_week ON meal_plans(user_id, week_start_date);
CREATE INDEX IF NOT EXISTS idx_meal_plans_active ON meal_plans(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_meal_plans_year_week ON meal_plans(year, week_number);

-- Meal plan items indexes
CREATE INDEX IF NOT EXISTS idx_meal_plan_items_plan ON meal_plan_items(meal_plan_id);
CREATE INDEX IF NOT EXISTS idx_meal_plan_items_schedule ON meal_plan_items(meal_plan_id, day_of_week, meal_type);
CREATE INDEX IF NOT EXISTS idx_meal_plan_items_recipe ON meal_plan_items(recipe_id);

-- Shopping lists indexes
CREATE INDEX IF NOT EXISTS idx_shopping_lists_user ON shopping_lists(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_shopping_lists_meal_plan ON shopping_lists(meal_plan_id);
CREATE INDEX IF NOT EXISTS idx_shopping_lists_completed ON shopping_lists(user_id, is_completed);

-- Shopping list items indexes
CREATE INDEX IF NOT EXISTS idx_shopping_list_items_list ON shopping_list_items(shopping_list_id);
CREATE INDEX IF NOT EXISTS idx_shopping_list_items_checked ON shopping_list_items(shopping_list_id, is_checked);
CREATE INDEX IF NOT EXISTS idx_shopping_list_items_product ON shopping_list_items(product_id);
CREATE INDEX IF NOT EXISTS idx_shopping_list_items_deal ON shopping_list_items(deal_id);
CREATE INDEX IF NOT EXISTS idx_shopping_list_items_category ON shopping_list_items(category_id);

-- ====================
-- ROW LEVEL SECURITY (RLS)
-- ====================

-- Enable RLS on all new tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plan_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_list_items ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Recipes Policies
CREATE POLICY "Users can view their own recipes"
  ON recipes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own recipes"
  ON recipes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recipes"
  ON recipes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own recipes"
  ON recipes FOR DELETE
  USING (auth.uid() = user_id);

-- Meal Plans Policies
CREATE POLICY "Users can view their own meal plans"
  ON meal_plans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own meal plans"
  ON meal_plans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own meal plans"
  ON meal_plans FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own meal plans"
  ON meal_plans FOR DELETE
  USING (auth.uid() = user_id);

-- Meal Plan Items Policies (through meal_plan ownership)
CREATE POLICY "Users can view their meal plan items"
  ON meal_plan_items FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM meal_plans
    WHERE meal_plans.id = meal_plan_items.meal_plan_id
    AND meal_plans.user_id = auth.uid()
  ));

CREATE POLICY "Users can create their meal plan items"
  ON meal_plan_items FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM meal_plans
    WHERE meal_plans.id = meal_plan_items.meal_plan_id
    AND meal_plans.user_id = auth.uid()
  ));

CREATE POLICY "Users can update their meal plan items"
  ON meal_plan_items FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM meal_plans
    WHERE meal_plans.id = meal_plan_items.meal_plan_id
    AND meal_plans.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete their meal plan items"
  ON meal_plan_items FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM meal_plans
    WHERE meal_plans.id = meal_plan_items.meal_plan_id
    AND meal_plans.user_id = auth.uid()
  ));

-- Shopping Lists Policies
CREATE POLICY "Users can view their own shopping lists"
  ON shopping_lists FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own shopping lists"
  ON shopping_lists FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own shopping lists"
  ON shopping_lists FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own shopping lists"
  ON shopping_lists FOR DELETE
  USING (auth.uid() = user_id);

-- Shopping List Items Policies (through shopping_list ownership)
CREATE POLICY "Users can view their shopping list items"
  ON shopping_list_items FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM shopping_lists
    WHERE shopping_lists.id = shopping_list_items.shopping_list_id
    AND shopping_lists.user_id = auth.uid()
  ));

CREATE POLICY "Users can create their shopping list items"
  ON shopping_list_items FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM shopping_lists
    WHERE shopping_lists.id = shopping_list_items.shopping_list_id
    AND shopping_lists.user_id = auth.uid()
  ));

CREATE POLICY "Users can update their shopping list items"
  ON shopping_list_items FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM shopping_lists
    WHERE shopping_lists.id = shopping_list_items.shopping_list_id
    AND shopping_lists.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete their shopping list items"
  ON shopping_list_items FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM shopping_lists
    WHERE shopping_lists.id = shopping_list_items.shopping_list_id
    AND shopping_lists.user_id = auth.uid()
  ));

-- ====================
-- TRIGGERS FOR UPDATED_AT
-- ====================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recipes_updated_at
  BEFORE UPDATE ON recipes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meal_plans_updated_at
  BEFORE UPDATE ON meal_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meal_plan_items_updated_at
  BEFORE UPDATE ON meal_plan_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shopping_lists_updated_at
  BEFORE UPDATE ON shopping_lists
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shopping_list_items_updated_at
  BEFORE UPDATE ON shopping_list_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ====================
-- COMMENTS FOR DOCUMENTATION
-- ====================

COMMENT ON TABLE user_profiles IS 'User profiles with dietary restrictions and preferences';
COMMENT ON TABLE recipes IS 'Recipe collection with ingredients and dietary information';
COMMENT ON TABLE meal_plans IS 'Weekly meal plans for users';
COMMENT ON TABLE meal_plan_items IS 'Individual meals within a meal plan';
COMMENT ON TABLE shopping_lists IS 'Shopping lists, optionally linked to meal plans';
COMMENT ON TABLE shopping_list_items IS 'Items on a shopping list, optionally linked to products and deals';

COMMENT ON COLUMN user_profiles.role IS 'Family member role: husband, wife, child1, or child2';
COMMENT ON COLUMN user_profiles.has_nut_allergy IS 'True for husband (but can eat almonds)';
COMMENT ON COLUMN user_profiles.can_eat_almonds IS 'True for husband despite nut allergy';
COMMENT ON COLUMN user_profiles.avoid_saturated_fat IS 'True for wife';
COMMENT ON COLUMN user_profiles.avoid_potatoes IS 'True for wife (but can eat sweet potatoes)';
COMMENT ON COLUMN user_profiles.is_gluten_free IS 'True for 3 out of 4 family members';

COMMENT ON COLUMN meal_plan_items.day_of_week IS 'Day of week: 0=Monday, 1=Tuesday, ..., 6=Sunday';
COMMENT ON COLUMN shopping_list_items.product_id IS 'Optional link to products table for price matching';
COMMENT ON COLUMN shopping_list_items.deal_id IS 'Optional link to deals table for current promotions';
