import React, { useState, useMemo } from 'react';
import CoinCard from './CoinCard';
import SortDropdown, { SortOption } from './SortDropdown';
import { CryptoCoin } from '../types';

interface CryptoListProps {
  coins: CryptoCoin[];
  searchTerm: string;
}

const CryptoList: React.FC<CryptoListProps> = ({ coins, searchTerm }) => {
  const [sortBy, setSortBy] = useState<SortOption>('rank');
  
  const filteredCoins = useMemo(() => {
    if (!searchTerm) {
      return coins;
    }
    
    const normalizedSearchTerm = searchTerm.toLowerCase();
    return coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(normalizedSearchTerm) ||
        coin.symbol.toLowerCase().includes(normalizedSearchTerm)
    );
  }, [coins, searchTerm]);

  const sortedCoins = useMemo(() => {
    return [...filteredCoins].sort((a, b) => {
      switch (sortBy) {
        case 'rank':
          // Ensure coins without rank are pushed to the end
          if (!a.market_cap_rank) return 1;
          if (!b.market_cap_rank) return -1;
          return a.market_cap_rank - b.market_cap_rank;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return b.current_price - a.current_price;
        case 'marketCap':
          return b.market_cap - a.market_cap;
        case 'priceChange':
          // Handle cases where price change percentage might be undefined or NaN
          const aChange = a.price_change_percentage_24h ?? 0;
          const bChange = b.price_change_percentage_24h ?? 0;
          return isNaN(bChange) ? -1 : isNaN(aChange) ? 1 : bChange - aChange;
        default:
          return 0;
      }
    });
  }, [filteredCoins, sortBy]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium text-darkGray">
          {filteredCoins.length} Cryptocurrencies
        </h2>
        <SortDropdown currentSort={sortBy} onSort={setSortBy} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
        {sortedCoins.length > 0 ? (
          sortedCoins.map((coin) => <CoinCard key={coin.id} coin={coin} />)
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-soft border border-gray-200">
            <svg
              className="w-16 h-16 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h3 className="text-lg font-medium text-darkGray mb-2">No cryptocurrencies found</h3>
            <p className="text-gray-500 text-center">
              Try adjusting your search term or check back later for updated listings.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CryptoList; 