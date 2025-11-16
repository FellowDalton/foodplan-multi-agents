'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface MealPlan {
  id: string;
  week_start_date: string;
  week_number: number;
  year: number;
}

interface GenerateListButtonProps {
  mealPlans: MealPlan[];
}

export default function GenerateListButton({ mealPlans }: GenerateListButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMealPlanId, setSelectedMealPlanId] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleGenerate = async () => {
    if (!selectedMealPlanId) {
      setError('Please select a meal plan');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const response = await fetch('/api/shopping-lists/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          meal_plan_id: selectedMealPlanId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to generate shopping list');
      }

      const data = await response.json();

      // Redirect to the new shopping list
      router.push(`/dashboard/shopping-lists/${data.shoppingList.id}`);
    } catch (err) {
      console.error('Error generating shopping list:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate shopping list');
    } finally {
      setIsGenerating(false);
    }
  };

  if (mealPlans.length === 0) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
        Generate from Meal Plan
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Generate Shopping List</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                aria-label="Close"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              <p className="text-sm text-gray-600">
                Select a meal plan to automatically create a shopping list with all the ingredients you'll need.
              </p>

              {/* Meal plan selector */}
              <div>
                <label htmlFor="mealPlan" className="block text-sm font-medium text-gray-700 mb-2">
                  Select meal plan
                </label>
                <select
                  id="mealPlan"
                  value={selectedMealPlanId}
                  onChange={(e) => {
                    setSelectedMealPlanId(e.target.value);
                    setError('');
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isGenerating}
                >
                  <option value="">Choose a week...</option>
                  {mealPlans.map((plan) => {
                    const date = new Date(plan.week_start_date);
                    const formattedDate = date.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    });
                    return (
                      <option key={plan.id} value={plan.id}>
                        Week {plan.week_number}, {plan.year} ({formattedDate})
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Error message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Info */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-700">
                  This will combine all ingredients from your meal plan recipes and create a smart shopping list with aggregated quantities.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 justify-end p-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                disabled={isGenerating}
              >
                Cancel
              </button>

              <button
                onClick={handleGenerate}
                disabled={!selectedMealPlanId || isGenerating}
                className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isGenerating ? 'Generating...' : 'Generate List'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
