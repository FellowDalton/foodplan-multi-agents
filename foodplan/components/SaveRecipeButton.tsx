'use client';

import { useState } from 'react';
import type { RecipeSuggestion, CreateRecipe } from '@/types';

interface SaveRecipeButtonProps {
  recipe: RecipeSuggestion;
  familyId: string;
  onSaved?: () => void;
}

export default function SaveRecipeButton({
  recipe,
  familyId,
  onSaved,
}: SaveRecipeButtonProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      // Prepare recipe data for saving
      const recipeData: CreateRecipe = {
        title: recipe.title,
        description: recipe.description,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        prep_time_minutes: recipe.prep_time_minutes,
        cook_time_minutes: recipe.cook_time_minutes,
        servings: recipe.servings,
        is_gluten_free: recipe.dietary_tags.includes('gluten-free'),
        contains_nuts: !recipe.dietary_tags.includes('nut-free'),
        nut_types: recipe.dietary_tags.includes('nut-free') ? [] : undefined,
        saturated_fat_level: recipe.dietary_tags.includes('low-fat') ? 'low' : 'medium',
        contains_potatoes: false, // AI should never suggest potatoes
        contains_sweet_potatoes: recipe.ingredients.some(
          ing => ing.name.toLowerCase().includes('sweet potato') ||
                 ing.name.toLowerCase().includes('sød kartoffel')
        ),
        source: 'ai_generated',
        tags: recipe.dietary_tags,
      };

      // Save to database via API
      const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipeData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save recipe');
      }

      setIsSaved(true);

      // Call onSaved callback if provided
      if (onSaved) {
        onSaved();
      }

      // Show success for 2 seconds
      setTimeout(() => {
        setIsSaved(false);
      }, 2000);

    } catch (err) {
      console.error('Error saving recipe:', err);
      setError(err instanceof Error ? err.message : 'Failed to save recipe');
    } finally {
      setIsSaving(false);
    }
  };

  if (isSaved) {
    return (
      <button
        disabled
        className="px-4 py-2 bg-green-600 text-white rounded-md font-medium flex items-center"
      >
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        Saved!
      </button>
    );
  }

  return (
    <div>
      <button
        onClick={handleSave}
        disabled={isSaving}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
      >
        {isSaving ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Saving...
          </>
        ) : (
          <>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            Save Recipe
          </>
        )}
      </button>

      {error && (
        <p className="text-red-600 text-sm mt-2">{error}</p>
      )}
    </div>
  );
}
