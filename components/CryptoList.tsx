import React, { useState } from 'react';
import CoinCard from './CoinCard';
import SortDropdown, { SortOption } from './SortDropdown';
import { CryptoCoin } from '../types';

interface CryptoListProps {
  coins: CryptoCoin[];
  searchTerm: string;
}

const CryptoList: React.FC<CryptoListProps> = ({ coins, searchTerm }) => {
  const [sortBy, setSortBy] = useState<SortOption>('rank');
  
  const filteredCoins = searchTerm
    ? coins.filter(
        (coin) =>
          coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : coins;

  const sortedCoins = [...filteredCoins].sort((a, b) => {
    switch (sortBy) {
      case 'rank':
        return a.market_cap_rank - b.market_cap_rank;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'price':
        return b.current_price - a.current_price;
      case 'marketCap':
        return b.market_cap - a.market_cap;
      case 'priceChange':
        return b.price_change_percentage_24h - a.price_change_percentage_24h;
      default:
        return 0;
    }
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium text-darkGray">
          {filteredCoins.length} Cryptocurrencies
        </h2>
        <SortDropdown currentSort={sortBy} onSort={setSortBy} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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