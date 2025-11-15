'use client';

import { useState } from 'react';
import type { MealPlanItem, Recipe, MealType, DayOfWeek } from '@/types';

interface MealSlotProps {
  dayOfWeek: DayOfWeek;
  mealType: MealType;
  item?: MealPlanItem;
  onRemove?: (itemId: string) => void;
  onClick?: () => void;
  isDragging?: boolean;
  isOver?: boolean;
}

/**
 * Get meal type color classes
 */
function getMealTypeColor(mealType: MealType): { bg: string; border: string; text: string } {
  switch (mealType) {
    case 'breakfast':
      return { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700' };
    case 'lunch':
      return { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700' };
    case 'dinner':
      return { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' };
    case 'snack':
      return { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700' };
  }
}

/**
 * Get dietary badge color
 */
function getDietaryBadgeColor(isGlutenFree: boolean, containsNuts: boolean): string {
  if (isGlutenFree && !containsNuts) return 'bg-green-100 text-green-800';
  if (isGlutenFree) return 'bg-yellow-100 text-yellow-800';
  if (!containsNuts) return 'bg-blue-100 text-blue-800';
  return 'bg-gray-100 text-gray-800';
}

export default function MealSlot({
  dayOfWeek,
  mealType,
  item,
  onRemove,
  onClick,
  isDragging = false,
  isOver = false,
}: MealSlotProps) {
  const [showRemoveButton, setShowRemoveButton] = useState(false);
  const colors = getMealTypeColor(mealType);

  const recipe = item?.recipe;
  const hasRecipe = !!recipe;

  // Base classes
  const baseClasses = `
    relative
    min-h-[120px]
    p-3
    rounded-lg
    border-2
    transition-all
    duration-200
    ${isDragging ? 'opacity-50' : 'opacity-100'}
    ${isOver ? 'ring-2 ring-blue-400 ring-offset-2' : ''}
  `;

  if (hasRecipe) {
    return (
      <div
        className={`${baseClasses} ${colors.bg} ${colors.border} cursor-pointer hover:shadow-md`}
        onClick={onClick}
        onMouseEnter={() => setShowRemoveButton(true)}
        onMouseLeave={() => setShowRemoveButton(false)}
      >
        {/* Remove button */}
        {showRemoveButton && onRemove && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove(item.id);
            }}
            className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-red-50 hover:text-red-600 transition-colors z-10"
            aria-label="Remove meal"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Recipe content */}
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-900 text-sm leading-tight pr-6">
            {recipe!.title}
          </h4>

          {/* Dietary badges */}
          <div className="flex flex-wrap gap-1">
            {recipe!.is_gluten_free && (
              <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded">
                GF
              </span>
            )}
            {recipe!.contains_nuts && (
              <span className="px-2 py-0.5 text-xs font-medium bg-orange-100 text-orange-800 rounded">
                Nuts
              </span>
            )}
            {recipe!.saturated_fat_level === 'low' && (
              <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                Low Fat
              </span>
            )}
          </div>

          {/* Cooking time */}
          {recipe!.cook_time_minutes && (
            <p className="text-xs text-gray-600">
              {recipe!.cook_time_minutes} min
            </p>
          )}

          {/* Custom notes */}
          {item.custom_notes && (
            <p className="text-xs text-gray-600 italic mt-2">
              {item.custom_notes}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Empty slot
  return (
    <div
      className={`${baseClasses} ${colors.border} border-dashed bg-white cursor-pointer hover:${colors.bg} hover:border-solid`}
      onClick={onClick}
    >
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <svg
            className={`w-8 h-8 ${colors.text} mx-auto mb-2 opacity-40`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <p className={`text-xs ${colors.text} opacity-60`}>
            Add meal
          </p>
        </div>
      </div>
    </div>
  );
}
