import React, { useEffect, useState } from 'react';
import { fetchGlobalMarketData, fetchTrendingCoins, fetchTopGainers } from '../utils/fetchCrypto';
import Image from 'next/image';

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

  // Format percentage change
  const formatPercentage = (value: number): string => {
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  if (loading) {
    return (
      <div className="animate-pulse bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-200">
        <div className="h-6 bg-gray-200 rounded mb-4 w-1/3"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
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
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-200">
      <h2 className="text-lg font-medium text-darkGray mb-4">Market Overview</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Global Market Cap */}
        <div className="bg-lightGray rounded-lg p-3">
          <p className="text-sm text-gray-500 mb-1">Market Cap</p>
          <p className="text-darkGray font-medium">
            {formatCurrency(globalData.total_market_cap.usd)}
          </p>
          <p className={`text-xs ${globalData.market_cap_change_percentage_24h_usd >= 0 ? 'text-green-600' : 'text-danger'}`}>
            {formatPercentage(globalData.market_cap_change_percentage_24h_usd)} (24h)
          </p>
        </div>
        
        {/* 24h Trading Volume */}
        <div className="bg-lightGray rounded-lg p-3">
          <p className="text-sm text-gray-500 mb-1">24h Trading Volume</p>
          <p className="text-darkGray font-medium">
            {formatCurrency(globalData.total_volume.usd)}
          </p>
        </div>
        
        {/* Trending Coins */}
        <div className="bg-lightGray rounded-lg p-3">
          <p className="text-sm text-gray-500 mb-1">Trending</p>
          {trendingCoins.length > 0 ? (
            <div className="space-y-2">
              {trendingCoins.slice(0, 3).map((coin) => (
                <div key={coin.item.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-5 h-5 mr-2 relative flex-shrink-0">
                      <Image 
                        src={coin.item.thumb} 
                        alt={coin.item.name} 
                        width={20} 
                        height={20}
                        className="rounded-full"
                      />
                    </div>
                    <span className="text-xs font-medium">{coin.item.symbol}</span>
                  </div>
                  <span className="text-xs">#{coin.item.market_cap_rank}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No data available</p>
          )}
        </div>
        
        {/* Top Gainers */}
        <div className="bg-lightGray rounded-lg p-3">
          <p className="text-sm text-gray-500 mb-1">Top Gainers</p>
          {topGainers.length > 0 ? (
            <div className="space-y-2">
              {topGainers.slice(0, 3).map((coin) => (
                <div key={coin.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-5 h-5 mr-2 relative flex-shrink-0">
                      <Image 
                        src={coin.image} 
                        alt={coin.name} 
                        width={20} 
                        height={20}
                        className="rounded-full"
                      />
                    </div>
                    <span className="text-xs font-medium">{coin.symbol.toUpperCase()}</span>
                  </div>
                  <span className="text-xs text-green-600">
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