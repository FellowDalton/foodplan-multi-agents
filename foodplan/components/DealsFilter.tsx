'use client';

import { useState, useEffect } from 'react';

interface DealsFilterProps {
  categories: string[];
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  store: 'all' | 'netto' | 'rema' | 'meny';
  category: string;
  search: string;
  sortBy: 'price' | 'price_per_unit' | 'name';
  sortOrder: 'asc' | 'desc';
}

export default function DealsFilter({ categories, onFilterChange }: DealsFilterProps) {
  const [filters, setFilters] = useState<FilterState>({
    store: 'all',
    category: '',
    search: '',
    sortBy: 'price',
    sortOrder: 'asc',
  });

  // Notify parent component when filters change
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const handleStoreChange = (store: FilterState['store']) => {
    setFilters(prev => ({ ...prev, store }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, category: e.target.value }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, sortBy: e.target.value as FilterState['sortBy'] }));
  };

  const handleSortOrderToggle = () => {
    setFilters(prev => ({
      ...prev,
      sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleReset = () => {
    setFilters({
      store: 'all',
      category: '',
      search: '',
      sortBy: 'price',
      sortOrder: 'asc',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Store Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Store
          </label>
          <div className="flex gap-2 flex-wrap">
            {(['all', 'netto', 'rema', 'meny'] as const).map(store => (
              <button
                key={store}
                onClick={() => handleStoreChange(store)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filters.store === store
                    ? store === 'all'
                      ? 'bg-gray-700 text-white'
                      : store === 'netto'
                      ? 'bg-yellow-500 text-white'
                      : store === 'rema'
                      ? 'bg-blue-500 text-white'
                      : 'bg-red-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {store.charAt(0).toUpperCase() + store.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            id="category"
            value={filters.category}
            onChange={handleCategoryChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div>
          <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <div className="flex gap-2">
            <select
              id="sort"
              value={filters.sortBy}
              onChange={handleSortChange}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="price">Price</option>
              <option value="price_per_unit">Price per Unit</option>
              <option value="name">Name</option>
            </select>
            <button
              onClick={handleSortOrderToggle}
              className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
              title={filters.sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            >
              {filters.sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>

        {/* Search */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            Search
          </label>
          <input
            type="text"
            id="search"
            value={filters.search}
            onChange={handleSearchChange}
            placeholder="Search products..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Reset Button */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={handleReset}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}
