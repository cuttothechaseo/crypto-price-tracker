import React from 'react';
import Image from 'next/image';
import { CryptoCoin } from '../types';

interface MarketOverviewProps {
  globalMarketCap: number;
  globalMarketCapChange: number;
  volume24h: number;
  volumeChange: number;
  trendingCoins: CryptoCoin[];
  topGainers: CryptoCoin[];
  isLoading: boolean;
}

const MarketOverview: React.FC<MarketOverviewProps> = ({
  globalMarketCap,
  globalMarketCapChange,
  volume24h,
  volumeChange,
  trendingCoins,
  topGainers,
  isLoading,
}) => {
  // Format large numbers like market cap and trading volume
  const formatLargeNumber = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toLocaleString()}`;
  };

  // Get color based on whether value is positive or negative
  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-600' : 'text-danger';
  };

  // Get icon for percentage change
  const getChangeIcon = (change: number) => {
    return change >= 0 ? (
      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
      </svg>
    ) : (
      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
      </svg>
    );
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-soft p-4 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="h-24 bg-gray-200 rounded"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-40 bg-gray-200 rounded"></div>
          <div className="h-40 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-soft p-6 mb-8">
      <h2 className="text-xl font-medium text-darkGray mb-6">Market Overview</h2>
      
      {/* Global market stats - desktop 2 columns, mobile 1 column */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Market Cap */}
        <div className="bg-lightGray rounded-lg p-4">
          <div className="text-gray-500 text-sm mb-1">Global Market Cap</div>
          <div className="flex items-end">
            <div className="text-2xl font-bold text-darkGray">
              {formatLargeNumber(globalMarketCap)}
            </div>
            <div className={`ml-2 flex items-center text-sm ${getChangeColor(globalMarketCapChange)}`}>
              {getChangeIcon(globalMarketCapChange)}
              {Math.abs(globalMarketCapChange).toFixed(2)}%
            </div>
          </div>
        </div>

        {/* 24h Volume */}
        <div className="bg-lightGray rounded-lg p-4">
          <div className="text-gray-500 text-sm mb-1">24h Trading Volume</div>
          <div className="flex items-end">
            <div className="text-2xl font-bold text-darkGray">
              {formatLargeNumber(volume24h)}
            </div>
            <div className={`ml-2 flex items-center text-sm ${getChangeColor(volumeChange)}`}>
              {getChangeIcon(volumeChange)}
              {Math.abs(volumeChange).toFixed(2)}%
            </div>
          </div>
        </div>
      </div>

      {/* Trending and Top Gainers - desktop 2 columns, mobile 1 column */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Trending Coins */}
        <div>
          <h3 className="text-lg font-medium text-darkGray mb-3">Trending Coins</h3>
          <div className="space-y-3">
            {trendingCoins.slice(0, 3).map((coin) => (
              <div key={coin.id} className="flex items-center justify-between bg-lightGray rounded-lg p-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 mr-3 bg-white rounded-full p-1 flex-shrink-0">
                    <Image
                      src={coin.image}
                      alt={coin.name}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                  </div>
                  <div>
                    <div className="font-medium text-darkGray">{coin.name}</div>
                    <div className="text-gray-500 text-xs uppercase">{coin.symbol}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-darkGray">
                    ${coin.current_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                  </div>
                  <div className={`flex items-center justify-end text-xs ${getChangeColor(coin.price_change_percentage_24h)}`}>
                    {getChangeIcon(coin.price_change_percentage_24h)}
                    {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Gainers */}
        <div>
          <h3 className="text-lg font-medium text-darkGray mb-3">Top Gainers</h3>
          <div className="space-y-3">
            {topGainers.slice(0, 3).map((coin) => (
              <div key={coin.id} className="flex items-center justify-between bg-lightGray rounded-lg p-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 mr-3 bg-white rounded-full p-1 flex-shrink-0">
                    <Image
                      src={coin.image}
                      alt={coin.name}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                  </div>
                  <div>
                    <div className="font-medium text-darkGray">{coin.name}</div>
                    <div className="text-gray-500 text-xs uppercase">{coin.symbol}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-darkGray">
                    ${coin.current_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                  </div>
                  <div className="flex items-center justify-end text-xs text-green-600">
                    {getChangeIcon(coin.price_change_percentage_24h)}
                    {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketOverview; 