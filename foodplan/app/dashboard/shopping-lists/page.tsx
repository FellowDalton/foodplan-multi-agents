'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ShoppingListCard from '@/components/ShoppingListCard';
import GenerateListButton from '@/components/GenerateListButton';
import type { ShoppingList } from '@/types';

export default function ShoppingListsPage() {
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const [mealPlans, setMealPlans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [filterCompleted, setFilterCompleted] = useState<boolean | null>(null);
  const router = useRouter();

  // Fetch shopping lists and meal plans
  useEffect(() => {
    fetchData();
  }, [filterCompleted]);

  const fetchData = async () => {
    setIsLoading(true);

    try {
      // Fetch shopping lists
      const url = filterCompleted !== null
        ? `/api/shopping-lists?is_completed=${filterCompleted}`
        : '/api/shopping-lists';

      const listsResponse = await fetch(url);
      if (listsResponse.ok) {
        const listsData = await listsResponse.json();
        setShoppingLists(listsData.shoppingLists || []);
      }

      // Fetch meal plans for generation
      const plansResponse = await fetch('/api/meal-plans');
      if (plansResponse.ok) {
        const plansData = await plansResponse.json();
        setMealPlans(plansData.mealPlans || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateList = async () => {
    setIsCreating(true);

    try {
      const response = await fetch('/api/shopping-lists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `Shopping List - ${new Date().toLocaleDateString()}`,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create shopping list');
      }

      const data = await response.json();

      // Redirect to new list
      router.push(`/dashboard/shopping-lists/${data.shoppingList.id}`);
    } catch (error) {
      console.error('Error creating shopping list:', error);
      alert('Failed to create shopping list. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteList = async (id: string) => {
    try {
      const response = await fetch(`/api/shopping-lists/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete shopping list');
      }

      // Refresh list
      fetchData();
    } catch (error) {
      console.error('Error deleting shopping list:', error);
      alert('Failed to delete shopping list. Please try again.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Lists</h1>
        <p className="text-gray-600">Manage your shopping lists and generate them from meal plans</p>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={handleCreateList}
          disabled={isCreating}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {isCreating ? 'Creating...' : 'Create New List'}
        </button>

        <GenerateListButton mealPlans={mealPlans} />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilterCompleted(null)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filterCompleted === null
              ? 'bg-blue-100 text-blue-700'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          All Lists
        </button>

        <button
          onClick={() => setFilterCompleted(false)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filterCompleted === false
              ? 'bg-blue-100 text-blue-700'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          Active
        </button>

        <button
          onClick={() => setFilterCompleted(true)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filterCompleted === true
              ? 'bg-blue-100 text-blue-700'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          Completed
        </button>
      </div>

      {/* Shopping lists grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading shopping lists...</p>
        </div>
      ) : shoppingLists.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {shoppingLists.map((list) => (
            <ShoppingListCard
              key={list.id}
              list={list}
              onDelete={handleDeleteList}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
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
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No shopping lists yet</h3>
          <p className="text-gray-600 mb-4">
            {filterCompleted === null
              ? 'Create a new shopping list or generate one from your meal plan'
              : filterCompleted
              ? 'No completed shopping lists'
              : 'No active shopping lists'}
          </p>
          {filterCompleted === null && (
            <button
              onClick={handleCreateList}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Your First List
            </button>
          )}
        </div>
      )}
    </div>
  );
}
