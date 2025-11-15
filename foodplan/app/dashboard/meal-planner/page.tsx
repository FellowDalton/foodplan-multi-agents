'use client';

import { useState, useEffect, useCallback } from 'react';
import WeekNavigator from '@/components/WeekNavigator';
import MealPlanGrid from '@/components/MealPlanGrid';
import RecipeLibrary from '@/components/RecipeLibrary';
import type { MealPlan, MealPlanItem, Recipe, MealType, DayOfWeek } from '@/types';

/**
 * Get Monday of the current week
 */
function getCurrentWeekStart(): Date {
  const today = new Date();
  const day = today.getDay();
  const diff = today.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(today.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday;
}

/**
 * Format date as YYYY-MM-DD
 */
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Add days to a date
 */
function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Check if a day of week is today
 */
function isTodayFunc(weekStart: Date, dayOfWeek: DayOfWeek): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const targetDate = addDays(weekStart, dayOfWeek);
  return targetDate.getTime() === today.getTime();
}

export default function MealPlannerPage() {
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(getCurrentWeekStart());
  const [mealPlan, setMealPlan] = useState<(MealPlan & { items?: MealPlanItem[] }) | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{
    dayOfWeek: DayOfWeek;
    mealType: MealType;
    item?: MealPlanItem;
  } | null>(null);

  // Fetch recipes
  useEffect(() => {
    async function fetchRecipes() {
      try {
        const response = await fetch('/api/recipes');
        if (!response.ok) throw new Error('Failed to fetch recipes');
        const data = await response.json();
        setRecipes(data.recipes || []);
      } catch (err) {
        console.error('Error fetching recipes:', err);
        setError('Failed to load recipes');
      }
    }
    fetchRecipes();
  }, []);

  // Fetch meal plan for current week
  const fetchMealPlan = useCallback(async (weekStart: Date) => {
    setLoading(true);
    setError(null);
    try {
      const weekParam = formatDate(weekStart);
      const response = await fetch(`/api/meal-plans?week=${weekParam}`);

      if (!response.ok) throw new Error('Failed to fetch meal plan');

      const data = await response.json();
      setMealPlan(data.mealPlan);
    } catch (err) {
      console.error('Error fetching meal plan:', err);
      setError('Failed to load meal plan');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMealPlan(currentWeekStart);
  }, [currentWeekStart, fetchMealPlan]);

  // Create meal plan for the week if it doesn't exist
  const createMealPlan = async () => {
    try {
      const weekParam = formatDate(currentWeekStart);
      const response = await fetch('/api/meal-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ week_start_date: weekParam }),
      });

      if (!response.ok) throw new Error('Failed to create meal plan');

      const data = await response.json();
      setMealPlan(data.mealPlan);
    } catch (err) {
      console.error('Error creating meal plan:', err);
      setError('Failed to create meal plan');
    }
  };

  // Add meal to plan
  const addMealToPlan = async (recipeId: string, dayOfWeek: DayOfWeek, mealType: MealType) => {
    if (!mealPlan) return;

    try {
      const response = await fetch(`/api/meal-plans/${mealPlan.id}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipe_id: recipeId,
          day_of_week: dayOfWeek,
          meal_type: mealType,
        }),
      });

      if (!response.ok) throw new Error('Failed to add meal');

      const data = await response.json();

      // Update local state optimistically
      setMealPlan((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          items: [...(prev.items || []), data.item],
        };
      });

      setSelectedSlot(null);
    } catch (err) {
      console.error('Error adding meal:', err);
      alert('Failed to add meal to plan');
    }
  };

  // Remove meal from plan
  const removeMealFromPlan = async (itemId: string) => {
    if (!mealPlan) return;

    try {
      const response = await fetch(`/api/meal-plans/${mealPlan.id}/items/${itemId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to remove meal');

      // Update local state optimistically
      setMealPlan((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          items: (prev.items || []).filter((item) => item.id !== itemId),
        };
      });
    } catch (err) {
      console.error('Error removing meal:', err);
      alert('Failed to remove meal from plan');
    }
  };

  // Week navigation handlers
  const handlePreviousWeek = () => {
    setCurrentWeekStart((prev) => addDays(prev, -7));
  };

  const handleNextWeek = () => {
    setCurrentWeekStart((prev) => addDays(prev, 7));
  };

  const handleJumpToToday = () => {
    setCurrentWeekStart(getCurrentWeekStart());
  };

  // Slot click handler
  const handleSlotClick = (dayOfWeek: DayOfWeek, mealType: MealType, item?: MealPlanItem) => {
    if (item) {
      // TODO: Open meal details modal
      console.log('View meal details:', item);
    } else {
      // Open recipe selector
      setSelectedSlot({ dayOfWeek, mealType });
    }
  };

  // Recipe selection handler
  const handleRecipeSelect = (recipe: Recipe) => {
    if (selectedSlot && mealPlan) {
      addMealToPlan(recipe.id, selectedSlot.dayOfWeek, selectedSlot.mealType);
    }
  };

  if (loading && !mealPlan) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading meal planner...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Meal Planner</h1>
        <p className="mt-2 text-gray-600">
          Plan your weekly meals with drag-and-drop simplicity
        </p>
      </div>

      <WeekNavigator
        currentWeekStart={currentWeekStart}
        onPreviousWeek={handlePreviousWeek}
        onNextWeek={handleNextWeek}
        onJumpToToday={handleJumpToToday}
      />

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {!mealPlan ? (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No meal plan for this week
          </h2>
          <p className="text-gray-600 mb-4">
            Create a meal plan to start organizing your weekly meals
          </p>
          <button
            onClick={createMealPlan}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Meal Plan
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main meal grid */}
          <div className="lg:col-span-3">
            <MealPlanGrid
              items={mealPlan.items || []}
              onSlotClick={handleSlotClick}
              onRemoveItem={removeMealFromPlan}
              isToday={(dayOfWeek) => isTodayFunc(currentWeekStart, dayOfWeek)}
            />
          </div>

          {/* Recipe library sidebar */}
          <div className="lg:col-span-1">
            <RecipeLibrary
              recipes={recipes}
              onRecipeSelect={handleRecipeSelect}
            />
          </div>
        </div>
      )}

      {/* Simple recipe selector modal */}
      {selectedSlot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Select a Recipe</h3>
                <button
                  onClick={() => setSelectedSlot(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              <RecipeLibrary
                recipes={recipes}
                onRecipeSelect={handleRecipeSelect}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
