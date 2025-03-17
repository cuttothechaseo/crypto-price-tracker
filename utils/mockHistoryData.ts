import { PriceHistoryData } from './fetchCrypto';

// Function to generate mock price history data for a specific coin
export function generateMockHistoryForCoin(
  basePrice: number, 
  volatility: number = 0.05, 
  trending: number = 0, 
  days: number = 7
): PriceHistoryData[] {
  const data: PriceHistoryData[] = [];
  const now = Date.now();
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  
  // Create data points every 4 hours
  const pointsPerDay = 6;
  const totalPoints = days * pointsPerDay;
  
  let currentPrice = basePrice;
  
  for (let i = 0; i < totalPoints; i++) {
    // Move backward in time from now
    const timestamp = now - (totalPoints - i) * (millisecondsPerDay / pointsPerDay);
    
    // Add some random price movement
    const randomChange = (Math.random() - 0.5) * 2 * volatility;
    // Add trend direction (positive or negative trend)
    const trendChange = trending * (i / totalPoints);
    
    // Calculate new price with randomness and trend
    currentPrice = currentPrice * (1 + randomChange + trendChange);
    
    data.push({
      timestamp,
      price: currentPrice
    });
  }
  
  return data;
}

// Pre-generate some historical data for common coins
export const mockBitcoinHistory = generateMockHistoryForCoin(50000, 0.03, 0.05, 7);
export const mockEthereumHistory = generateMockHistoryForCoin(3000, 0.04, 0.03, 7);
export const mockBinanceCoinHistory = generateMockHistoryForCoin(600, 0.05, -0.01, 7);
export const mockSolanaHistory = generateMockHistoryForCoin(120, 0.06, 0.07, 7);

// Map of coin IDs to their mock historical data
export const mockHistoryMap: Record<string, PriceHistoryData[]> = {
  'bitcoin': mockBitcoinHistory,
  'ethereum': mockEthereumHistory,
  'binancecoin': mockBinanceCoinHistory,
  'solana': mockSolanaHistory
}; 