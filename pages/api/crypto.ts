import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { mockCryptoData, mockGlobalMarketData, mockTrendingCoins } from '../../utils/mockData';
import { generateMockHistoryForCoin } from '../../utils/mockHistoryData';

const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';

// Track API requests to avoid rate limiting
let lastApiRequest = 0;
const MIN_REQUEST_INTERVAL = 10000; // 10 seconds between requests

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // For security, only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { endpoint } = req.query;
    
    if (!endpoint) {
      return res.status(400).json({ error: 'Endpoint parameter is required' });
    }

    // Check if we're making requests too frequently
    const now = Date.now();
    if (now - lastApiRequest < MIN_REQUEST_INTERVAL) {
      console.warn('API requests too frequent, waiting before making a new request');
      await new Promise(resolve => setTimeout(resolve, MIN_REQUEST_INTERVAL));
    }
    
    lastApiRequest = Date.now();

    // Handle various endpoints
    let url = '';
    let params = {};
    let fallbackData: any = null;

    if (endpoint === 'markets') {
      url = `${COINGECKO_BASE_URL}/coins/markets`;
      params = {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 100,
        page: 1,
        sparkline: true,
        price_change_percentage: '7d',
      };
      fallbackData = mockCryptoData;
    } else if (endpoint === 'global') {
      url = `${COINGECKO_BASE_URL}/global`;
      fallbackData = mockGlobalMarketData;
    } else if (endpoint === 'trending') {
      url = `${COINGECKO_BASE_URL}/search/trending`;
      fallbackData = mockTrendingCoins;
    } else if (endpoint === 'coin') {
      const { id, days } = req.query;
      if (!id) {
        return res.status(400).json({ error: 'Coin ID is required' });
      }
      url = `${COINGECKO_BASE_URL}/coins/${id}/market_chart`;
      params = {
        vs_currency: 'usd',
        days: days || 7,
      };
      
      // Generate mock history data for fallback
      fallbackData = {
        prices: generateMockHistoryForCoin(1000, 0.05, 0, Number(days) || 7).map(item => [item.timestamp, item.price])
      };
    } else {
      return res.status(400).json({ error: 'Invalid endpoint' });
    }

    // Pass any additional query parameters from the request
    Object.keys(req.query).forEach(key => {
      if (!['endpoint', 'id'].includes(key)) {
        // @ts-ignore
        params[key] = req.query[key];
      }
    });

    try {
      const response = await axios.get(url, {
        params,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        timeout: 15000
      });
  
      return res.status(200).json(response.data);
    } catch (apiError) {
      console.error('CoinGecko API error:', apiError);
      console.log('Using fallback data for', endpoint);
      
      // Return fallback mock data if API fails
      return res.status(200).json(fallbackData);
    }
  } catch (error) {
    console.error('API proxy error:', error);
    return res.status(500).json({ error: 'Error in API proxy' });
  }
} 