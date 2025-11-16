'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import RecipeSuggestionForm from '@/components/RecipeSuggestionForm';
import RecipeCard from '@/components/RecipeCard';
import type {
  RecipeSuggestionRequest,
  RecipeSuggestionsResponse,
  RecipeSuggestion,
} from '@/types';

export default function RecipeSuggestPage() {
  const router = useRouter();
  const [familyId, setFamilyId] = useState<string | null>(null);
  const [isLoadingFamily, setIsLoadingFamily] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [recipes, setRecipes] = useState<RecipeSuggestion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [familyRestrictions, setFamilyRestrictions] = useState<any>(null);

  // Fetch family ID on mount
  useEffect(() => {
    async function fetchFamily() {
      try {
        const response = await fetch('/api/family');

        if (!response.ok) {
          throw new Error('Failed to fetch family');
        }

        const data = await response.json();

        if (data.family) {
          setFamilyId(data.family.id);
        } else {
          setError('Please create a family first before generating recipes.');
        }
      } catch (err) {
        console.error('Error fetching family:', err);
        setError('Failed to load family information.');
      } finally {
        setIsLoadingFamily(false);
      }
    }

    fetchFamily();
  }, []);

  const handleGenerateRecipes = async (request: RecipeSuggestionRequest) => {
    setIsGenerating(true);
    setError(null);
    setRecipes([]);

    try {
      const response = await fetch('/api/recipes/suggest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const data: RecipeSuggestionsResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate recipes');
      }

      if (data.data) {
        setRecipes(data.data.recipes);
        setFamilyRestrictions(data.data.family_restrictions);
      }
    } catch (err) {
      console.error('Error generating recipes:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate recipes');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRecipeSaved = () => {
    // Could add a toast notification here
    console.log('Recipe saved successfully!');
  };

  if (isLoadingFamily) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!familyId) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-yellow-900 mb-2">Family Setup Required</h2>
          <p className="text-yellow-800 mb-4">
            {error || 'You need to create a family and add family members before generating recipes.'}
          </p>
          <button
            onClick={() => router.push('/dashboard/setup')}
            className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded"
          >
            Go to Family Setup
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          AI Recipe Suggestions
        </h1>
        <p className="text-gray-600">
          Get personalized recipe suggestions that match your family's dietary restrictions and use ingredients on sale.
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-1">
          <RecipeSuggestionForm
            familyId={familyId}
            onSubmit={handleGenerateRecipes}
            isLoading={isGenerating}
          />

          {/* Family Restrictions Info */}
          {familyRestrictions && (
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">
                Family Dietary Restrictions
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>
                  {familyRestrictions.gluten_free_count} / {familyRestrictions.total_members} members need gluten-free
                </li>
                {familyRestrictions.nut_allergies > 0 && (
                  <li>
                    {familyRestrictions.nut_allergies} member(s) with nut allergies
                    {familyRestrictions.can_eat_almonds && ' (almonds OK)'}
                  </li>
                )}
                {familyRestrictions.avoid_saturated_fat && (
                  <li>Avoiding saturated fat</li>
                )}
                {familyRestrictions.avoid_potatoes && (
                  <li>
                    No potatoes{familyRestrictions.can_eat_sweet_potatoes && ' (sweet potatoes OK)'}
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Results Column */}
        <div className="lg:col-span-2">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-red-900 mb-1">Error</h3>
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Empty State */}
          {!isGenerating && recipes.length === 0 && !error && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
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
              <h3 className="mt-2 text-sm font-medium text-gray-900">No recipes yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Fill out the form and click "Generate Recipes" to get started.
              </p>
            </div>
          )}

          {/* Loading State */}
          {isGenerating && (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Generating Recipes...
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Claude is analyzing your family's dietary restrictions, checking current deals,
                and creating delicious, safe recipes just for you. This may take 10-20 seconds.
              </p>
            </div>
          )}

          {/* Recipe Results */}
          {recipes.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {recipes.length} Recipe{recipes.length > 1 ? 's' : ''} Generated
                </h2>
                <button
                  onClick={() => router.push('/dashboard/recipes')}
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  View Saved Recipes →
                </button>
              </div>

              {recipes.map((recipe, index) => (
                <RecipeCard
                  key={index}
                  recipe={recipe}
                  familyId={familyId}
                  onSaved={handleRecipeSaved}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
