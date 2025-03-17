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