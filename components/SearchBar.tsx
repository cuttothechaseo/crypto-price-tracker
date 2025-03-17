import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div className="w-full max-w-md mx-auto mb-10">
      <div className={`relative transition-all duration-300 ${isFocused ? 'shadow-glow-blue' : ''}`}>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className={`h-5 w-5 transition-colors duration-300 ${
              isFocused ? 'text-electricBlue' : 'text-gray-500'
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-md leading-5 bg-darkBackground placeholder-gray-500 text-electricBlue focus:outline-none focus:border-electricBlue font-['Exo_2'] transition-all duration-300"
          placeholder="Search cryptocurrencies..."
          value={searchTerm}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {searchTerm && (
          <button
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => {
              setSearchTerm('');
              onSearch('');
            }}
          >
            <svg
              className="h-5 w-5 text-neonPink hover:text-white transition-colors duration-300"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
        
        {/* Decorative elements */}
        <div className={`absolute -bottom-0.5 left-0 h-0.5 bg-electricBlue transition-all duration-500 ${
          isFocused ? 'w-full' : 'w-0'
        }`}></div>
        <div className={`absolute -right-0.5 top-0 w-0.5 bg-electricBlue transition-all duration-500 ${
          isFocused ? 'h-full delay-100' : 'h-0'
        }`}></div>
      </div>
    </div>
  );
};

export default SearchBar; 