import React from 'react';
import { CryptoData } from '../utils/fetchCrypto';
import CoinCard from './CoinCard';
import SortDropdown from './SortDropdown';

interface CryptoListProps {
  cryptoData: CryptoData[];
}

const CryptoList: React.FC<CryptoListProps> = ({ cryptoData }) => {
  if (!cryptoData || cryptoData.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 dark:text-gray-400">No cryptocurrency data available.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center flex-wrap mb-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 md:mb-0">
          {cryptoData.length} Cryptocurrencies
        </h2>
        <SortDropdown />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cryptoData.map((coin) => (
          <CoinCard key={coin.id} coin={coin} />
        ))}
      </div>
    </div>
  );
};

export default CryptoList; 