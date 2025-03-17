import axios from 'axios';
import { mockCryptoData } from './mockData';
import { generateMockHistoryForCoin, mockHistoryMap } from './mockHistoryData';

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

export const fetchCryptoData = async (): Promise<CryptoData[]> => {
  try {
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false',
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        timeout: 10000 // 10 second timeout
      }
    );

    if (!response.data || !Array.isArray(response.data)) {
      console.error('Invalid response format:', response.data);
      return USE_MOCK_ON_FAILURE ? mockCryptoData : [];
    }

    // Clean up and transform the data
    const cryptoData = response.data.map((coin: any) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      image: coin.image,
      current_price: coin.current_price,
      price_change_percentage_24h: coin.price_change_percentage_24h || 0,
      market_cap: coin.market_cap
    }));

    return cryptoData;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error fetching crypto data:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      
      // Check for rate limiting (common with CoinGecko free tier)
      if (error.response?.status === 429) {
        console.error('Rate limit exceeded. Using mock data instead.');
        return mockCryptoData;
      }
    } else {
      console.error('Error fetching crypto data:', error);
    }
    
    // Return mock data if configured to do so
    return USE_MOCK_ON_FAILURE ? mockCryptoData : [];
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