import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaFire, FaRocket, FaChartLine, FaExchangeAlt, FaChevronRight } from 'react-icons/fa';
import dynamic from 'next/dynamic';
import useCryptoStore from '../store/useCryptoStore';

// Lazy load the chart component for better performance
const MarketChart = dynamic(() => import('./MarketChart'), { 
  ssr: false,
  loading: () => (
    <div className="animate-pulse bg-gray-200 h-24 w-full rounded"></div>
  )
});

const MarketOverview: React.FC = () => {
  // Get data and actions from the store
  const { 
    globalData, 
    trendingCoins, 
    topGainers, 
    marketChartData,
    loading, 
    error,
    lastUpdated,
    fetchAllData 
  } = useCryptoStore();

  // Fetch data on component mount and set up refresh interval
  useEffect(() => {
    // Initial data fetch
    fetchAllData();
    
    // Refresh data every 5 minutes
    const intervalId = setInterval(fetchAllData, 5 * 60 * 1000);
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [fetchAllData]);

  // Format large numbers
  const formatCurrency = (value: number): string => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)} Trillion`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)} Billion`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)} Million`;
    return `$${value.toLocaleString()}`;
  };

  // Format currency for display in large format
  const formatLargeNumber = (value: number): string => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${value.toLocaleString()}`;
  };

  // Format full numerical value with commas
  const formatFullNumber = (value: number): string => {
    return `$${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  };

  // Format percentage change
  const formatPercentage = (value: number): string => {
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  if (loading && !globalData) {
    return (
      <div className="animate-pulse bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
        <div className="h-6 bg-gray-200 rounded mb-6 w-1/3"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="h-28 bg-gray-200 rounded"></div>
          <div className="h-28 bg-gray-200 rounded"></div>
          <div className="h-28 bg-gray-200 rounded"></div>
          <div className="h-28 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error && !globalData) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
        <p className="text-danger text-center">{error}</p>
        <button 
          onClick={fetchAllData}
          className="mt-4 px-4 py-2 mx-auto block bg-primaryBlue text-white rounded-md hover:bg-secondaryBlue transition-colors duration-200"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!globalData) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border border-gray-200">
      <h2 className="text-xl font-medium text-darkGray mb-6 flex items-center">
        <FaChartLine className="mr-2 text-primaryBlue" />
        Cryptocurrency Prices by Market Cap
      </h2>
      
      <p className="text-gray-600 mb-6">
        The global cryptocurrency market cap today is {formatCurrency(globalData.total_market_cap.usd)}, a 
        <span className={`font-medium mx-1 ${globalData.market_cap_change_percentage_24h_usd >= 0 ? 'text-green-600' : 'text-danger'}`}>
          {formatPercentage(globalData.market_cap_change_percentage_24h_usd)}
        </span> 
        change in the last 24 hours.
        <Link href="/market" className="ml-2 text-primaryBlue hover:underline">
          Read more
        </Link>
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {/* Global Market Cap */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 col-span-1 md:col-span-2">
          <div className="flex items-center mb-2">
            <p className="text-xl font-semibold text-darkGray">
              {formatFullNumber(globalData.total_market_cap.usd)}
            </p>
          </div>
          <div className="flex items-center mb-3">
            <p className="text-gray-500">Market Cap</p>
            <span className={`ml-2 text-sm font-medium ${globalData.market_cap_change_percentage_24h_usd >= 0 ? 'text-green-600' : 'text-danger'}`}>
              {globalData.market_cap_change_percentage_24h_usd >= 0 ? '↑' : '↓'} {Math.abs(globalData.market_cap_change_percentage_24h_usd).toFixed(1)}%
            </span>
          </div>
          
          {/* Market Cap Chart */}
          <div className="mt-1">
            {marketChartData && marketChartData.marketCap && marketChartData.marketCap.length > 0 ? (
              <MarketChart 
                data={marketChartData.marketCap} 
                color={globalData.market_cap_change_percentage_24h_usd >= 0 ? "#22c55e" : "#ef4444"} 
                height={90}
                gradientId="marketCapGradient"
              />
            ) : (
              <div className="w-full h-24 bg-gray-100 rounded flex items-center justify-center">
                <p className="text-sm text-gray-400">Loading chart data...</p>
              </div>
            )}
          </div>
        </div>
        
        {/* 24h Trading Volume */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 col-span-1 md:col-span-2">
          <div className="mb-2">
            <p className="text-xl font-semibold text-darkGray">
              {formatFullNumber(globalData.total_volume.usd)}
            </p>
          </div>
          <p className="text-gray-500 mb-3">24h Trading Volume</p>
          
          {/* Trading Volume Chart */}
          <div className="mt-1">
            {marketChartData && marketChartData.volume && marketChartData.volume.length > 0 ? (
              <MarketChart 
                data={marketChartData.volume} 
                color="#ef4444" 
                height={90}
                gradientId="volumeGradient"
              />
            ) : (
              <div className="w-full h-24 bg-gray-100 rounded flex items-center justify-center">
                <p className="text-sm text-gray-400">Loading chart data...</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Trending Coins */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <FaFire className="text-orange-500 mr-2" />
              <p className="text-gray-700 font-medium">Trending</p>
            </div>
            <Link href="/trending" className="text-primaryBlue hover:underline text-sm flex items-center">
              View more <FaChevronRight className="ml-1 h-3 w-3" />
            </Link>
          </div>
          
          {trendingCoins.length > 0 ? (
            <div className="space-y-3">
              {trendingCoins.slice(0, 3).map((coin) => (
                <div key={coin.item.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-6 h-6 mr-2 relative flex-shrink-0">
                      <Image 
                        src={coin.item.thumb} 
                        alt={coin.item.name} 
                        width={24} 
                        height={24}
                        className="rounded-full"
                      />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-darkGray">{coin.item.name}</span>
                      <span className="text-xs text-gray-500 ml-1.5">{coin.item.symbol}</span>
                    </div>
                  </div>
                  <span className="text-xs font-medium bg-gray-200 px-1.5 py-0.5 rounded">#{coin.item.market_cap_rank}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No data available</p>
          )}
        </div>
        
        {/* Top Gainers */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <FaRocket className="text-green-500 mr-2" />
              <p className="text-gray-700 font-medium">Top Gainers</p>
            </div>
            <Link href="/gainers" className="text-primaryBlue hover:underline text-sm flex items-center">
              View more <FaChevronRight className="ml-1 h-3 w-3" />
            </Link>
          </div>
          
          {topGainers.length > 0 ? (
            <div className="space-y-3">
              {topGainers.slice(0, 3).map((coin) => (
                <div key={coin.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-6 h-6 mr-2 relative flex-shrink-0">
                      <Image 
                        src={coin.image} 
                        alt={coin.name} 
                        width={24} 
                        height={24}
                        className="rounded-full"
                      />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-darkGray">{coin.name}</span>
                      <span className="text-xs text-gray-500 ml-1.5">{coin.symbol.toUpperCase()}</span>
                    </div>
                  </div>
                  <span className="text-xs font-medium bg-green-100 text-green-600 px-1.5 py-0.5 rounded-full">
                    {formatPercentage(coin.price_change_percentage_24h)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketOverview; 