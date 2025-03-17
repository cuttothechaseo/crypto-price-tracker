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

  // Define color based on price change direction
  const priceChangeColor = typeof coin.price_change_percentage_24h === 'number' && !isNaN(coin.price_change_percentage_24h)
    ? coin.price_change_percentage_24h >= 0 ? 'neonGreen' : 'neonPink'
    : 'gray-400';

  return (
    <div className="card p-6 flex flex-col items-center transition-all duration-300 hover:shadow-lg rounded-xl relative overflow-hidden group">
      {/* Background glow effect that appears on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyberPurple/5 to-electricBlue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="flex items-center mb-4 w-full relative z-10">
        <div className="w-12 h-12 mr-3 relative flex-shrink-0 rounded-full overflow-hidden border border-gray-700 group-hover:border-electricBlue transition-colors duration-300">
          <img 
            src={coin.image} 
            alt={coin.name} 
            width={48}
            height={48}
            className="w-full h-full object-contain bg-darkBackground p-1"
            onError={(e) => {
              // Fallback if image fails to load
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = `https://via.placeholder.com/48/CCCCCC/808080?text=${coin.symbol}`;
            }}
          />
        </div>
        <div className="flex flex-col items-start">
          <h2 className="text-xl font-bold text-electricBlue group-hover:animate-glow transition-all duration-300">{coin.name}</h2>
          <span className="text-sm text-gray-400 font-medium">{coin.symbol}</span>
        </div>
      </div>
      
      <div className="w-full border-t border-gray-700 group-hover:border-cyberPurple/50 my-3 transition-colors duration-300"></div>
      
      <div className="w-full flex justify-between items-center my-2 relative z-10">
        <span className="text-gray-400 font-medium">Price:</span>
        <span className="text-xl font-bold text-white group-hover:text-electricBlue transition-colors duration-300">
          {typeof coin.current_price === 'number' && !isNaN(coin.current_price) ? (
            `$${coin.current_price.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}`
          ) : (
            'Price unavailable'
          )}
        </span>
      </div>
      
      <div className="w-full flex justify-between items-center my-2 relative z-10">
        <span className="text-gray-400 font-medium">24h Change:</span>
        <div className="flex items-center">
          {typeof coin.price_change_percentage_24h === 'number' && !isNaN(coin.price_change_percentage_24h) ? (
            <div className={`flex items-center font-semibold ${
              coin.price_change_percentage_24h >= 0 
                ? 'text-neonGreen' 
                : 'text-neonPink'
            } transition-all duration-300 ${
              coin.price_change_percentage_24h >= 0 
                ? 'group-hover:shadow-glow-green' 
                : 'group-hover:shadow-glow-pink'
            }`}>
              <span className="mr-1">
                {coin.price_change_percentage_24h >= 0 ? '↑' : '↓'}
              </span>
              <span>
                {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
              </span>
            </div>
          ) : (
            <span className="text-gray-500">Data unavailable</span>
          )}
        </div>
      </div>
      
      <div className="w-full flex justify-between items-center my-2 relative z-10">
        <span className="text-gray-400 font-medium">Market Cap:</span>
        <span className="font-semibold text-white group-hover:text-cyberPurple transition-colors duration-300">
          {typeof coin.market_cap === 'number' && !isNaN(coin.market_cap) ? (
            `$${formatMarketCap(coin.market_cap)}`
          ) : (
            'Data unavailable'
          )}
        </span>
      </div>
      
      <div className="w-full flex space-x-2 mt-4 relative z-10">
        <button 
          className="flex-1 py-2 px-4 bg-cyberPurple text-white rounded-lg transition-all duration-300 font-medium hover:shadow-glow-purple pulse-btn"
          onClick={() => window.open(`https://www.coingecko.com/en/coins/${coin.id}`, '_blank')}
        >
          View Details
        </button>
        
        <button
          className={`py-2 px-3 rounded-lg transition-all duration-300 font-medium flex items-center justify-center ${
            showChart 
              ? 'bg-electricBlue/20 border border-electricBlue text-electricBlue hover:shadow-glow-blue' 
              : 'bg-gray-800 text-gray-300 hover:text-electricBlue hover:border-electricBlue border border-gray-700'
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
          color={coin.price_change_percentage_24h >= 0 ? '#39FF14' : '#FF00A8'}
        />
      )}
    </div>
  );
};

// Helper function to format large market cap numbers
function formatMarketCap(marketCap: number): string {
  // Handle edge cases
  if (marketCap === 0) return '0.00';
  if (!marketCap || isNaN(marketCap)) return 'N/A';
  
  if (marketCap >= 1e12) {
    return (marketCap / 1e12).toFixed(2) + 'T';
  } else if (marketCap >= 1e9) {
    return (marketCap / 1e9).toFixed(2) + 'B';
  } else if (marketCap >= 1e6) {
    return (marketCap / 1e6).toFixed(2) + 'M';
  } else if (marketCap >= 1e3) {
    return (marketCap / 1e3).toFixed(2) + 'K';
  } else {
    return marketCap.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
}

export default CoinCard; 