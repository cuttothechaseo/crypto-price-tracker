import { Coin } from "../types";

// Mock sparkline data - 7 days of slightly varying prices
const generateSparklineData = (basePrice: number): number[] => {
  return Array.from({ length: 168 }, (_, i) => {
    // Add some random variation (up to 8%) around the base price
    const variance = basePrice * 0.08; 
    return basePrice + (Math.random() * variance * 2 - variance);
  });
};

// Mock cryptocurrency data to use as fallback when API fails
export const mockCryptoData: Coin[] = [
  {
    id: "bitcoin",
    symbol: "btc",
    name: "Bitcoin",
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    current_price: 61245.32,
    market_cap: 1202765432198,
    market_cap_rank: 1,
    price_change_percentage_24h: 0.95,
    total_volume: 35623587412,
    sparkline_in_7d: {
      price: generateSparklineData(61245)
    }
  },
  {
    id: "ethereum",
    symbol: "eth",
    name: "Ethereum",
    image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    current_price: 3456.78,
    market_cap: 415876234509,
    market_cap_rank: 2,
    price_change_percentage_24h: -0.71,
    total_volume: 21587632145,
    sparkline_in_7d: {
      price: generateSparklineData(3456)
    }
  },
  {
    id: "tether",
    symbol: "usdt",
    name: "Tether",
    image: "https://assets.coingecko.com/coins/images/325/large/tether.png",
    current_price: 1.0,
    market_cap: 95875432165,
    market_cap_rank: 3,
    price_change_percentage_24h: 0.01,
    total_volume: 76543218965,
    sparkline_in_7d: {
      price: generateSparklineData(1)
    }
  }
]; 