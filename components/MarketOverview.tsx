import React, { useEffect, useState } from 'react';
import { fetchGlobalMarketData, fetchTrendingCoins, fetchTopGainers } from '../utils/fetchCrypto';
import Image from 'next/image';
import Link from 'next/link';

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
  const formatLargeNumber = (value: number): string => {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  // Format currency
  const formatCurrency = (value: number): string => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)} Trillion`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)} Billion`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)} Million`;
    return `$${value.toLocaleString()}`;
  };

  // Format percentage change
  const formatPercentage = (value: number): string => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="animate-pulse bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-200">
        <div className="h-6 bg-gray-200 rounded mb-4 w-1/3"></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-200">
        <p className="text-danger text-center">{error}</p>
      </div>
    );
  }

  if (!globalData) return null;

  return (
    <div className="bg-white rounded-lg shadow-soft p-4 mb-6 border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium text-darkGray">Cryptocurrency Prices by Market Cap</h2>
        <div className="flex items-center">
          <span className="text-gray-600 mr-2">Highlights</span>
          <div className="bg-primaryBlue w-12 h-6 rounded-full flex items-center p-1">
            <div className="bg-white w-4 h-4 rounded-full ml-auto"></div>
          </div>
        </div>
      </div>
      
      <p className="text-gray-600 mb-6">
        The global cryptocurrency market cap today is {formatCurrency(globalData.total_market_cap.usd)}, a {' '}
        <span className={globalData.market_cap_change_percentage_24h_usd >= 0 ? 'text-green-600' : 'text-danger'}>
          {globalData.market_cap_change_percentage_24h_usd >= 0 ? '↑' : '↓'} {Math.abs(globalData.market_cap_change_percentage_24h_usd).toFixed(1)}%
        </span> change in the last 24 hours.
        <a href="#" className="text-primaryBlue hover:underline ml-2">Read more</a>
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid grid-cols-1 gap-4">
          {/* Global Market Cap */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h3 className="text-2xl font-bold">${formatLargeNumber(globalData.total_market_cap.usd)}</h3>
            <div className="flex items-center mt-1">
              <span className="text-gray-600">Market Cap</span>
              <span className={`ml-2 ${globalData.market_cap_change_percentage_24h_usd >= 0 ? 'text-green-600' : 'text-danger'}`}>
                {globalData.market_cap_change_percentage_24h_usd >= 0 ? '↑' : '↓'} {Math.abs(globalData.market_cap_change_percentage_24h_usd).toFixed(1)}%
              </span>
            </div>
            <div className="mt-2">
              <img 
                src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCAxMDAgNTAiPgogIDxwYXRoIGZpbGw9IiM0Y2FmNTAiIGQ9Ik0wIDUwIEwgMCAyMCBMIDUgMjUgTCAxMCAxMCBMIDE1IDM1IEwgMjAgMTUgTCAyNSA0MCBMIDMwIDIwIEwgMzUgMzAgTCA0MCAxMCBMIDQ1IDM1IEwgNTAgNSBMIDU1IDMwIEwgNjAgMjAgTCA2NSAzNSBMIDcwIDE1IEwgNzUgNDAgTCA4MCAxMCBMIDg1IDM1IEwgOTAgNSBMIDk1IDQwIEwgMTAwIDI1IEwgMTAwIDUwIFoiLz4KPC9zdmc+" 
                alt="Market Cap Trend" 
                className="w-full h-12"
              />
            </div>
          </div>
          
          {/* 24h Trading Volume */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h3 className="text-2xl font-bold">${formatLargeNumber(globalData.total_volume.usd)}</h3>
            <p className="text-gray-600">24h Trading Volume</p>
            <div className="mt-2">
              <img 
                src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCAxMDAgNTAiPgogIDxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmNTI1MiIgc3Ryb2tlLXdpZHRoPSIyIiBkPSJNMCA1IEwgMTAgMzAgTCAyMCAxNSBMIDMwIDQwIEwgNDAgMjAgTCA1MCAxMCBMIDYwIDM1IEwgNzAgMjAgTCA4MCAxNSBMIDkwIDQwIEwgMTAwIDI1Ii8+Cjwvc3ZnPg==" 
                alt="Trading Volume Trend" 
                className="w-full h-12"
              />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Trending Coins */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <span className="text-orange-500 mr-2">🔥</span>
                <h3 className="font-medium text-darkGray">Trending</h3>
              </div>
              <Link href="#" className="text-primaryBlue text-sm flex items-center">
                View more
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            {trendingCoins.length > 0 ? (
              <div className="space-y-3">
                {trendingCoins.slice(0, 3).map((coin) => (
                  <div key={coin.item.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 mr-2 relative flex-shrink-0">
                        <Image 
                          src={coin.item.thumb} 
                          alt={coin.item.name} 
                          width={32} 
                          height={32}
                          className="rounded-full"
                        />
                      </div>
                      <span className="font-medium">{coin.item.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="block font-medium">${coin.item.price_btc.toFixed(4)}</span>
                      <span className="text-green-600 text-sm">+42.1%</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No data available</p>
            )}
          </div>
          
          {/* Top Gainers */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <span className="text-blue-500 mr-2">🚀</span>
                <h3 className="font-medium text-darkGray">Top Gainers</h3>
              </div>
              <Link href="#" className="text-primaryBlue text-sm flex items-center">
                View more
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            {topGainers.length > 0 ? (
              <div className="space-y-3">
                {topGainers.slice(0, 3).map((coin) => (
                  <div key={coin.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 mr-2 relative flex-shrink-0">
                        <Image 
                          src={coin.image} 
                          alt={coin.name} 
                          width={32} 
                          height={32}
                          className="rounded-full"
                        />
                      </div>
                      <span className="font-medium">{coin.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="block font-medium">${coin.current_price.toFixed(2)}</span>
                      <span className="text-green-600 text-sm">
                        +{Math.abs(coin.price_change_percentage_24h).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No data available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketOverview; 