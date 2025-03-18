import React, { useEffect, useState } from 'react';
import { fetchGlobalMarketData, fetchTrendingCoins, fetchTopGainers } from '../utils/fetchCrypto';
import Image from 'next/image';
import Link from 'next/link';
import { FaFire, FaRocket, FaChartLine, FaExchangeAlt, FaChevronRight } from 'react-icons/fa';

interface GlobalMarketData {
  total_market_cap: { usd: number };
  total_volume: { usd: number };
  market_cap_percentage: { [key: string]: number };
  market_cap_change_percentage_24h_usd: number;
}

interface TrendingCoin {
  item: {
    id: string;
    name: string;
    symbol: string;
    thumb: string;
    price_btc: number;
    market_cap_rank: number;
    score: number;
  };
}

interface TopGainer {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
}

const MarketOverview: React.FC = () => {
  const [globalData, setGlobalData] = useState<GlobalMarketData | null>(null);
  const [trendingCoins, setTrendingCoins] = useState<TrendingCoin[]>([]);
  const [topGainers, setTopGainers] = useState<TopGainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all data in parallel
        const [globalDataResponse, trendingCoinsResponse, topGainersResponse] = await Promise.all([
          fetchGlobalMarketData(),
          fetchTrendingCoins(),
          fetchTopGainers()
        ]);
        
        setGlobalData(globalDataResponse);
        setTrendingCoins(trendingCoinsResponse);
        setTopGainers(topGainersResponse);
      } catch (err) {
        console.error('Error fetching market overview data:', err);
        setError('Failed to load market data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Refresh data every 5 minutes
    const intervalId = setInterval(fetchData, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

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

  // Format percentage change
  const formatPercentage = (value: number): string => {
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  if (loading) {
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

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
        <p className="text-danger text-center">{error}</p>
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
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex justify-between items-start mb-2">
            <p className="text-gray-500 text-sm">Market Cap</p>
            <span className={`text-xs px-2 py-0.5 rounded-full ${globalData.market_cap_change_percentage_24h_usd >= 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-danger'}`}>
              {formatPercentage(globalData.market_cap_change_percentage_24h_usd)}
            </span>
          </div>
          <p className="text-2xl font-semibold text-darkGray">
            {formatLargeNumber(globalData.total_market_cap.usd)}
          </p>
          
          {/* Small chart visualization */}
          <div className="mt-2 flex items-center">
            <div className="w-full h-4 relative">
              <div className={`absolute inset-0 ${globalData.market_cap_change_percentage_24h_usd >= 0 ? 'bg-green-100' : 'bg-red-100'} rounded h-1 mt-1.5`}></div>
              <div className={`absolute inset-0 ${globalData.market_cap_change_percentage_24h_usd >= 0 ? 'bg-green-500' : 'bg-red-500'} rounded h-1 mt-1.5`} style={{ width: `${Math.min(Math.abs(globalData.market_cap_change_percentage_24h_usd) * 2, 100)}%` }}></div>
            </div>
          </div>
        </div>
        
        {/* 24h Trading Volume */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-500 text-sm">24h Trading Volume</p>
            <FaExchangeAlt className="text-primaryBlue" />
          </div>
          <p className="text-2xl font-semibold text-darkGray">
            {formatLargeNumber(globalData.total_volume.usd)}
          </p>
          
          {/* Visualization of volume as percentage of market cap */}
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-primaryBlue h-1.5 rounded-full" 
                style={{ width: `${Math.min((globalData.total_volume.usd / globalData.total_market_cap.usd) * 100, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {((globalData.total_volume.usd / globalData.total_market_cap.usd) * 100).toFixed(1)}% of market cap
            </p>
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