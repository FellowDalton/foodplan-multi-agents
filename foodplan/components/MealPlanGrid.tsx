'use client';

import MealSlot from './MealSlot';
import type { MealPlanItem, MealType, DayOfWeek } from '@/types';

interface MealPlanGridProps {
  items: MealPlanItem[];
  onSlotClick: (dayOfWeek: DayOfWeek, mealType: MealType, item?: MealPlanItem) => void;
  onRemoveItem: (itemId: string) => void;
  isToday?: (dayOfWeek: DayOfWeek) => boolean;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;
const MEAL_TYPES: MealType[] = ['breakfast', 'lunch', 'dinner'];

/**
 * Find item for a specific day and meal type
 */
function findItem(
  items: MealPlanItem[],
  dayOfWeek: DayOfWeek,
  mealType: MealType
): MealPlanItem | undefined {
  return items.find(
    (item) => item.day_of_week === dayOfWeek && item.meal_type === mealType
  );
}

export default function MealPlanGrid({
  items,
  onSlotClick,
  onRemoveItem,
  isToday,
}: MealPlanGridProps) {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      {/* Desktop view: table layout */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="w-32 p-3 text-left text-sm font-semibold text-gray-900 border-b border-r">
                Meal
              </th>
              {DAYS.map((day, index) => {
                const dayOfWeek = index as DayOfWeek;
                const isTodayColumn = isToday?.(dayOfWeek);
                return (
                  <th
                    key={day}
                    className={`p-3 text-center text-sm font-semibold border-b ${
                      isTodayColumn ? 'bg-blue-50 text-blue-900' : 'text-gray-900'
                    }`}
                  >
                    {day}
                    {isTodayColumn && (
                      <span className="ml-1 inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {MEAL_TYPES.map((mealType) => (
              <tr key={mealType} className="border-b last:border-b-0">
                <th className="p-3 text-left text-sm font-medium text-gray-700 bg-gray-50 border-r capitalize">
                  {mealType}
                </th>
                {DAYS.map((_, dayIndex) => {
                  const dayOfWeek = dayIndex as DayOfWeek;
                  const item = findItem(items, dayOfWeek, mealType);
                  const isTodayColumn = isToday?.(dayOfWeek);

                  return (
                    <td
                      key={dayIndex}
                      className={`p-2 ${isTodayColumn ? 'bg-blue-50/30' : ''}`}
                    >
                      <MealSlot
                        dayOfWeek={dayOfWeek}
                        mealType={mealType}
                        item={item}
                        onClick={() => onSlotClick(dayOfWeek, mealType, item)}
                        onRemove={onRemoveItem}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile view: stacked by day */}
      <div className="md:hidden">
        {DAYS.map((day, dayIndex) => {
          const dayOfWeek = dayIndex as DayOfWeek;
          const isTodaySection = isToday?.(dayOfWeek);

          return (
            <div key={day} className="border-b last:border-b-0">
              <div
                className={`p-4 font-semibold ${
                  isTodaySection ? 'bg-blue-50 text-blue-900' : 'bg-gray-50 text-gray-900'
                }`}
              >
                {day}
                {isTodaySection && (
                  <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                )}
              </div>
              <div className="p-4 space-y-3">
                {MEAL_TYPES.map((mealType) => {
                  const item = findItem(items, dayOfWeek, mealType);
                  return (
                    <div key={mealType}>
                      <p className="text-xs font-medium text-gray-600 uppercase mb-1">
                        {mealType}
                      </p>
                      <MealSlot
                        dayOfWeek={dayOfWeek}
                        mealType={mealType}
                        item={item}
                        onClick={() => onSlotClick(dayOfWeek, mealType, item)}
                        onRemove={onRemoveItem}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
