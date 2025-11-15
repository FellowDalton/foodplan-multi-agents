'use client';

import Link from 'next/link';
import type { ShoppingList } from '@/types';

interface ShoppingListCardProps {
  list: ShoppingList;
  onDelete?: (id: string) => void;
}

export default function ShoppingListCard({ list, onDelete }: ShoppingListCardProps) {
  const itemCount = list.items?.length || 0;
  const checkedCount = list.items?.filter(item => item.is_checked).length || 0;
  const completionPercentage = itemCount > 0 ? Math.round((checkedCount / itemCount) * 100) : 0;

  const formattedDate = new Date(list.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <Link href={`/dashboard/shopping-lists/${list.id}`} className="block p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 text-lg">{list.title}</h3>
          {list.is_completed && (
            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
              Completed
            </span>
          )}
        </div>

        <div className="space-y-2">
          {/* Item count */}
          <p className="text-sm text-gray-600">
            {checkedCount} of {itemCount} items checked
          </p>

          {/* Progress bar */}
          {itemCount > 0 && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          )}

          {/* Date and meal plan */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{formattedDate}</span>
            {list.meal_plan && (
              <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded">
                From meal plan
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Delete button */}
      {onDelete && (
        <div className="border-t border-gray-100 px-4 py-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              if (confirm('Are you sure you want to delete this shopping list?')) {
                onDelete(list.id);
              }
            }}
            className="text-sm text-red-600 hover:text-red-700 transition-colors"
          >
            Delete list
          </button>
        </div>
      )}
    </div>
  );
}
