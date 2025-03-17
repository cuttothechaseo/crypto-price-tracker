import { PriceHistoryData } from './fetchCrypto';

// Helper function to generate synthetic price history data
export function generateMockHistoryForCoin(
  basePrice: number, 
  volatility: number, 
  trend: number, 
  days: number = 7
): PriceHistoryData[] {
  const data: PriceHistoryData[] = [];
  const now = Date.now();
  const intervals = days * 24; // One data point per hour
  
  let currentPrice = basePrice;
  
  for (let i = intervals; i >= 0; i--) {
    // Calculate timestamp for this data point
    const timestamp = now - (i * 3600 * 1000); // hour intervals
    
    // Add some random movement with a general trend
    const randomChange = (Math.random() - 0.5) * volatility * currentPrice;
    const trendChange = (trend / intervals) * currentPrice;
    currentPrice = currentPrice + randomChange + trendChange;
    
    // Ensure price doesn't go negative
    if (currentPrice < 0.01) currentPrice = 0.01;
    
    data.push({
      timestamp,
      price: currentPrice
    });
  }
  
  return data;
}

// Generate mock history data for the top 10 cryptocurrencies
export const mockHistoryMap: Record<string, PriceHistoryData[]> = {
  'bitcoin': generateMockHistoryForCoin(61245.78, 0.02, 0.05),
  'ethereum': generateMockHistoryForCoin(3345.67, 0.03, 0.03),
  'binancecoin': generateMockHistoryForCoin(567.89, 0.025, -0.02),
  'solana': generateMockHistoryForCoin(123.45, 0.04, 0.12),
  'ripple': generateMockHistoryForCoin(0.567, 0.05, -0.03),
  'cardano': generateMockHistoryForCoin(0.45, 0.03, 0.02),
  'polkadot': generateMockHistoryForCoin(6.78, 0.04, 0.08),
  'dogecoin': generateMockHistoryForCoin(0.123, 0.06, 0.25),
  'avalanche-2': generateMockHistoryForCoin(34.56, 0.035, -0.04),
  'chainlink': generateMockHistoryForCoin(13.57, 0.03, 0.04)
}; 