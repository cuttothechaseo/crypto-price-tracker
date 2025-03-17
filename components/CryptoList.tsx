import React from 'react';
import { CryptoData } from '../utils/fetchCrypto';
import CoinCard from './CoinCard';
import SortDropdown from './SortDropdown';
import { useCryptoStore } from '../store/useCryptoStore';

interface CryptoListProps {
  cryptoData: CryptoData[];
}

const CryptoList: React.FC<CryptoListProps> = ({ cryptoData }) => {
  const { sortOrder } = useCryptoStore();
  
  if (!cryptoData || cryptoData.length === 0) {
    return (
      <div className="text-center py-16 border border-dashed border-cyberPurple/50 rounded-lg">
        <p className="text-gray-400 font-['Exo_2']">No cryptocurrency data available.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center flex-wrap mb-8">
        <h2 className="text-xl font-['Orbitron'] font-bold text-electricBlue mb-4 md:mb-0 relative">
          <span className="relative z-10">{cryptoData.length} Cryptocurrencies</span>
          <div className="absolute -bottom-1 left-0 h-0.5 w-1/2 bg-electricBlue"></div>
        </h2>
        <SortDropdown />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
        {/* Grid decoration */}
        <div className="absolute -top-4 -left-4 w-8 h-8 border-l-2 border-t-2 border-cyberPurple opacity-70"></div>
        <div className="absolute -bottom-4 -right-4 w-8 h-8 border-r-2 border-b-2 border-electricBlue opacity-70"></div>
        
        {cryptoData.map((coin) => (
          <CoinCard key={coin.id} coin={coin} />
        ))}
      </div>
    </div>
  );
};

export default CryptoList; 