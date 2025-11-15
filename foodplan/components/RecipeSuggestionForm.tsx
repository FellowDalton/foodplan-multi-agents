'use client';

import { useState } from 'react';
import type { RecipeSuggestionRequest, MealType, CuisineType } from '@/types';

interface RecipeSuggestionFormProps {
  familyId: string;
  onSubmit: (request: RecipeSuggestionRequest) => void;
  isLoading: boolean;
}

export default function RecipeSuggestionForm({
  familyId,
  onSubmit,
  isLoading,
}: RecipeSuggestionFormProps) {
  const [mealType, setMealType] = useState<MealType>('dinner');
  const [cuisine, setCuisine] = useState<CuisineType>('any');
  const [maxCookingTime, setMaxCookingTime] = useState<number>(60);
  const [numRecipes, setNumRecipes] = useState<number>(3);
  const [useDeals, setUseDeals] = useState<boolean>(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const request: RecipeSuggestionRequest = {
      family_id: familyId,
      meal_type: mealType,
      cuisine,
      max_cooking_time: maxCookingTime,
      num_recipes: numRecipes,
      use_deals: useDeals,
    };

    onSubmit(request);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      <div>
        <h2 className="text-2xl font-bold mb-4">Recipe Preferences</h2>
        <p className="text-gray-600 mb-6">
          Tell us what you're looking for, and we'll suggest recipes that match your family's dietary restrictions.
        </p>
      </div>

      {/* Meal Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Meal Type
        </label>
        <select
          value={mealType}
          onChange={(e) => setMealType(e.target.value as MealType)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={isLoading}
        >
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
          <option value="snack">Snack</option>
        </select>
      </div>

      {/* Cuisine */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cuisine Type
        </label>
        <select
          value={cuisine}
          onChange={(e) => setCuisine(e.target.value as CuisineType)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={isLoading}
        >
          <option value="any">Any Cuisine</option>
          <option value="danish">Danish</option>
          <option value="italian">Italian</option>
          <option value="asian">Asian</option>
          <option value="mexican">Mexican</option>
          <option value="indian">Indian</option>
          <option value="mediterranean">Mediterranean</option>
          <option value="american">American</option>
          <option value="french">French</option>
        </select>
      </div>

      {/* Max Cooking Time */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Max Cooking Time: {maxCookingTime} minutes
        </label>
        <input
          type="range"
          min="15"
          max="120"
          step="15"
          value={maxCookingTime}
          onChange={(e) => setMaxCookingTime(Number(e.target.value))}
          className="w-full"
          disabled={isLoading}
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>15 min</span>
          <span>60 min</span>
          <span>120 min</span>
        </div>
      </div>

      {/* Number of Recipes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Number of Recipes
        </label>
        <select
          value={numRecipes}
          onChange={(e) => setNumRecipes(Number(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={isLoading}
        >
          <option value="1">1 recipe</option>
          <option value="2">2 recipes</option>
          <option value="3">3 recipes</option>
          <option value="4">4 recipes</option>
          <option value="5">5 recipes</option>
        </select>
      </div>

      {/* Use Deals */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="use-deals"
          checked={useDeals}
          onChange={(e) => setUseDeals(e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          disabled={isLoading}
        />
        <label htmlFor="use-deals" className="ml-2 block text-sm text-gray-900">
          Use current deals from supermarkets (save money!)
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating Recipes...
          </span>
        ) : (
          'Generate Recipes'
        )}
      </button>

      {isLoading && (
        <p className="text-sm text-gray-600 text-center">
          This may take 10-20 seconds. Claude is analyzing your family's dietary restrictions and creating safe, delicious recipes...
        </p>
      )}
    </form>
  );
}
