// Type definitions for the Foodplan application

// ====================
// EXISTING TYPES (from original schema)
// ====================

export interface Store {
  id: string;
  name: string;
  slug: string;
}

export interface Deal {
  id: string;
  category: string;
  originalName: string;
  normalizedName: string;
  price: number;
  quantity?: string;
  unitType?: string;
  pricePerUnit?: number;
  isAppPrice: boolean;
  validFrom: string;
  validTo: string;
  scrapedAt: string;
}

export interface Category {
  id: string;
  name: string;
}

// ====================
// NEW TYPES (meal planning features)
// ====================

export type UserRole = 'husband' | 'wife' | 'child1' | 'child2';
export type RecipeSource = 'ai_generated' | 'user_created' | 'imported';
export type SaturatedFatLevel = 'low' | 'medium' | 'high';
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';
export type StorePreference = 'netto' | 'rema' | 'meny' | 'any';
export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0=Monday, 6=Sunday

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  role?: UserRole;

  // Dietary restrictions
  is_gluten_free: boolean;
  has_nut_allergy: boolean;
  can_eat_almonds: boolean;
  avoid_saturated_fat: boolean;
  avoid_potatoes: boolean;
  can_eat_sweet_potatoes: boolean;

  created_at: string;
  updated_at: string;
}

export interface RecipeIngredient {
  name: string;
  quantity: string;
  unit: string;
}

export interface Recipe {
  id: string;
  user_id?: string;

  // Recipe details
  title: string;
  description?: string;
  ingredients?: RecipeIngredient[];
  instructions?: string;
  prep_time_minutes?: number;
  cook_time_minutes?: number;
  servings?: number;

  // Dietary flags
  is_gluten_free: boolean;
  contains_nuts: boolean;
  nut_types?: string[];
  saturated_fat_level?: SaturatedFatLevel;
  contains_potatoes: boolean;
  contains_sweet_potatoes: boolean;

  // Metadata
  image_url?: string;
  source: RecipeSource;
  tags?: string[];

  created_at: string;
  updated_at: string;
}

export interface MealPlan {
  id: string;
  user_id: string;

  // Week information
  week_start_date: string; // ISO date string
  week_number: number;
  year: number;
  is_active: boolean;

  created_at: string;
  updated_at: string;
}

export interface MealPlanItem {
  id: string;
  meal_plan_id: string;
  recipe_id?: string;

  // Meal timing
  day_of_week: DayOfWeek;
  meal_type: MealType;

  // Custom notes for non-recipe meals
  custom_notes?: string;

  created_at: string;
  updated_at: string;

  // Optional expanded relations
  recipe?: Recipe;
}

export interface ShoppingList {
  id: string;
  user_id: string;
  meal_plan_id?: string;

  title: string;
  is_completed: boolean;

  created_at: string;
  updated_at: string;

  // Optional expanded relations
  meal_plan?: MealPlan;
  items?: ShoppingListItem[];
}

export interface ShoppingListItem {
  id: string;
  shopping_list_id: string;

  // Link to existing products/deals
  product_id?: string;
  deal_id?: string;

  // Item details
  name: string;
  quantity?: string;
  unit?: string;
  category_id?: string;

  // Shopping status
  is_checked: boolean;
  estimated_price?: number;
  store_preference: StorePreference;
  notes?: string;

  created_at: string;
  updated_at: string;

  // Optional expanded relations
  product?: any; // TODO: Define Product type when schema is known
  deal?: Deal;
  category?: Category;
}

// ====================
// UTILITY TYPES
// ====================

// For creating new records (without id, timestamps)
export type CreateUserProfile = Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>;
export type CreateRecipe = Omit<Recipe, 'id' | 'created_at' | 'updated_at'>;
export type CreateMealPlan = Omit<MealPlan, 'id' | 'created_at' | 'updated_at'>;
export type CreateMealPlanItem = Omit<MealPlanItem, 'id' | 'created_at' | 'updated_at'>;
export type CreateShoppingList = Omit<ShoppingList, 'id' | 'created_at' | 'updated_at'>;
export type CreateShoppingListItem = Omit<ShoppingListItem, 'id' | 'created_at' | 'updated_at'>;

// For updating records (all fields optional except id)
export type UpdateUserProfile = Partial<Omit<UserProfile, 'id' | 'created_at'>> & { id: string };
export type UpdateRecipe = Partial<Omit<Recipe, 'id' | 'created_at'>> & { id: string };
export type UpdateMealPlan = Partial<Omit<MealPlan, 'id' | 'created_at'>> & { id: string };
export type UpdateMealPlanItem = Partial<Omit<MealPlanItem, 'id' | 'created_at'>> & { id: string };
export type UpdateShoppingList = Partial<Omit<ShoppingList, 'id' | 'created_at'>> & { id: string };
export type UpdateShoppingListItem = Partial<Omit<ShoppingListItem, 'id' | 'created_at'>> & { id: string };
