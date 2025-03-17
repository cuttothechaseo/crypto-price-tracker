import axios from 'axios';
import { mockCryptoData } from './mockData';
import { generateMockHistoryForCoin, mockHistoryMap } from './mockHistoryData';
import { CryptoCoin } from '../types';

export interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
}

export interface PriceHistoryData {
  timestamp: number;
  price: number;
}

// Flag to control whether to use mock data when API fails
const USE_MOCK_ON_FAILURE = true;

// Track API request timestamps to avoid rate limiting
let lastApiRequest = 0;
const MIN_REQUEST_INTERVAL = 10000; // 10 seconds between requests

// Fetch cryptocurrency market data
export async function fetchCryptoData(): Promise<CryptoCoin[]> {
  try {
    // Check if we're making requests too frequently
    const now = Date.now();
    if (now - lastApiRequest < MIN_REQUEST_INTERVAL) {
      console.warn('API requests too frequent, waiting before making a new request');
      await new Promise(resolve => setTimeout(resolve, MIN_REQUEST_INTERVAL));
    }
    
    lastApiRequest = Date.now();
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
        timeout: 15000 // 15 second timeout
      }
    );
    
    if (!response.data || !Array.isArray(response.data)) {
      console.error('Invalid response format from CoinGecko API');
      throw new Error('Invalid response format');
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    throw error;
  }
}

// Fetch global market data
export async function fetchGlobalMarketData() {
  try {
    // Check if we're making requests too frequently
    const now = Date.now();
    if (now - lastApiRequest < MIN_REQUEST_INTERVAL) {
      console.warn('API requests too frequent, waiting before making a new request');
      await new Promise(resolve => setTimeout(resolve, MIN_REQUEST_INTERVAL));
    }
    
    lastApiRequest = Date.now();
    
    const response = await axios.get('https://api.coingecko.com/api/v3/global', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      timeout: 15000
    });
    
    if (!response.data || !response.data.data) {
      console.error('Invalid global market data response format');
      throw new Error('Invalid global market data response');
    }
    
    return response.data.data;
  } catch (error) {
    console.error('Error fetching global market data:', error);
    throw error;
  }
}

// Fetch trending coins data
export async function fetchTrendingCoins(): Promise<CryptoCoin[]> {
  try {
    // Check if we're making requests too frequently
    const now = Date.now();
    if (now - lastApiRequest < MIN_REQUEST_INTERVAL) {
      console.warn('API requests too frequent, waiting before making a new request');
      await new Promise(resolve => setTimeout(resolve, MIN_REQUEST_INTERVAL));
    }
    
    lastApiRequest = Date.now();
    
    // First get the trending coin ids
    const trendingResponse = await axios.get('https://api.coingecko.com/api/v3/search/trending', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      timeout: 15000
    });
    
    if (!trendingResponse.data || !trendingResponse.data.coins) {
      console.error('Invalid trending coins response format');
      throw new Error('Invalid trending coins response');
    }
    
    const coinIds = trendingResponse.data.coins
      .map((coin: any) => coin.item.id)
      .slice(0, 7);
    
    if (coinIds.length === 0) {
      console.warn('No trending coin IDs found');
      return [];
    }
    
    // Small delay between API calls to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
    lastApiRequest = Date.now();
    
    // Then fetch detailed data for those coins
    const idsParam = coinIds.join(',');
    const detailedResponse = await axios.get(
      'https://api.coingecko.com/api/v3/coins/markets',
      {
        params: {
          vs_currency: 'usd',
          ids: idsParam,
        },
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        timeout: 15000
      }
    );
    
    if (!detailedResponse.data || !Array.isArray(detailedResponse.data)) {
      console.error('Invalid coin details response format');
      throw new Error('Invalid coin details response');
    }
    
    return detailedResponse.data;
  } catch (error) {
    console.error('Error fetching trending coins:', error);
    throw error;
  }
}

// Get top gainers from a list of coins
export function getTopGainers(coins: CryptoCoin[], limit: number = 3): CryptoCoin[] {
  return [...coins]
    .filter(coin => !isNaN(coin.price_change_percentage_24h))
    .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
    .slice(0, limit);
}

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
      return getMockHistoryData(coinId, days);
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
    
    return USE_MOCK_ON_FAILURE ? getMockHistoryData(coinId, days) : [];
  }
};

// Helper function to get mock historical data for a specific coin
function getMockHistoryData(coinId: string, days: number = 7): PriceHistoryData[] {
  // Check if we have pre-generated mock data for this coin
  if (mockHistoryMap[coinId]) {
    // If we need different timeframe than the default 7 days
    if (days !== 7) {
      const coin = mockCryptoData.find(c => c.id === coinId);
      const basePrice = coin ? coin.current_price : 1000;
      const trend = coin ? (coin.price_change_percentage_24h / 100) : 0;
      
      return generateMockHistoryForCoin(basePrice, 0.05, trend, days);
    }
    
    return mockHistoryMap[coinId];
  }
  
  // If no pre-generated data, create some based on the coin's current price
  const coin = mockCryptoData.find(c => c.id === coinId);
  const basePrice = coin ? coin.current_price : 1000;
  const trend = coin ? (coin.price_change_percentage_24h / 100) : 0;
  
  return generateMockHistoryForCoin(basePrice, 0.05, trend, days);
} 