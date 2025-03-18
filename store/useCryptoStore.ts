import { create } from 'zustand';
import { fetchGlobalMarketData, fetchMarketChart, fetchTrendingCoins, fetchTopGainers } from '../utils/fetchCrypto';

// Define interfaces for the store
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
    large?: string;
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
  market_cap: number;
  market_cap_rank: number;
}

interface ChartDataPoint {
  timestamp: number;
  value: number;
}

interface MarketChartData {
  marketCap: ChartDataPoint[];
  volume: ChartDataPoint[];
}

interface CryptoState {
  globalData: GlobalMarketData | null;
  trendingCoins: TrendingCoin[];
  topGainers: TopGainer[];
  marketChartData: MarketChartData | null;
  loading: boolean;
  error: string | null;
  lastUpdated: number;
  
  // Actions
  fetchAllData: () => Promise<void>;
  fetchGlobalData: () => Promise<void>;
  fetchMarketChartData: (days?: number) => Promise<void>;
  fetchTrendingCoinsData: (count?: number) => Promise<void>;
  fetchTopGainersData: (count?: number) => Promise<void>;
}

// Create the store
const useCryptoStore = create<CryptoState>((set) => ({
  globalData: null,
  trendingCoins: [],
  topGainers: [],
  marketChartData: null,
  loading: false,
  error: null,
  lastUpdated: 0,
  
  // Fetch all data in parallel
  fetchAllData: async () => {
    try {
      set({ loading: true, error: null });
      
      const [globalData, marketChartData, trendingCoins, topGainers] = await Promise.all([
        fetchGlobalMarketData(),
        fetchMarketChart(7),
        fetchTrendingCoins(),
        fetchTopGainers()
      ]);
      
      set({ 
        globalData,
        marketChartData,
        trendingCoins,
        topGainers,
        loading: false,
        lastUpdated: Date.now()
      });
    } catch (error) {
      console.error('Error fetching all crypto data:', error);
      set({ error: 'Failed to fetch crypto data', loading: false });
    }
  },
  
  // Individual fetch methods for more granular control
  fetchGlobalData: async () => {
    try {
      const globalData = await fetchGlobalMarketData();
      set({ globalData, lastUpdated: Date.now() });
    } catch (error) {
      console.error('Error fetching global data:', error);
      set({ error: 'Failed to fetch global market data' });
    }
  },
  
  fetchMarketChartData: async (days = 7) => {
    try {
      const marketChartData = await fetchMarketChart(days);
      
      // If the API returned empty data, use fallback data
      if (!marketChartData.marketCap.length || !marketChartData.volume.length) {
        // Generate fallback data if needed
        const now = Date.now();
        const fallbackData = {
          marketCap: generateFallbackChartData(now, days, 2.5e12, 3e12),
          volume: generateFallbackChartData(now, days, 80e9, 150e9)
        };
        
        set({ marketChartData: fallbackData, lastUpdated: Date.now() });
        return;
      }
      
      set({ marketChartData, lastUpdated: Date.now() });
    } catch (error) {
      console.error('Error fetching market chart data:', error);
      
      // Generate fallback data on error
      const now = Date.now();
      const fallbackData = {
        marketCap: generateFallbackChartData(now, days, 2.5e12, 3e12),
        volume: generateFallbackChartData(now, days, 80e9, 150e9)
      };
      
      set({ 
        marketChartData: fallbackData, 
        error: 'Failed to fetch market chart data - using simulated data',
        lastUpdated: Date.now()
      });
    }
  },
  
  fetchTrendingCoinsData: async (count = 3) => {
    try {
      const trendingCoins = await fetchTrendingCoins(count);
      set({ trendingCoins, lastUpdated: Date.now() });
    } catch (error) {
      console.error('Error fetching trending coins:', error);
      set({ error: 'Failed to fetch trending coins' });
    }
  },
  
  fetchTopGainersData: async (count = 3) => {
    try {
      const topGainers = await fetchTopGainers(count);
      set({ topGainers, lastUpdated: Date.now() });
    } catch (error) {
      console.error('Error fetching top gainers:', error);
      set({ error: 'Failed to fetch top gainers' });
    }
  }
}));

// Helper function to generate fallback chart data
function generateFallbackChartData(endTime: number, days: number, minValue: number, maxValue: number) {
  const dataPoints: { timestamp: number, value: number }[] = [];
  const interval = 24 * 60 * 60 * 1000; // 1 day in milliseconds
  
  for (let i = days; i >= 0; i--) {
    const timestamp = endTime - (i * interval);
    // Create realistic looking chart data with some randomness
    const randomFactor = 0.9 + (Math.random() * 0.2); // Between 0.9 and 1.1
    const value = (minValue + ((maxValue - minValue) * (1 - i/days))) * randomFactor;
    
    dataPoints.push({
      timestamp,
      value
    });
  }
  
  return dataPoints;
}

export default useCryptoStore; 