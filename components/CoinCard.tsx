import React, { useState } from 'react';
import { CryptoData } from '../utils/fetchCrypto';
import CryptoChart from './CryptoChart';

interface CoinCardProps {
  coin: CryptoData;
}

const CoinCard: React.FC<CoinCardProps> = ({ coin }) => {
  const [showChart, setShowChart] = useState(false);

  const toggleChart = () => {
    setShowChart(!showChart);
  };

  return (
    <div className="card p-6 flex flex-col items-center transition-all duration-300 hover:shadow-lg rounded-xl">
      <div className="flex items-center mb-4 w-full">
        <div className="w-12 h-12 mr-3 relative flex-shrink-0">
          <img 
            src={coin.image} 
            alt={coin.name} 
            width={48}
            height={48}
            className="w-full h-full object-contain rounded-full bg-white p-1"
            onError={(e) => {
              // Fallback if image fails to load
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = `https://via.placeholder.com/48/CCCCCC/808080?text=${coin.symbol}`;
            }}
          />
        </div>
        <div className="flex flex-col items-start">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">{coin.name}</h2>
          <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">{coin.symbol}</span>
        </div>
      </div>
      
      <div className="w-full border-t border-gray-200 dark:border-gray-700 my-3"></div>
      
      <div className="w-full flex justify-between items-center my-2">
        <span className="text-gray-600 dark:text-gray-400 font-medium">Price:</span>
        <span className="text-xl font-bold text-gray-800 dark:text-white">
          ${coin.current_price.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
        </span>
      </div>
      
      <div className="w-full flex justify-between items-center my-2">
        <span className="text-gray-600 dark:text-gray-400 font-medium">24h Change:</span>
        <div className="flex items-center">
          <div className={`flex items-center font-semibold ${
            coin.price_change_percentage_24h >= 0 
              ? 'text-green-500 dark:text-green-400' 
              : 'text-red-500 dark:text-red-400'
          }`}>
            <span className="mr-1">
              {coin.price_change_percentage_24h >= 0 ? '↑' : '↓'}
            </span>
            <span>
              {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
      
      <div className="w-full flex justify-between items-center my-2">
        <span className="text-gray-600 dark:text-gray-400 font-medium">Market Cap:</span>
        <span className="font-semibold text-gray-800 dark:text-white">
          ${formatMarketCap(coin.market_cap)}
        </span>
      </div>
      
      <div className="w-full flex space-x-2 mt-4">
        <button 
          className="flex-1 py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200 font-medium"
          onClick={() => window.open(`https://www.coingecko.com/en/coins/${coin.id}`, '_blank')}
        >
          View Details
        </button>
        
        <button
          className={`py-2 px-3 rounded-lg transition-colors duration-200 font-medium flex items-center justify-center ${
            showChart 
              ? 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white' 
              : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
          }`}
          onClick={toggleChart}
          aria-label={showChart ? 'Hide price chart' : 'Show price chart'}
          title={showChart ? 'Hide price chart' : 'Show price chart'}
        >
          {showChart ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>
      
      {/* Collapsible chart section */}
      {showChart && (
        <CryptoChart 
          coinId={coin.id} 
          coinName={coin.name} 
          coinSymbol={coin.symbol}
          color={coin.price_change_percentage_24h >= 0 ? '#10b981' : '#ef4444'}
        />
      )}
    </div>
  );
};

// Helper function to format large market cap numbers
function formatMarketCap(marketCap: number): string {
  if (marketCap >= 1e12) {
    return (marketCap / 1e12).toFixed(2) + 'T';
  } else if (marketCap >= 1e9) {
    return (marketCap / 1e9).toFixed(2) + 'B';
  } else if (marketCap >= 1e6) {
    return (marketCap / 1e6).toFixed(2) + 'M';
  } else {
    return marketCap.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
}

export default CoinCard; 