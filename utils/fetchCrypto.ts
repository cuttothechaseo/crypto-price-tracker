import axios from 'axios';
import { CryptoCoin, PriceHistoryData } from '../types';

// Constants for API request
const MIN_REQUEST_INTERVAL = 60000; // Increase to 60 seconds between requests
let lastApiRequest = 0;
const API_KEY = process.env.NEXT_PUBLIC_COINGECKO_API_KEY || ''; // Optional API key

// Add retry mechanism with exponential backoff
const fetchWithRetry = async (url: string, options = {}, maxRetries = 2) => {
  let retries = 0;
  while (retries <= maxRetries) {
    try {
      // Add a proxy URL if in development mode to bypass CORS
      const finalUrl = process.env.NODE_ENV === 'development' 
        ? `/api/proxy?url=${encodeURIComponent(url)}`
        : url;
        
      const response = await axios(finalUrl, options);
      return response;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 429) {
        // If rate limited, wait longer before retrying
        const delay = Math.pow(2, retries) * 1000;
        console.warn(`Rate limited by CoinGecko API. Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        retries++;
      } else {
        throw error;
      }
    }
  }
  throw new Error('Max retries exceeded');
};

/**
 * Fetches cryptocurrency data from the CoinGecko API
 */
export const fetchCryptoData = async (): Promise<CryptoCoin[]> => {
  try {
    // Check if we're making requests too frequently
    const now = Date.now();
    if (now - lastApiRequest < MIN_REQUEST_INTERVAL) {
      console.warn('API requests too frequent, throttling');
      return [];
    }
    
    lastApiRequest = now;
    console.log('Fetching cryptocurrency data from CoinGecko API...');
    
    try {
      const response = await fetchWithRetry(
        'https://api.coingecko.com/api/v3/coins/markets',
        {
          params: {
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: 100,
            page: 1,
            sparkline: true,
            price_change_percentage: '7d',
            x_cg_demo_api_key: API_KEY,
          },
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          timeout: 10000 // 10 second timeout
        }
      );

      if (!response.data || !Array.isArray(response.data)) {
        console.error('Invalid response format:', response.data);
        return [];
      }

      return response.data;
    } catch (error) {
      console.error('Error fetching crypto data:', error);
      return [];
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error fetching crypto data:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      
      // Handle rate limiting (common with CoinGecko free tier)
      if (error.response?.status === 429) {
        console.error('Rate limit exceeded.');
      }
      
      // Handle timeout errors more specifically
      if (error.code === 'ECONNABORTED') {
        console.error('API request timed out.');
      }
    } else {
      console.error('Error fetching crypto data:', error);
    }
    
    return [];
  }
};

// Store historical data cache to minimize API calls
const historyCache: Record<string, { data: PriceHistoryData[], timestamp: number }> = {};
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

// Function to fetch historical price data for a specific coin
export const fetchCryptoHistory = async (coinId: string, days: number = 7): Promise<PriceHistoryData[]> => {
  try {
    // Check if we have cached data that's still fresh
    const cacheKey = `${coinId}-${days}`;
    const cachedData = historyCache[cacheKey];
    const now = Date.now();
    
    if (cachedData && now - cachedData.timestamp < CACHE_DURATION) {
      console.log(`Using cached historical data for ${coinId}`);
      return cachedData.data;
    }
    
    // If no cached data or cache is stale, fetch from API
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        timeout: 10000
      }
    );

    if (!response.data || !response.data.prices || !Array.isArray(response.data.prices)) {
      console.error('Invalid historical data response:', response.data);
      return [];
    }

    // Transform the data
    const historyData = response.data.prices.map((priceData: [number, number]) => ({
      timestamp: priceData[0],
      price: priceData[1]
    }));

    // Cache the data
    historyCache[cacheKey] = {
      data: historyData,
      timestamp: now
    };

    return historyData;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error fetching historical data:', {
        coinId,
        message: error.message,
        status: error.response?.status
      });
      
      // Handle rate limiting
      if (error.response?.status === 429) {
        console.error('Rate limit exceeded for historical data.');
      }
    } else {
      console.error('Error fetching historical data:', error);
    }
    
    return [];
  }
};

// Store global market data cache
const globalMarketCache: { data: any, timestamp: number } = { data: null, timestamp: 0 };

/**
 * Fetches global cryptocurrency market data
 */
export async function fetchGlobalMarketData() {
  try {
    const now = Date.now();
    
    // Check if we're making requests too frequently
    if (now - lastApiRequest < MIN_REQUEST_INTERVAL) {
      console.warn('API requests too frequent, using cached data or fallback');
      return globalMarketCache.data || generateGlobalMarketFallbackData();
    }
    
    lastApiRequest = now;
    
    // Check if we have cached data that's still fresh (5 minutes)
    if (globalMarketCache.data && now - globalMarketCache.timestamp < 5 * 60 * 1000) {
      return globalMarketCache.data;
    }
    
    try {
      const response = await fetchWithRetry("https://api.coingecko.com/api/v3/global", {
        params: {
          x_cg_demo_api_key: API_KEY,
        },
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        timeout: 10000
      });
      
      if (!response.data || !response.data.data) {
        throw new Error('Invalid response format');
      }
      
      // Cache the data
      globalMarketCache.data = response.data.data;
      globalMarketCache.timestamp = now;
      
      return response.data.data;
    } catch (error) {
      console.error('Error fetching global market data:', error);
      
      // Return cached data if available, otherwise return fallback data
      return globalMarketCache.data || generateGlobalMarketFallbackData();
    }
  } catch (error) {
    console.error('Error in global market data flow:', error);
    
    // Return cached data if available, otherwise return fallback data
    return globalMarketCache.data || generateGlobalMarketFallbackData();
  }
}

// Generate realistic fallback data for global market
function generateGlobalMarketFallbackData() {
  const marketCap = 2.83e12; // $2.83 trillion
  const volume = 83.4e9;     // $83.4 billion
  const btcDominance = 51.2;  // 51.2%
  const ethDominance = 16.8;  // 16.8%
  
  // Random value between -1.5 and +1.5
  const change = (Math.random() * 3 - 1.5).toFixed(2);
  
  return {
    total_market_cap: { usd: marketCap },
    total_volume: { usd: volume },
    market_cap_percentage: { 
      btc: btcDominance,
      eth: ethDominance
    },
    market_cap_change_percentage_24h_usd: parseFloat(change)
  };
}

// Store trending coins cache
const trendingCoinsCache: { data: any[], timestamp: number } = { data: [], timestamp: 0 };

/**
 * Fetches trending coins data
 * @param count Number of trending coins to return (default is 3 for dashboard)
 */
export async function fetchTrendingCoins(count: number = 3) {
  try {
    const now = Date.now();
    
    // Check if we're making requests too frequently
    if (now - lastApiRequest < MIN_REQUEST_INTERVAL) {
      console.warn('API requests too frequent, using cached trending data');
      return trendingCoinsCache.data.slice(0, count) || [];
    }
    
    lastApiRequest = now;
    
    // Check if we have cached data that's still fresh (15 minutes)
    if (trendingCoinsCache.data.length > 0 && now - trendingCoinsCache.timestamp < 15 * 60 * 1000) {
      return trendingCoinsCache.data.slice(0, count);
    }
    
    try {
      const response = await fetchWithRetry("https://api.coingecko.com/api/v3/search/trending", {
        params: {
          x_cg_demo_api_key: API_KEY,
        },
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        timeout: 10000
      });
      
      if (!response.data || !response.data.coins || !Array.isArray(response.data.coins)) {
        throw new Error('Invalid response format');
      }
      
      // Cache all trending coins
      trendingCoinsCache.data = response.data.coins;
      trendingCoinsCache.timestamp = now;
      
      return response.data.coins.slice(0, count);
    } catch (error) {
      console.error('Error fetching trending coins:', error);
      
      // Return cached data if available, otherwise return empty array
      return trendingCoinsCache.data.slice(0, count) || [];
    }
  } catch (error) {
    console.error('Error in trending coins flow:', error);
    return trendingCoinsCache.data.slice(0, count) || [];
  }
}

// Store top gainers cache
const topGainersCache: { data: any[], timestamp: number } = { data: [], timestamp: 0 };

/**
 * Fetches top gaining coins data
 * @param count Number of top gainers to return (default is 3 for dashboard)
 */
export async function fetchTopGainers(count: number = 3) {
  try {
    const now = Date.now();
    
    // Check if we're making requests too frequently
    if (now - lastApiRequest < MIN_REQUEST_INTERVAL) {
      console.warn('API requests too frequent, using cached top gainers data');
      return topGainersCache.data.slice(0, count) || [];
    }
    
    lastApiRequest = now;
    
    // Check if we have cached data that's still fresh (15 minutes)
    if (topGainersCache.data.length > 0 && now - topGainersCache.timestamp < 15 * 60 * 1000) {
      // If we need more items than we have cached, make a new request
      if (count > topGainersCache.data.length && now - lastApiRequest >= MIN_REQUEST_INTERVAL) {
        // Will proceed to make a new request
      } else {
        return topGainersCache.data.slice(0, count);
      }
    }
    
    try {
      const response = await fetchWithRetry(
        "https://api.coingecko.com/api/v3/coins/markets", 
        {
          params: {
            vs_currency: 'usd',
            order: 'percent_change_24h_desc',
            per_page: Math.max(count, 10), // Always fetch at least 10 to have good cache
            page: 1,
            sparkline: false,
            x_cg_demo_api_key: API_KEY,
          },
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          timeout: 10000
        }
      );
      
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid response format');
      }
      
      // Cache all fetched gainers
      topGainersCache.data = response.data;
      topGainersCache.timestamp = now;
      
      return response.data.slice(0, count);
    } catch (error) {
      console.error('Error fetching top gainers:', error);
      
      // Return cached data if available, otherwise return empty array
      return topGainersCache.data.slice(0, count) || [];
    }
  } catch (error) {
    console.error('Error in top gainers flow:', error);
    return topGainersCache.data.slice(0, count) || [];
  }
}

// Store market chart data cache
const marketChartCache: { data: any, timestamp: number } = { data: null, timestamp: 0 };

/**
 * Fetches 7-day historical market cap and volume data
 */
export async function fetchMarketChart(days: number = 7) {
  try {
    const now = Date.now();
    
    // Check if we're making requests too frequently
    if (now - lastApiRequest < MIN_REQUEST_INTERVAL) {
      console.warn('API requests too frequent, using cached chart data');
      return marketChartCache.data || { 
        marketCap: generateFallbackChartData(Date.now(), days, 2.5e12, 3e12),
        volume: generateFallbackChartData(Date.now(), days, 80e9, 150e9)
      };
    }
    
    lastApiRequest = now;
    
    // Check if we have cached data that's still fresh (30 minutes)
    if (marketChartCache.data && now - marketChartCache.timestamp < 30 * 60 * 1000) {
      return marketChartCache.data;
    }
    
    try {
      // CoinGecko doesn't have a direct endpoint for global market cap history
      // We'll use Bitcoin data as a proxy since it represents a large portion of the market
      // and its trends generally reflect overall market movement
      const response = await fetchWithRetry(
        `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart`,
        {
          params: {
            vs_currency: 'usd',
            days: days,
            interval: 'daily',
            x_cg_demo_api_key: API_KEY,
          },
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          timeout: 10000
        }
      );
      
      if (!response.data || !response.data.market_caps || !response.data.total_volumes) {
        throw new Error('Invalid market chart data format');
      }
      
      // Transform the data for easier consumption by charts
      const transformedData = {
        marketCap: response.data.market_caps.map((item: [number, number]) => ({
          timestamp: item[0],
          value: item[1] * 2.5 // Scale up to approximate global market (Bitcoin is ~40% of market)
        })),
        volume: response.data.total_volumes.map((item: [number, number]) => ({
          timestamp: item[0],
          value: item[1] * 3 // Scale up to approximate global volume
        }))
      };
      
      // Cache the data
      marketChartCache.data = transformedData;
      marketChartCache.timestamp = now;
      
      return transformedData;
    } catch (error) {
      console.error('Error fetching market chart data:', error);
      
      // Return cached data if available, otherwise return generated data
      return marketChartCache.data || { 
        marketCap: generateFallbackChartData(Date.now(), days, 2.5e12, 3e12),
        volume: generateFallbackChartData(Date.now(), days, 80e9, 150e9)
      };
    }
  } catch (error) {
    console.error('Error in market chart flow:', error);
    
    // Return cached data if available, otherwise return empty arrays
    return marketChartCache.data || { 
      marketCap: generateFallbackChartData(Date.now(), days, 2.5e12, 3e12),
      volume: generateFallbackChartData(Date.now(), days, 80e9, 150e9)
    };
  }
}

// Generate fallback chart data
function generateFallbackChartData(endTime: number, days: number, minValue: number, maxValue: number) {
  const dataPoints: { timestamp: number, value: number }[] = [];
  const interval = 24 * 60 * 60 * 1000; // 1 day in milliseconds
  const startTime = endTime - (days * interval);
  
  // Create a realistic trend with some randomness but gradual changes
  let previousValue = minValue + ((maxValue - minValue) * 0.5); // Start in the middle of the range
  
  for (let i = days; i >= 0; i--) {
    const timestamp = startTime + ((days - i) * interval);
    
    // Apply a small random change to previous value (between -1.5% and +1.5%)
    const changePercent = (Math.random() * 3 - 1.5) / 100;
    const value = previousValue * (1 + changePercent);
    
    // Keep value within desired range
    previousValue = Math.max(minValue, Math.min(maxValue, value));
    
    dataPoints.push({
      timestamp,
      value: previousValue
    });
  }
  
  return dataPoints;
} 