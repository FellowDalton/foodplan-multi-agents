'use client';

import { DealWithStore } from '@/types';

interface DealCardProps {
  deal: DealWithStore;
  showBestDeal?: boolean;
}

// Store color schemes
const storeColors = {
  netto: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-400',
    text: 'text-yellow-900',
    badge: 'bg-yellow-500 text-white',
  },
  rema: {
    bg: 'bg-blue-50',
    border: 'border-blue-400',
    text: 'text-blue-900',
    badge: 'bg-blue-500 text-white',
  },
  meny: {
    bg: 'bg-red-50',
    border: 'border-red-400',
    text: 'text-red-900',
    badge: 'bg-red-500 text-white',
  },
};

// Category colors
const categoryColors: Record<string, string> = {
  'Meat & Poultry': 'bg-pink-100 text-pink-800',
  'Dairy & Eggs': 'bg-blue-100 text-blue-800',
  'Fruits & Vegetables': 'bg-green-100 text-green-800',
  'Bread & Bakery': 'bg-amber-100 text-amber-800',
  'Seafood': 'bg-cyan-100 text-cyan-800',
  'Sweets & Snacks': 'bg-purple-100 text-purple-800',
  'Beverages': 'bg-indigo-100 text-indigo-800',
  'Coffee & Tea': 'bg-orange-100 text-orange-800',
  'Pantry & Condiments': 'bg-yellow-100 text-yellow-800',
  'Spreads & Butter': 'bg-lime-100 text-lime-800',
  'Deli & Cold Cuts': 'bg-rose-100 text-rose-800',
  'Pasta & International': 'bg-emerald-100 text-emerald-800',
  'Plant-Based': 'bg-teal-100 text-teal-800',
  'Special Offers': 'bg-fuchsia-100 text-fuchsia-800',
};

/**
 * Format price in Danish Kroner
 */
function formatPrice(price: number): string {
  return price.toFixed(2).replace('.', ',') + ' kr';
}

/**
 * Format price per unit
 */
function formatPricePerUnit(pricePerUnit: number, unitType: string): string {
  const price = pricePerUnit.toFixed(2).replace('.', ',');
  return `${price} kr/${unitType}`;
}

export default function DealCard({ deal, showBestDeal = false }: DealCardProps) {
  const storeColor = storeColors[deal.store_slug];
  const categoryColor = categoryColors[deal.category] || 'bg-gray-100 text-gray-800';

  return (
    <div
      className={`relative bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200 border-2 ${storeColor.border} overflow-hidden`}
    >
      {/* Best Deal Badge */}
      {showBestDeal && (
        <div className="absolute top-2 left-2 z-10">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-500 text-white">
            Best Deal
          </span>
        </div>
      )}

      {/* Store Badge */}
      <div className="absolute top-2 right-2 z-10">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${storeColor.badge}`}>
          {deal.store_name}
        </span>
      </div>

      <div className="p-4 pt-10">
        {/* Product Name */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]">
          {deal.normalized_name}
        </h3>

        {/* Category Badge */}
        <div className="mb-3">
          <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${categoryColor}`}>
            {deal.category}
          </span>
        </div>

        {/* Price Section */}
        <div className="mb-3">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-3xl font-bold text-gray-900">
                {formatPrice(deal.price)}
              </span>
              {deal.is_app_price && (
                <span className="ml-2 inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-orange-100 text-orange-800">
                  App Price
                </span>
              )}
            </div>
          </div>

          {/* Quantity and Price per Unit */}
          <div className="mt-1 text-sm text-gray-600">
            <div>{deal.quantity}</div>
            <div className="font-medium text-gray-700">
              {formatPricePerUnit(deal.price_per_unit, deal.unit_type)}
            </div>
          </div>
        </div>

        {/* Add to List Button */}
        <button
          className={`w-full py-2 px-4 rounded-md text-sm font-medium text-white transition-colors ${storeColor.badge} hover:opacity-90`}
          onClick={() => {
            // TODO: Implement add to shopping list functionality
            console.log('Add to list:', deal);
          }}
        >
          Add to Shopping List
        </button>
      </div>
    </div>
  );
}
