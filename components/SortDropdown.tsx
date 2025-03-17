import React, { useState } from 'react';

export type SortOption = 'rank' | 'name' | 'price' | 'marketCap' | 'priceChange';

interface SortDropdownProps {
  onSort: (option: SortOption) => void;
  currentSort: SortOption;
}

const SortDropdown: React.FC<SortDropdownProps> = ({ onSort, currentSort }) => {
  const [isOpen, setIsOpen] = useState(false);

  const options: { label: string; value: SortOption }[] = [
    { label: 'Rank', value: 'rank' },
    { label: 'Name', value: 'name' },
    { label: 'Price', value: 'price' },
    { label: 'Market Cap', value: 'marketCap' },
    { label: '24h Change', value: 'priceChange' },
  ];

  const currentLabel = options.find((option) => option.value === currentSort)?.label || 'Sort by';

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex justify-between items-center w-44 rounded-md border border-gray-300 px-4 py-2 bg-white text-sm font-medium text-darkGray hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primaryBlue transition-all duration-200"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>Sort by: {currentLabel}</span>
          <svg
            className="-mr-1 ml-2 h-5 w-5 transition-transform duration-200"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }}
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-44 rounded-md shadow-soft bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {options.map((option) => (
              <button
                key={option.value}
                className={`block px-4 py-2 text-sm w-full text-left transition-colors duration-200 ${
                  currentSort === option.value
                    ? 'bg-primaryBlue/10 text-primaryBlue font-medium'
                    : 'text-darkGray hover:bg-gray-100'
                }`}
                role="menuitem"
                onClick={() => {
                  onSort(option.value);
                  setIsOpen(false);
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SortDropdown; 