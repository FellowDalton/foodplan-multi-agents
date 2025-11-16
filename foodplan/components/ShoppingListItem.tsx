'use client';

import { useState } from 'react';
import type { ShoppingListItem as ShoppingListItemType } from '@/types';

interface ShoppingListItemProps {
  item: ShoppingListItemType;
  onToggle: (itemId: string, isChecked: boolean) => void;
  onEdit: (item: ShoppingListItemType) => void;
  onDelete: (itemId: string) => void;
}

/**
 * Google Keep-style shopping list item
 * - Large checkbox
 * - Tap anywhere to toggle
 * - Strikethrough when checked
 * - Edit/delete on hover (desktop) or always visible (mobile)
 */
export default function ShoppingListItem({
  item,
  onToggle,
  onEdit,
  onDelete
}: ShoppingListItemProps) {
  const [showActions, setShowActions] = useState(false);

  const handleToggle = () => {
    onToggle(item.id, !item.is_checked);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(item);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this item?')) {
      onDelete(item.id);
    }
  };

  return (
    <div
      className={`
        group
        flex items-center gap-3 p-3 rounded-lg
        transition-all duration-200
        cursor-pointer
        hover:bg-gray-50
        ${item.is_checked ? 'opacity-60' : 'opacity-100'}
      `}
      onClick={handleToggle}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Large checkbox */}
      <div className="flex-shrink-0">
        <div
          className={`
            w-6 h-6 rounded-md border-2 flex items-center justify-center
            transition-all duration-200
            ${item.is_checked
              ? 'bg-blue-600 border-blue-600'
              : 'border-gray-300 hover:border-blue-400'
            }
          `}
        >
          {item.is_checked && (
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>
      </div>

      {/* Item content */}
      <div className="flex-grow min-w-0">
        <div className="flex items-baseline gap-2">
          <span
            className={`
              font-medium text-gray-900
              ${item.is_checked ? 'line-through' : ''}
            `}
          >
            {item.name}
          </span>

          {/* Quantity and unit */}
          {(item.quantity || item.unit) && (
            <span className="text-sm text-gray-600 whitespace-nowrap">
              {item.quantity} {item.unit}
            </span>
          )}
        </div>

        {/* Badges row */}
        <div className="flex flex-wrap gap-1.5 mt-1">
          {/* Store preference */}
          {item.store_preference && item.store_preference !== 'any' && (
            <span className="px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-800 rounded">
              {item.store_preference.charAt(0).toUpperCase() + item.store_preference.slice(1)}
            </span>
          )}

          {/* Category */}
          {item.category && (
            <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 rounded">
              {item.category.name}
            </span>
          )}

          {/* Deal indicator */}
          {item.deal && (
            <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              {item.deal.price} kr
            </span>
          )}

          {/* Estimated price */}
          {item.estimated_price && !item.deal && (
            <span className="px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-700 rounded">
              ~{item.estimated_price} kr
            </span>
          )}
        </div>

        {/* Notes */}
        {item.notes && (
          <p className="text-xs text-gray-500 italic mt-1">{item.notes}</p>
        )}
      </div>

      {/* Action buttons (show on hover or mobile) */}
      <div
        className={`
          flex items-center gap-1 flex-shrink-0
          transition-opacity duration-200
          ${showActions ? 'opacity-100' : 'opacity-0 md:opacity-0'}
          sm:opacity-100
        `}
      >
        {/* Edit button */}
        <button
          onClick={handleEdit}
          className="p-2 rounded-md hover:bg-gray-200 text-gray-600 hover:text-blue-600 transition-colors"
          aria-label="Edit item"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>

        {/* Delete button */}
        <button
          onClick={handleDelete}
          className="p-2 rounded-md hover:bg-gray-200 text-gray-600 hover:text-red-600 transition-colors"
          aria-label="Delete item"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}
