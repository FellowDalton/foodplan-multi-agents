'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ShoppingListItem from '@/components/ShoppingListItem';
import AddItemForm from '@/components/AddItemForm';
import EditItemModal from '@/components/EditItemModal';
import type { ShoppingList, ShoppingListItem as ShoppingListItemType, StorePreference } from '@/types';

export default function ShoppingListDetailPage() {
  const params = useParams();
  const router = useRouter();
  const listId = params.id as string;

  const [shoppingList, setShoppingList] = useState<ShoppingList | null>(null);
  const [items, setItems] = useState<ShoppingListItemType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<ShoppingListItemType | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showFilter, setShowFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState('');

  // Fetch shopping list and items
  useEffect(() => {
    fetchShoppingList();
  }, [listId]);

  const fetchShoppingList = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/shopping-lists/${listId}`);

      if (!response.ok) {
        if (response.status === 404) {
          alert('Shopping list not found');
          router.push('/dashboard/shopping-lists');
          return;
        }
        throw new Error('Failed to fetch shopping list');
      }

      const data = await response.json();
      setShoppingList(data.shoppingList);
      setItems(data.shoppingList.items || []);
      setTitle(data.shoppingList.title);
    } catch (error) {
      console.error('Error fetching shopping list:', error);
      alert('Failed to load shopping list');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddItem = async (itemData: {
    name: string;
    quantity?: string;
    unit?: string;
    store_preference?: StorePreference;
  }) => {
    try {
      const response = await fetch(`/api/shopping-lists/${listId}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
      });

      if (!response.ok) {
        throw new Error('Failed to add item');
      }

      const data = await response.json();
      setItems([...items, data.item]);
    } catch (error) {
      console.error('Error adding item:', error);
      throw error;
    }
  };

  const handleToggleItem = async (itemId: string, isChecked: boolean) => {
    // Optimistic update
    setItems(items.map(item =>
      item.id === itemId ? { ...item, is_checked: isChecked } : item
    ));

    try {
      const response = await fetch(`/api/shopping-lists/${listId}/items/${itemId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_checked: isChecked }),
      });

      if (!response.ok) {
        throw new Error('Failed to update item');
      }
    } catch (error) {
      console.error('Error toggling item:', error);
      // Revert on error
      fetchShoppingList();
    }
  };

  const handleEditItem = (item: ShoppingListItemType) => {
    setEditingItem(item);
    setIsEditModalOpen(true);
  };

  const handleSaveItem = async (itemId: string, updates: any) => {
    try {
      const response = await fetch(`/api/shopping-lists/${listId}/items/${itemId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update item');
      }

      const data = await response.json();

      // Update items
      setItems(items.map(item =>
        item.id === itemId ? data.item : item
      ));
    } catch (error) {
      console.error('Error saving item:', error);
      throw error;
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    // Optimistic update
    setItems(items.filter(item => item.id !== itemId));

    try {
      const response = await fetch(`/api/shopping-lists/${listId}/items/${itemId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      // Revert on error
      fetchShoppingList();
    }
  };

  const handleClearCompleted = async () => {
    const completedItems = items.filter(item => item.is_checked);

    if (completedItems.length === 0) return;

    if (!confirm(`Delete ${completedItems.length} completed items?`)) return;

    try {
      // Delete all completed items
      await Promise.all(
        completedItems.map(item =>
          fetch(`/api/shopping-lists/${listId}/items/${item.id}`, {
            method: 'DELETE',
          })
        )
      );

      // Refresh list
      fetchShoppingList();
    } catch (error) {
      console.error('Error clearing completed items:', error);
      alert('Failed to clear completed items');
    }
  };

  const handleUpdateTitle = async () => {
    if (!title.trim() || title === shoppingList?.title) {
      setIsEditingTitle(false);
      setTitle(shoppingList?.title || '');
      return;
    }

    try {
      const response = await fetch(`/api/shopping-lists/${listId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: title.trim() }),
      });

      if (!response.ok) {
        throw new Error('Failed to update title');
      }

      const data = await response.json();
      setShoppingList(data.shoppingList);
      setIsEditingTitle(false);
    } catch (error) {
      console.error('Error updating title:', error);
      alert('Failed to update title');
      setTitle(shoppingList?.title || '');
      setIsEditingTitle(false);
    }
  };

  const handleMarkComplete = async () => {
    try {
      const response = await fetch(`/api/shopping-lists/${listId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_completed: !shoppingList?.is_completed }),
      });

      if (!response.ok) {
        throw new Error('Failed to update list');
      }

      const data = await response.json();
      setShoppingList(data.shoppingList);
    } catch (error) {
      console.error('Error marking list complete:', error);
      alert('Failed to update list');
    }
  };

  // Filter items
  const filteredItems = items.filter(item => {
    if (showFilter === 'active') return !item.is_checked;
    if (showFilter === 'completed') return item.is_checked;
    return true;
  });

  // Sort items: unchecked first, then checked
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (a.is_checked === b.is_checked) return 0;
    return a.is_checked ? 1 : -1;
  });

  const totalItems = items.length;
  const checkedItems = items.filter(item => item.is_checked).length;

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading shopping list...</p>
        </div>
      </div>
    );
  }

  if (!shoppingList) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <p className="text-gray-600">Shopping list not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push('/dashboard/shopping-lists')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to lists
        </button>

        {/* Title */}
        {isEditingTitle ? (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleUpdateTitle}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleUpdateTitle();
              if (e.key === 'Escape') {
                setTitle(shoppingList.title);
                setIsEditingTitle(false);
              }
            }}
            className="text-3xl font-bold text-gray-900 mb-2 px-2 py-1 border-2 border-blue-500 rounded focus:outline-none w-full"
            autoFocus
          />
        ) : (
          <h1
            onClick={() => setIsEditingTitle(true)}
            className="text-3xl font-bold text-gray-900 mb-2 cursor-pointer hover:text-blue-600 transition-colors"
          >
            {shoppingList.title}
          </h1>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>{checkedItems} of {totalItems} items checked</span>
          {shoppingList.meal_plan && (
            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
              From meal plan
            </span>
          )}
          {shoppingList.is_completed && (
            <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs">
              Completed
            </span>
          )}
        </div>
      </div>

      {/* Add item form */}
      <div className="mb-6">
        <AddItemForm onAdd={handleAddItem} />
      </div>

      {/* Filter tabs */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilter('all')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              showFilter === 'all'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            All ({totalItems})
          </button>

          <button
            onClick={() => setShowFilter('active')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              showFilter === 'active'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Active ({totalItems - checkedItems})
          </button>

          <button
            onClick={() => setShowFilter('completed')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              showFilter === 'completed'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Completed ({checkedItems})
          </button>
        </div>

        {checkedItems > 0 && (
          <button
            onClick={handleClearCompleted}
            className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
          >
            Clear completed
          </button>
        )}
      </div>

      {/* Items list */}
      {sortedItems.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-100">
          {sortedItems.map((item) => (
            <ShoppingListItem
              key={item.id}
              item={item}
              onToggle={handleToggleItem}
              onEdit={handleEditItem}
              onDelete={handleDeleteItem}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">
            {showFilter === 'all'
              ? 'No items yet. Add your first item above!'
              : showFilter === 'active'
              ? 'No active items'
              : 'No completed items'}
          </p>
        </div>
      )}

      {/* Bottom actions */}
      <div className="mt-6 flex justify-between items-center">
        <button
          onClick={handleMarkComplete}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            shoppingList.is_completed
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {shoppingList.is_completed ? 'Mark as Active' : 'Mark as Completed'}
        </button>

        <p className="text-sm text-gray-500">
          Created {new Date(shoppingList.created_at).toLocaleDateString()}
        </p>
      </div>

      {/* Edit item modal */}
      <EditItemModal
        item={editingItem}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveItem}
      />
    </div>
  );
}
