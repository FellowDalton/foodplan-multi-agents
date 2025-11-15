'use client';

interface StoreTabProps {
  activeStore: 'all' | 'netto' | 'rema' | 'meny';
  onStoreChange: (store: 'all' | 'netto' | 'rema' | 'meny') => void;
  dealCounts?: {
    all: number;
    netto: number;
    rema: number;
    meny: number;
  };
}

export default function StoreTab({ activeStore, onStoreChange, dealCounts }: StoreTabProps) {
  const stores = [
    { id: 'all' as const, name: 'All Stores', color: 'gray' },
    { id: 'netto' as const, name: 'Netto', color: 'yellow' },
    { id: 'rema' as const, name: 'Rema 1000', color: 'blue' },
    { id: 'meny' as const, name: 'Meny', color: 'red' },
  ];

  const getTabClasses = (storeId: typeof activeStore) => {
    const isActive = activeStore === storeId;
    const baseClasses = 'flex-1 px-4 py-3 text-center font-medium rounded-lg transition-all duration-200';

    if (!isActive) {
      return `${baseClasses} bg-white text-gray-600 hover:bg-gray-50 border border-gray-200`;
    }

    // Active state with store colors
    switch (storeId) {
      case 'all':
        return `${baseClasses} bg-gray-700 text-white shadow-lg`;
      case 'netto':
        return `${baseClasses} bg-yellow-500 text-white shadow-lg`;
      case 'rema':
        return `${baseClasses} bg-blue-500 text-white shadow-lg`;
      case 'meny':
        return `${baseClasses} bg-red-500 text-white shadow-lg`;
      default:
        return `${baseClasses} bg-gray-700 text-white shadow-lg`;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-2 mb-6">
      <div className="flex flex-col sm:flex-row gap-2">
        {stores.map(store => (
          <button
            key={store.id}
            onClick={() => onStoreChange(store.id)}
            className={getTabClasses(store.id)}
          >
            <div className="flex flex-col items-center justify-center">
              <span className="text-sm sm:text-base">{store.name}</span>
              {dealCounts && dealCounts[store.id] > 0 && (
                <span className="text-xs mt-1 opacity-90">
                  {dealCounts[store.id]} deals
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
