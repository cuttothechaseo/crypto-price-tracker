import React from 'react';
import { SortOrder, useCryptoStore } from '../store/useCryptoStore';

const SortDropdown: React.FC = () => {
  const { sortOrder, setSortOrder } = useCryptoStore();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as SortOrder;
    setSortOrder(value);
  };

  return (
    <div className="flex items-center space-x-2 mb-6">
      <label htmlFor="sort-order" className="text-gray-700 dark:text-gray-300 font-medium">
        Sort by:
      </label>
      <div className="relative">
        <select
          id="sort-order"
          value={sortOrder}
          onChange={handleChange}
          className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-2 pl-3 pr-10 text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="market_cap_desc">Market Cap (High-Low)</option>
          <option value="market_cap_asc">Market Cap (Low-High)</option>
          <option value="price_desc">Price (High-Low)</option>
          <option value="price_asc">Price (Low-High)</option>
          <option value="name_asc">Name (A-Z)</option>
          <option value="name_desc">Name (Z-A)</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default SortDropdown; 