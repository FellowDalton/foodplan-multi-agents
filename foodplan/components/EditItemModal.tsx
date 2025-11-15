'use client';

import { useState, useEffect } from 'react';
import type { ShoppingListItem, StorePreference } from '@/types';

interface EditItemModalProps {
  item: ShoppingListItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (itemId: string, updates: {
    name?: string;
    quantity?: string;
    unit?: string;
    store_preference?: StorePreference;
    notes?: string;
  }) => Promise<void>;
}

export default function EditItemModal({ item, isOpen, onClose, onSave }: EditItemModalProps) {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [storePreference, setStorePreference] = useState<StorePreference>('any');
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Update form when item changes
  useEffect(() => {
    if (item) {
      setName(item.name);
      setQuantity(item.quantity || '');
      setUnit(item.unit || '');
      setStorePreference(item.store_preference || 'any');
      setNotes(item.notes || '');
    }
  }, [item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!item || !name.trim()) return;

    setIsSaving(true);

    try {
      await onSave(item.id, {
        name: name.trim(),
        quantity: quantity.trim() || undefined,
        unit: unit.trim() || undefined,
        store_preference: storePreference !== 'any' ? storePreference : undefined,
        notes: notes.trim() || undefined,
      });

      onClose();
    } catch (error) {
      console.error('Error saving item:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Edit Item</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Item name *
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isSaving}
              required
            />
          </div>

          {/* Quantity and unit */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <input
                type="text"
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g., 2, 500"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isSaving}
              />
            </div>

            <div>
              <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
                Unit
              </label>
              <select
                id="unit"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isSaving}
              >
                <option value="">Select</option>
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
          </div>

          {/* Store preference */}
          <div>
            <label htmlFor="store" className="block text-sm font-medium text-gray-700 mb-1">
              Store preference
            </label>
            <select
              id="store"
              value={storePreference}
              onChange={(e) => setStorePreference(e.target.value as StorePreference)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isSaving}
            >
              <option value="any">Any store</option>
              <option value="netto">Netto</option>
              <option value="rema">Rema 1000</option>
              <option value="meny">Meny</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Add any additional notes..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              disabled={isSaving}
            />
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
              disabled={isSaving}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!name.trim() || isSaving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
