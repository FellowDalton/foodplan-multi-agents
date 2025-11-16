'use client';

import { useState, useEffect, useCallback } from 'react';
import DealCard from '@/components/DealCard';
import DealsFilter, { FilterState } from '@/components/DealsFilter';
import StoreTab from '@/components/StoreTab';
import { DealWithStore, DealsAPIResponse } from '@/types';

export default function DealsPage() {
  const [deals, setDeals] = useState<DealWithStore[]>([]);
  const [allDeals, setAllDeals] = useState<DealWithStore[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [latestDate, setLatestDate] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeStore, setActiveStore] = useState<'all' | 'netto' | 'rema' | 'meny'>('all');
  const [filters, setFilters] = useState<FilterState>({
    store: 'all',
    category: '',
    search: '',
    sortBy: 'price',
    sortOrder: 'asc',
  });

  // Fetch deals from API
  const fetchDeals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query params
      const params = new URLSearchParams();
      if (filters.store !== 'all') {
        params.append('store', filters.store);
      }
      if (filters.category) {
        params.append('category', filters.category);
      }
      if (filters.search) {
        params.append('search', filters.search);
      }
      params.append('sortBy', filters.sortBy);
      params.append('sortOrder', filters.sortOrder);

      const response = await fetch(`/api/deals?${params.toString()}`);
      const data: DealsAPIResponse = await response.json();

      if (data.success && data.data) {
        setDeals(data.data.deals);
        setAllDeals(data.data.deals);
        setCategories(data.data.categories);
        setLatestDate(data.data.latest_date);
      } else {
        setError(data.error || 'Failed to fetch deals');
      }
    } catch (err) {
      setError('Failed to load deals. Please try again later.');
      console.error('Error fetching deals:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch deals when filters change
  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
    setActiveStore(newFilters.store);
  }, []);

  // Handle store tab change
  const handleStoreChange = useCallback((store: 'all' | 'netto' | 'rema' | 'meny') => {
    setActiveStore(store);
    setFilters(prev => ({ ...prev, store }));
  }, []);

  // Calculate deal counts by store
  const dealCounts = {
    all: allDeals.length,
    netto: allDeals.filter(d => d.store_slug === 'netto').length,
    rema: allDeals.filter(d => d.store_slug === 'rema').length,
    meny: allDeals.filter(d => d.store_slug === 'meny').length,
  };

  // Find best deals (lowest price per unit in each category)
  const bestDealsByCategory = deals.reduce((acc, deal) => {
    const current = acc[deal.category];
    if (!current || deal.price_per_unit < current.price_per_unit) {
      acc[deal.category] = deal;
    }
    return acc;
  }, {} as Record<string, DealWithStore>);

  const bestDealIds = new Set(
    Object.values(bestDealsByCategory).map(d => `${d.store_slug}-${d.normalized_name}`)
  );

  // Calculate stats
  const stats = {
    totalDeals: deals.length,
    avgPrice: deals.length > 0
      ? (deals.reduce((sum, d) => sum + d.price, 0) / deals.length).toFixed(2)
      : '0',
    appPriceCount: deals.filter(d => d.is_app_price).length,
  };

  // Format date for display
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('da-DK', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  // Get valid date range
  const validDateRange = deals.length > 0
    ? `${formatDate(deals[0].valid_from)} - ${formatDate(deals[0].valid_to)}`
    : '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Current Grocery Deals</h1>
        {latestDate && (
          <p className="text-sm text-gray-600">
            Deals from {formatDate(latestDate)}
            {validDateRange && ` • Valid: ${validDateRange}`}
          </p>
        )}
      </div>

      {/* Stats Summary */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-sm text-gray-600">Total Deals</div>
            <div className="text-2xl font-bold text-gray-900">{stats.totalDeals}</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-sm text-gray-600">Average Price</div>
            <div className="text-2xl font-bold text-gray-900">{stats.avgPrice} kr</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-sm text-gray-600">App-Only Deals</div>
            <div className="text-2xl font-bold text-gray-900">{stats.appPriceCount}</div>
          </div>
        </div>
      )}

      {/* Store Tabs */}
      <StoreTab
        activeStore={activeStore}
        onStoreChange={handleStoreChange}
        dealCounts={dealCounts}
      />

      {/* Filters */}
      <DealsFilter
        categories={categories}
        onFilterChange={handleFilterChange}
      />

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-64 animate-pulse"></div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 text-center">
          <svg
            className="w-12 h-12 text-red-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Deals</h3>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={fetchDeals}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && deals.length === 0 && (
        <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-12 text-center">
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
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Deals Found</h3>
          <p className="text-gray-600">
            Try adjusting your filters or check back later for new deals.
          </p>
        </div>
      )}

      {/* Deals Grid */}
      {!loading && !error && deals.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {deals.map((deal, index) => {
            const dealId = `${deal.store_slug}-${deal.normalized_name}`;
            const isBestDeal = bestDealIds.has(dealId);

            return (
              <DealCard
                key={`${dealId}-${index}`}
                deal={deal}
                showBestDeal={isBestDeal}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
