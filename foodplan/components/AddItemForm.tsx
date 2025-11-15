'use client';

import { useState } from 'react';
import type { StorePreference } from '@/types';

interface AddItemFormProps {
  onAdd: (item: {
    name: string;
    quantity?: string;
    unit?: string;
    store_preference?: StorePreference;
  }) => Promise<void>;
}

/**
 * Quick add form for shopping list items
 * Google Keep style: simple, always visible at top
 */
export default function AddItemForm({ onAdd }: AddItemFormProps) {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [storePreference, setStorePreference] = useState<StorePreference>('any');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return;

    setIsSubmitting(true);

    try {
      await onAdd({
        name: name.trim(),
        quantity: quantity.trim() || undefined,
        unit: unit.trim() || undefined,
        store_preference: storePreference !== 'any' ? storePreference : undefined,
      });

      // Clear form
      setName('');
      setQuantity('');
      setUnit('');
      setStorePreference('any');
      setIsExpanded(false);
    } catch (error) {
      console.error('Error adding item:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      {/* Main input - always visible */}
      <div className="flex gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onFocus={() => setIsExpanded(true)}
          placeholder="Add item..."
          className="flex-grow px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isSubmitting}
        />

        {!isExpanded && (
          <button
            type="submit"
            disabled={!name.trim() || isSubmitting}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Add
          </button>
        )}
      </div>

      {/* Expanded options */}
      {isExpanded && (
        <div className="mt-3 space-y-3">
          {/* Quantity and unit */}
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Quantity (e.g., 2, 500)"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              disabled={isSubmitting}
            />

            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              disabled={isSubmitting}
            >
              <option value="">Unit</option>
              <option value="stk">stk (pieces)</option>
              <option value="g">g (grams)</option>
              <option value="kg">kg (kilograms)</option>
              <option value="ml">ml (milliliters)</option>
              <option value="l">l (liters)</option>
              <option value="tbsp">tbsp (tablespoon)</option>
              <option value="tsp">tsp (teaspoon)</option>
              <option value="cup">cup</option>
            </select>
          </div>

          {/* Store preference */}
          <select
            value={storePreference}
            onChange={(e) => setStorePreference(e.target.value as StorePreference)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            disabled={isSubmitting}
          >
            <option value="any">Any store</option>
            <option value="netto">Netto</option>
            <option value="rema">Rema 1000</option>
            <option value="meny">Meny</option>
          </select>

          {/* Action buttons */}
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => {
                setIsExpanded(false);
                setQuantity('');
                setUnit('');
                setStorePreference('any');
              }}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium"
              disabled={isSubmitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!name.trim() || isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
            >
              {isSubmitting ? 'Adding...' : 'Add Item'}
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
