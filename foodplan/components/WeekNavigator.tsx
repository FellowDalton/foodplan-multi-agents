'use client';

interface WeekNavigatorProps {
  currentWeekStart: Date;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  onJumpToToday: () => void;
}

/**
 * Get Monday of the week for a given date
 */
function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  return new Date(d.setDate(diff));
}

/**
 * Get ISO week number
 */
function getWeekNumber(date: Date): number {
  const target = new Date(date.valueOf());
  const dayNumber = (date.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNumber + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
  }
  return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
}

/**
 * Format date range for the week
 */
function formatWeekRange(weekStart: Date): string {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  const startMonth = weekStart.toLocaleDateString('en-US', { month: 'short' });
  const endMonth = weekEnd.toLocaleDateString('en-US', { month: 'short' });
  const startDay = weekStart.getDate();
  const endDay = weekEnd.getDate();
  const year = weekEnd.getFullYear();

  if (startMonth === endMonth) {
    return `${startMonth} ${startDay}-${endDay}, ${year}`;
  } else {
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
  }
}

/**
 * Check if a week is the current week
 */
function isCurrentWeek(weekStart: Date): boolean {
  const today = new Date();
  const currentWeekStart = getMonday(today);
  return weekStart.toDateString() === currentWeekStart.toDateString();
}

export default function WeekNavigator({
  currentWeekStart,
  onPreviousWeek,
  onNextWeek,
  onJumpToToday,
}: WeekNavigatorProps) {
  const weekNumber = getWeekNumber(currentWeekStart);
  const weekRange = formatWeekRange(currentWeekStart);
  const isCurrent = isCurrentWeek(currentWeekStart);

  return (
    <div className="bg-white shadow rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* Week info */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{weekRange}</h2>
          <p className="text-sm text-gray-600">Week {weekNumber}</p>
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center gap-2">
          {/* Previous week */}
          <button
            onClick={onPreviousWeek}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Previous week"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Jump to today (only show if not current week) */}
          {!isCurrent && (
            <button
              onClick={onJumpToToday}
              className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
            >
              Today
            </button>
          )}

          {/* Next week */}
          <button
            onClick={onNextWeek}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Next week"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
