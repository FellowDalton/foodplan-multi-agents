'use client';

import { useState, useMemo } from 'react';
import type { Recipe, MealType } from '@/types';

interface RecipeLibraryProps {
  recipes: Recipe[];
  onRecipeSelect?: (recipe: Recipe) => void;
}

type FilterType = 'all' | 'gluten-free' | 'nut-free' | 'low-fat';

export default function RecipeLibrary({ recipes, onRecipeSelect }: RecipeLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  // Filter and search recipes
  const filteredRecipes = useMemo(() => {
    let filtered = recipes;

    // Apply dietary filter
    if (filter === 'gluten-free') {
      filtered = filtered.filter((r) => r.is_gluten_free);
    } else if (filter === 'nut-free') {
      filtered = filtered.filter((r) => !r.contains_nuts);
    } else if (filter === 'low-fat') {
      filtered = filtered.filter((r) => r.saturated_fat_level === 'low');
    }

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.title.toLowerCase().includes(query) ||
          r.description?.toLowerCase().includes(query) ||
          r.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [recipes, filter, searchQuery]);

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Recipe Library</h2>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search recipes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 text-sm rounded-full transition-colors ${
            filter === 'all'
              ? 'bg-blue-100 text-blue-700 font-medium'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('gluten-free')}
          className={`px-3 py-1 text-sm rounded-full transition-colors ${
            filter === 'gluten-free'
              ? 'bg-green-100 text-green-700 font-medium'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Gluten-Free
        </button>
        <button
          onClick={() => setFilter('nut-free')}
          className={`px-3 py-1 text-sm rounded-full transition-colors ${
            filter === 'nut-free'
              ? 'bg-orange-100 text-orange-700 font-medium'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Nut-Free
        </button>
        <button
          onClick={() => setFilter('low-fat')}
          className={`px-3 py-1 text-sm rounded-full transition-colors ${
            filter === 'low-fat'
              ? 'bg-purple-100 text-purple-700 font-medium'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Low Fat
        </button>
      </div>

      {/* Recipe count */}
      <p className="text-sm text-gray-600 mb-3">
        {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''}
      </p>

      {/* Recipe list */}
      <div className="space-y-2 max-h-[600px] overflow-y-auto">
        {filteredRecipes.length === 0 ? (
          <div className="text-center py-8">
            <svg
              className="w-12 h-12 text-gray-400 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <p className="text-sm text-gray-600">No recipes found</p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-2 text-sm text-blue-600 hover:text-blue-700"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          filteredRecipes.map((recipe) => (
            <div
              key={recipe.id}
              onClick={() => onRecipeSelect?.(recipe)}
              className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 cursor-pointer transition-all"
            >
              <h3 className="font-medium text-gray-900 text-sm mb-1">
                {recipe.title}
              </h3>

              {/* Dietary badges */}
              <div className="flex flex-wrap gap-1 mb-2">
                {recipe.is_gluten_free && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded">
                    GF
                  </span>
                )}
                {recipe.contains_nuts && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-orange-100 text-orange-800 rounded">
                    Nuts
                  </span>
                )}
                {recipe.saturated_fat_level === 'low' && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                    Low Fat
                  </span>
                )}
              </div>

              {/* Recipe meta */}
              <div className="flex items-center gap-3 text-xs text-gray-600">
                {recipe.cook_time_minutes && (
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {recipe.cook_time_minutes} min
                  </span>
                )}
                {recipe.servings && (
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {recipe.servings}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
