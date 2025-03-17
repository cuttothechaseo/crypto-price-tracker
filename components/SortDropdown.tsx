import React, { useCallback, useState } from 'react';
import { SortOrder, useCryptoStore } from '../store/useCryptoStore';

const SortDropdown: React.FC = () => {
  const { sortOrder, setSortOrder } = useCryptoStore();
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as SortOrder;
    console.log('Sort dropdown changed to:', value);
    setSortOrder(value);
  }, [setSortOrder]);

  return (
    <div className="flex items-center space-x-3 mb-8">
      <label htmlFor="sort-order" className="text-electricBlue font-['Orbitron'] font-medium text-sm">
        SORT BY:
      </label>
      <div className={`relative transition-all duration-300 ${isFocused ? 'shadow-glow-purple' : ''}`}>
        <select
          id="sort-order"
          value={sortOrder}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="appearance-none bg-darkBackground border border-cyberPurple/50 rounded-md py-2.5 pl-4 pr-12 text-sm font-medium text-white focus:outline-none focus:border-cyberPurple font-['Exo_2'] transition-all duration-300 hover:border-cyberPurple"
        >
          <option value="market_cap_desc">Market Cap (High-Low)</option>
          <option value="market_cap_asc">Market Cap (Low-High)</option>
          <option value="price_desc">Price (High-Low)</option>
          <option value="price_asc">Price (Low-High)</option>
          <option value="name_asc">Name (A-Z)</option>
          <option value="name_desc">Name (Z-A)</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-cyberPurple">
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-1 h-1 bg-cyberPurple"></div>
        <div className="absolute top-0 right-0 w-1 h-1 bg-electricBlue"></div>
        <div className="absolute bottom-0 left-0 w-1 h-1 bg-electricBlue"></div>
        <div className="absolute bottom-0 right-0 w-1 h-1 bg-cyberPurple"></div>
      </div>
    </div>
  );
};

export default SortDropdown; 