import axios from 'axios';
import { CryptoCoin, PriceHistoryData } from '../types';

// Constants for API request
const MIN_REQUEST_INTERVAL = 10000; // 10 seconds between requests
let lastApiRequest = 0;

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
    
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/coins/markets',
      {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: 100,
          page: 1,
          sparkline: true,
          price_change_percentage: '7d',
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
    
    // Check if we have cached data that's still fresh (5 minutes)
    if (globalMarketCache.data && now - globalMarketCache.timestamp < 5 * 60 * 1000) {
      return globalMarketCache.data;
    }
    
    const response = await axios.get("https://api.coingecko.com/api/v3/global", {
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
    
    // Return cached data if available, otherwise return empty object
    return globalMarketCache.data || {
      total_market_cap: { usd: 0 },
      total_volume: { usd: 0 },
      market_cap_percentage: {},
      market_cap_change_percentage_24h_usd: 0
    };
  }
}

// Store trending coins cache
const trendingCoinsCache: { data: any[], timestamp: number } = { data: [], timestamp: 0 };

/**
 * Fetches trending coins data
 */
export async function fetchTrendingCoins() {
  try {
    const now = Date.now();
    
    // Check if we have cached data that's still fresh (15 minutes)
    if (trendingCoinsCache.data.length > 0 && now - trendingCoinsCache.timestamp < 15 * 60 * 1000) {
      return trendingCoinsCache.data;
    }
    
    const response = await axios.get("https://api.coingecko.com/api/v3/search/trending", {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      timeout: 10000
    });
    
    if (!response.data || !response.data.coins || !Array.isArray(response.data.coins)) {
      throw new Error('Invalid response format');
    }
    
    // Cache the data
    trendingCoinsCache.data = response.data.coins.slice(0, 3);
    trendingCoinsCache.timestamp = now;
    
    return response.data.coins.slice(0, 3);
  } catch (error) {
    console.error('Error fetching trending coins:', error);
    
    // Return cached data if available, otherwise return empty array
    return trendingCoinsCache.data || [];
  }
}

// Store top gainers cache
const topGainersCache: { data: any[], timestamp: number } = { data: [], timestamp: 0 };

/**
 * Fetches top gaining coins data
 */
export async function fetchTopGainers() {
  try {
    const now = Date.now();
    
    // Check if we have cached data that's still fresh (15 minutes)
    if (topGainersCache.data.length > 0 && now - topGainersCache.timestamp < 15 * 60 * 1000) {
      return topGainersCache.data;
    }
    
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/coins/markets", 
      {
        params: {
          vs_currency: 'usd',
          order: 'percent_change_24h_desc',
          per_page: 3,
          page: 1,
          sparkline: false
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
    
    // Cache the data
    topGainersCache.data = response.data;
    topGainersCache.timestamp = now;
    
    return response.data;
  } catch (error) {
    console.error('Error fetching top gainers:', error);
    
    // Return cached data if available, otherwise return empty array
    return topGainersCache.data || [];
  }
} 