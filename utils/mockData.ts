import { CryptoData } from './fetchCrypto';

export const mockCryptoData: CryptoData[] = [
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
    current_price: 61245.78,
    market_cap: 1210869762993,
    market_cap_rank: 1,
    price_change_percentage_24h: 2.3,
    price_change_percentage_7d_in_currency: 5.8,
    sparkline_in_7d: {
      price: Array(168).fill(0).map((_, i) => 60000 + Math.random() * 3000)
    }
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    current_price: 3345.67,
    market_cap: 401987654321,
    market_cap_rank: 2,
    price_change_percentage_24h: 1.8,
    price_change_percentage_7d_in_currency: 3.2,
    sparkline_in_7d: {
      price: Array(168).fill(0).map((_, i) => 3200 + Math.random() * 300)
    }
  },
  {
    id: 'binancecoin',
    name: 'BNB',
    symbol: 'BNB',
    image: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png',
    current_price: 567.89,
    market_cap: 87654321098,
    market_cap_rank: 3,
    price_change_percentage_24h: -0.7,
    price_change_percentage_7d_in_currency: -1.5,
    sparkline_in_7d: {
      price: Array(168).fill(0).map((_, i) => 570 - Math.random() * 20)
    }
  },
  {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
    current_price: 123.45,
    market_cap: 53678901234,
    market_cap_rank: 4,
    price_change_percentage_24h: 5.6,
    price_change_percentage_7d_in_currency: 12.3,
    sparkline_in_7d: {
      price: Array(168).fill(0).map((_, i) => 110 + Math.random() * 25)
    }
  },
  {
    id: 'ripple',
    name: 'XRP',
    symbol: 'XRP',
    image: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png',
    current_price: 0.567,
    market_cap: 29876543210,
    market_cap_rank: 5,
    price_change_percentage_24h: -1.2,
    price_change_percentage_7d_in_currency: -3.4,
    sparkline_in_7d: {
      price: Array(168).fill(0).map((_, i) => 0.58 - Math.random() * 0.05)
    }
  },
  {
    id: 'cardano',
    name: 'Cardano',
    symbol: 'ADA',
    image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png',
    current_price: 0.45,
    market_cap: 15987654321,
    market_cap_rank: 6,
    price_change_percentage_24h: 0.9,
    price_change_percentage_7d_in_currency: 2.1,
    sparkline_in_7d: {
      price: Array(168).fill(0).map((_, i) => 0.44 + Math.random() * 0.03)
    }
  },
  {
    id: 'dogecoin',
    name: 'Dogecoin',
    symbol: 'DOGE',
    image: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png',
    current_price: 0.123,
    market_cap: 16543210987,
    market_cap_rank: 8,
    price_change_percentage_24h: 10.5,
    price_change_percentage_7d_in_currency: 25.6,
    sparkline_in_7d: {
      price: Array(168).fill(0).map((_, i) => 0.1 + Math.random() * 0.04)
    }
  },
  {
    id: 'polkadot',
    name: 'Polkadot',
    symbol: 'DOT',
    image: 'https://assets.coingecko.com/coins/images/12171/large/polkadot.png',
    current_price: 6.78,
    market_cap: 8765432109,
    market_cap_rank: 7,
    price_change_percentage_24h: 3.4,
    price_change_percentage_7d_in_currency: 7.8,
    sparkline_in_7d: {
      price: Array(168).fill(0).map((_, i) => 6.5 + Math.random() * 0.5)
    }
  },
  {
    id: 'avalanche-2',
    name: 'Avalanche',
    symbol: 'AVAX',
    image: 'https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png',
    current_price: 34.56,
    market_cap: 12345678901,
    market_cap_rank: 9,
    price_change_percentage_24h: -2.1,
    price_change_percentage_7d_in_currency: -4.3,
    sparkline_in_7d: {
      price: Array(168).fill(0).map((_, i) => 36 - Math.random() * 3)
    }
  },
  {
    id: 'chainlink',
    name: 'Chainlink',
    symbol: 'LINK',
    image: 'https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png',
    current_price: 13.57,
    market_cap: 7654321098,
    market_cap_rank: 10,
    price_change_percentage_24h: 1.5,
    price_change_percentage_7d_in_currency: 3.7,
    sparkline_in_7d: {
      price: Array(168).fill(0).map((_, i) => 13.2 + Math.random() * 0.7)
    }
  }
];

export const mockGlobalMarketData = {
  data: {
    active_cryptocurrencies: 10953,
    total_market_cap: {
      usd: 2327654321098
    },
    total_volume: {
      usd: 87654321098
    },
    market_cap_percentage: {
      btc: 52.1,
      eth: 17.3
    },
    market_cap_change_percentage_24h_usd: 2.5
  }
};

export const mockTrendingCoins = {
  coins: [
    {
      item: {
        id: "bitcoin",
        coin_id: 1,
        name: "Bitcoin",
        symbol: "BTC",
        thumb: "https://assets.coingecko.com/coins/images/1/thumb/bitcoin.png"
      }
    },
    {
      item: {
        id: "ethereum",
        coin_id: 279,
        name: "Ethereum",
        symbol: "ETH",
        thumb: "https://assets.coingecko.com/coins/images/279/thumb/ethereum.png"
      }
    },
    {
      item: {
        id: "solana",
        coin_id: 4128,
        name: "Solana",
        symbol: "SOL",
        thumb: "https://assets.coingecko.com/coins/images/4128/thumb/solana.png"
      }
    }
  ]
}; 