import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";

// Utility functions for formatting
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
    notation: "compact",
    compactDisplay: "short",
  }).format(value);
};

const formatPercent = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100);
};

interface GlobalData {
  total_market_cap: { usd: number };
  total_volume: { usd: number };
  market_cap_percentage: { btc: number; eth: number };
  market_cap_change_percentage_24h_usd: number;
}

interface TrendingCoin {
  item: {
    id: string;
    name: string;
    symbol: string;
    thumb: string;
    small: string;
    price_btc: number;
    score: number;
  };
}

interface TopGainer {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
}

const MarketOverview: React.FC = () => {
  const [globalData, setGlobalData] = useState<GlobalData | null>(null);
  const [trendingCoins, setTrendingCoins] = useState<TrendingCoin[]>([]);
  const [topGainers, setTopGainers] = useState<TopGainer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch global data
        const globalResponse = await axios.get(
          "https://api.coingecko.com/api/v3/global"
        );
        setGlobalData(globalResponse.data.data);

        // Fetch trending coins
        const trendingResponse = await axios.get(
          "https://api.coingecko.com/api/v3/search/trending"
        );
        setTrendingCoins(trendingResponse.data.coins.slice(0, 4));

        // Fetch top coins to find gainers
        const coinsResponse = await axios.get(
          "https://api.coingecko.com/api/v3/coins/markets",
          {
            params: {
              vs_currency: "usd",
              order: "market_cap_desc",
              per_page: 100,
              page: 1,
              sparkline: false,
              price_change_percentage: "24h",
            },
          }
        );

        // Sort by price change percentage to get top gainers
        const sortedGainers = [...coinsResponse.data]
          .sort(
            (a, b) =>
              b.price_change_percentage_24h - a.price_change_percentage_24h
          )
          .slice(0, 4);

        setTopGainers(sortedGainers);
      } catch (err) {
        console.error("Error fetching market data:", err);
        setError("Failed to fetch market data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();

    // Refresh data every 5 minutes
    const interval = setInterval(fetchMarketData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-beige border-2 border-deepOrange/30 rounded-lg shadow-vintage mb-8 p-6 flex justify-center items-center min-h-[200px]">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-deepOrange rounded-full border-t-transparent animate-spin mb-4"></div>
          <p className="text-deepOrange font-serif italic">
            Fetching market insights...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-beige border-2 border-deepOrange/30 rounded-lg shadow-vintage mb-8 p-6">
        <div className="text-deepOrange text-center">
          <h3 className="text-xl mb-2 font-serif">Market Data Unavailable</h3>
          <p className="font-body">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-beige border-2 border-deepOrange/30 rounded-lg shadow-vintage mb-8 p-6">
      <h2 className="text-2xl font-serif text-deepOrange text-center mb-6 relative">
        <span className="relative">
          Market Overview
          <svg
            className="absolute -bottom-2 left-0 right-0 mx-auto"
            width="180"
            height="8"
          >
            <line
              x1="0"
              y1="4"
              x2="180"
              y2="4"
              stroke="#AD4B12"
              strokeWidth="2"
              strokeDasharray="1 3"
            />
          </svg>
        </span>
      </h2>

      {globalData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-beige/50 border border-deepOrange/20 rounded-lg p-4 shadow-sm">
            <div className="flex flex-col space-y-4">
              <h3 className="text-xl font-serif text-deepOrange">
                Market Statistics
              </h3>
              <div className="border-b border-deepOrange/20 my-2"></div>

              <div className="flex justify-between items-center">
                <span className="text-darkBlueGray font-body">
                  Total Market Cap:
                </span>
                <span className="font-medium text-deepOrange">
                  {formatCurrency(globalData.total_market_cap.usd)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-darkBlueGray font-body">
                  24h Market Cap Change:
                </span>
                <span
                  className={`font-medium ${
                    globalData.market_cap_change_percentage_24h_usd >= 0
                      ? "text-teal"
                      : "text-redOrange"
                  }`}
                >
                  {formatPercent(
                    globalData.market_cap_change_percentage_24h_usd
                  )}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-darkBlueGray font-body">
                  24h Trading Volume:
                </span>
                <span className="font-medium text-deepOrange">
                  {formatCurrency(globalData.total_volume.usd)}
                </span>
              </div>

              <div className="border-b border-deepOrange/20 my-2"></div>

              <div className="flex justify-between items-center">
                <span className="text-darkBlueGray font-body">
                  BTC Dominance:
                </span>
                <span className="font-medium text-deepOrange">
                  {formatPercent(globalData.market_cap_percentage.btc)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-darkBlueGray font-body">
                  ETH Dominance:
                </span>
                <span className="font-medium text-deepOrange">
                  {formatPercent(globalData.market_cap_percentage.eth)}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-rows-2 gap-6">
            <div className="bg-beige/50 border border-deepOrange/20 rounded-lg p-4 shadow-sm">
              <h3 className="text-xl font-serif text-deepOrange mb-2">
                Trending Coins
              </h3>
              <div className="border-b border-deepOrange/20 my-2"></div>
              <div className="grid grid-cols-2 gap-4">
                {trendingCoins.map((coin) => (
                  <div
                    key={coin.item.id}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-cream transition-colors duration-200"
                  >
                    <div className="relative w-8 h-8 flex-shrink-0 bg-white rounded-full p-1 border border-deepOrange/20">
                      <img
                        src={coin.item.small}
                        alt={coin.item.name}
                        className="rounded-full"
                        width={32}
                        height={32}
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-deepOrange">
                        {coin.item.symbol.toUpperCase()}
                      </span>
                      <span className="text-xs text-darkBlueGray truncate font-body">
                        {coin.item.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-beige/50 border border-deepOrange/20 rounded-lg p-4 shadow-sm">
              <h3 className="text-xl font-serif text-deepOrange mb-2">
                Top Gainers
              </h3>
              <div className="border-b border-deepOrange/20 my-2"></div>
              <div className="grid grid-cols-2 gap-4">
                {topGainers.map((coin) => (
                  <div
                    key={coin.id}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-cream transition-colors duration-200"
                  >
                    <div className="relative w-8 h-8 flex-shrink-0 bg-white rounded-full p-1 border border-deepOrange/20">
                      <img
                        src={coin.image}
                        alt={coin.name}
                        className="rounded-full"
                        width={32}
                        height={32}
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-deepOrange">
                        {coin.symbol.toUpperCase()}
                      </span>
                      <span className="text-teal text-xs font-body">
                        +{coin.price_change_percentage_24h.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketOverview;
