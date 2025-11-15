'use client';

import { useState } from 'react';
import type { RecipeSuggestion } from '@/types';
import SaveRecipeButton from './SaveRecipeButton';

interface RecipeCardProps {
  recipe: RecipeSuggestion;
  familyId: string;
  onSaved?: () => void;
}

export default function RecipeCard({ recipe, familyId, onSaved }: RecipeCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const totalTime = recipe.prep_time_minutes + recipe.cook_time_minutes;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-2xl font-bold text-gray-900 flex-1">
            {recipe.title}
          </h3>
          <SaveRecipeButton recipe={recipe} familyId={familyId} onSaved={onSaved} />
        </div>

        <p className="text-gray-600 mb-4">{recipe.description}</p>

        {/* Dietary Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {recipe.dietary_tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Recipe Metadata */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
          <div>
            <span className="text-gray-500">Prep Time:</span>
            <p className="font-semibold">{recipe.prep_time_minutes} min</p>
          </div>
          <div>
            <span className="text-gray-500">Cook Time:</span>
            <p className="font-semibold">{recipe.cook_time_minutes} min</p>
          </div>
          <div>
            <span className="text-gray-500">Total Time:</span>
            <p className="font-semibold">{totalTime} min</p>
          </div>
          <div>
            <span className="text-gray-500">Servings:</span>
            <p className="font-semibold">{recipe.servings}</p>
          </div>
        </div>

        {/* Estimated Cost (if available) */}
        {recipe.estimated_cost && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
            <p className="text-sm text-blue-900">
              <span className="font-semibold">Estimated Cost:</span> {recipe.estimated_cost} kr
              {recipe.on_sale_ingredients && recipe.on_sale_ingredients.length > 0 && (
                <span className="ml-2 text-blue-700">
                  (using {recipe.on_sale_ingredients.length} sale item{recipe.on_sale_ingredients.length > 1 ? 's' : ''})
                </span>
              )}
            </p>
          </div>
        )}

        {/* Toggle Details Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
        >
          {isExpanded ? (
            <>
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
              Hide Details
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              Show Details
            </>
          )}
        </button>
      </div>

      {/* Expandable Details */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          {/* Ingredients */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-3 text-gray-900">Ingredients</h4>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient, index) => {
                const isOnSale = recipe.on_sale_ingredients?.some(
                  saleItem => ingredient.name.toLowerCase().includes(saleItem.toLowerCase())
                );

                return (
                  <li
                    key={index}
                    className={`flex items-start ${isOnSale ? 'bg-yellow-50 border-l-4 border-yellow-400 pl-3 py-1' : ''}`}
                  >
                    <span className="text-gray-700">
                      <span className="font-medium">{ingredient.quantity} {ingredient.unit}</span>
                      {' '}
                      {ingredient.name}
                      {isOnSale && (
                        <span className="ml-2 text-xs text-yellow-700 font-semibold">ON SALE</span>
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Instructions */}
          <div>
            <h4 className="text-lg font-semibold mb-3 text-gray-900">Instructions</h4>
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-line text-gray-700">
                {recipe.instructions}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
