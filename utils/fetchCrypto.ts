import axios from 'axios';
import { mockCryptoData } from './mockData';
import { generateMockHistoryForCoin, mockHistoryMap } from './mockHistoryData';
import { CryptoCoin } from '../types';
import { mockGlobalData } from './mockGlobalData';

// We're using the same interface for both the API response and our internal data type
export type CryptoData = CryptoCoin;

export interface PriceHistoryData {
  timestamp: number;
  price: number;
}

// Flag to control whether to use mock data when API fails
const USE_MOCK_ON_FAILURE = true;

// Define a global pending requests tracking mechanism
type RequestType = 'markets' | 'global' | 'trending' | 'coin';
const pendingRequests: Record<RequestType, Promise<any> | null> = {
  markets: null,
  global: null,
  trending: null,
  coin: null
};

// Function to log API status for monitoring
function logApiStatus(endpoint: string, success: boolean, error?: any) {
  if (success) {
    console.log(`✅ CoinGecko API (${endpoint}) is responding normally`);
  } else {
    console.warn(`⚠️ CoinGecko API (${endpoint}) request failed: ${error?.message || 'Unknown error'}`);
  }
}

// Fetch cryptocurrency market data
export async function fetchCryptoData(): Promise<CryptoCoin[]> {
  try {
    // If there's already a pending request for this endpoint, return that instead of making a new one
    if (pendingRequests.markets) {
      console.log('Using existing pending request for markets data');
      return await pendingRequests.markets;
    }

    console.log('Fetching cryptocurrency data from CoinGecko API...');
    
    // Create a new request and store the promise
    const requestPromise = axios.get('/api/crypto?endpoint=markets', {
      timeout: 20000 // 20 second timeout
    })
    .then(response => {
      if (!response.data || !Array.isArray(response.data)) {
        console.error('Invalid response format from API');
        throw new Error('Invalid response format');
      }
      logApiStatus('markets', true);
      return response.data;
    })
    .finally(() => {
      // Clear the pending request once it's completed (success or error)
      pendingRequests.markets = null;
    });
    
    // Store the promise so concurrent calls can use it
    pendingRequests.markets = requestPromise;
    
    return await requestPromise;
  } catch (error) {
    logApiStatus('markets', false, error);
    console.error('Error fetching crypto data:', error);
    
    // Use mock data if enabled and actual request failed
    if (USE_MOCK_ON_FAILURE) {
      console.log('Using mock cryptocurrency data as fallback');
      return mockCryptoData as CryptoCoin[];
    }
    
    throw error;
  }
}

// Fetch global market data
export async function fetchGlobalMarketData() {
  try {
    // If there's already a pending request for this endpoint, return that instead of making a new one
    if (pendingRequests.global) {
      console.log('Using existing pending request for global market data');
      return await pendingRequests.global;
    }
    
    // Create a new request and store the promise
    const requestPromise = axios.get('/api/crypto?endpoint=global', {
      timeout: 20000
    })
    .then(response => {
      if (!response.data || !response.data.data) {
        console.error('Invalid global market data response format');
        throw new Error('Invalid global market data response');
      }
      logApiStatus('global', true);
      return response.data.data;
    })
    .finally(() => {
      // Clear the pending request once it's completed
      pendingRequests.global = null;
    });
    
    // Store the promise so concurrent calls can use it
    pendingRequests.global = requestPromise;
    
    return await requestPromise;
  } catch (error) {
    logApiStatus('global', false, error);
    console.error('Error fetching global market data:', error);
    
    // Use mock data if enabled and actual request failed
    if (USE_MOCK_ON_FAILURE) {
      console.log('Using mock global market data as fallback');
      return mockGlobalData;
    }
    
    throw error;
  }
}

// Fetch trending coins data
export async function fetchTrendingCoins(): Promise<CryptoCoin[]> {
  try {
    // If there's already a pending request for this endpoint, return that instead of making a new one
    if (pendingRequests.trending) {
      console.log('Using existing pending request for trending coins');
      return await pendingRequests.trending;
    }
    
    // Create a new request and store the promise
    const requestPromise = axios.get('/api/crypto?endpoint=trending', {
      timeout: 20000
    })
    .then(async response => {
      if (!response.data || !response.data.coins) {
        console.error('Invalid trending coins response format');
        throw new Error('Invalid trending coins response');
      }
      
      const coinIds = response.data.coins
        .map((coin: any) => coin.item.id)
        .slice(0, 7);
      
      if (coinIds.length === 0) {
        console.warn('No trending coin IDs found');
        return [];
      }
      
      // Then fetch detailed data for those coins using our proxy
      const idsParam = coinIds.join(',');
      const detailedResponse = await axios.get('/api/crypto', {
        params: {
          endpoint: 'markets',
          ids: idsParam,
        },
        timeout: 20000
      });
      
      if (!detailedResponse.data || !Array.isArray(detailedResponse.data)) {
        console.error('Invalid coin details response format');
        throw new Error('Invalid coin details response');
      }
      
      logApiStatus('trending', true);
      return detailedResponse.data;
    })
    .finally(() => {
      // Clear the pending request once it's completed
      pendingRequests.trending = null;
    });
    
    // Store the promise so concurrent calls can use it
    pendingRequests.trending = requestPromise;
    
    return await requestPromise;
  } catch (error) {
    logApiStatus('trending', false, error);
    console.error('Error fetching trending coins:', error);
    
    // Use mock data if enabled and actual request failed
    if (USE_MOCK_ON_FAILURE) {
      console.log('Using mock trending coins data as fallback');
      // Return top 7 coins by market cap as trending coins
      return mockCryptoData
        .slice(0, 7)
        .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h) as CryptoCoin[];
    }
    
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
    
    // If there's already a pending request for this coin, return that instead of making a new one
    const coinRequestKey = `coin-${coinId}-${days}` as RequestType;
    if (pendingRequests.coin) {
      console.log(`Using existing pending request for coin ${coinId}`);
      return await pendingRequests.coin;
    }
    
    // Create a new request and store the promise
    const requestPromise = axios.get('/api/crypto', {
      params: {
        endpoint: 'coin',
        id: coinId,
        days: days
      },
      timeout: 20000
    })
    .then(response => {
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
    })
    .finally(() => {
      // Clear the pending request once it's completed
      pendingRequests.coin = null;
    });
    
    // Store the promise so concurrent calls can use it
    pendingRequests.coin = requestPromise;
    
    return await requestPromise;
  } catch (error) {
    console.error('Error fetching historical data:', error);
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