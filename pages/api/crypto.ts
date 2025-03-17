import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { mockCryptoData, mockGlobalMarketData, mockTrendingCoins } from '../../utils/mockData';
import { generateMockHistoryForCoin } from '../../utils/mockHistoryData';

const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';

// Create a request queue to manage API calls
interface QueuedRequest {
  url: string;
  params: any;
  resolve: (data: any) => void;
  reject: (error: any) => void;
}

const requestQueue: QueuedRequest[] = [];
let isProcessingQueue = false;
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 12000; // 12 seconds between requests to avoid rate limits
const TIMEOUT_DURATION = 20000;  // 20 seconds timeout

// Process the queue one request at a time with proper delays
async function processQueue() {
  if (isProcessingQueue || requestQueue.length === 0) return;
  
  isProcessingQueue = true;
  
  try {
    const request = requestQueue.shift()!;
    const now = Date.now();
    const timeToWait = Math.max(0, MIN_REQUEST_INTERVAL - (now - lastRequestTime));
    
    if (timeToWait > 0) {
      console.log(`Waiting ${timeToWait}ms before making next API request`);
      await new Promise(resolve => setTimeout(resolve, timeToWait));
    }
    
    console.log(`Making API request to: ${request.url}`);
    try {
      const response = await axios.get(request.url, {
        params: request.params,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        timeout: TIMEOUT_DURATION
      });
      
      lastRequestTime = Date.now();
      request.resolve(response.data);
    } catch (error) {
      console.error(`API request to ${request.url} failed:`, error);
      request.reject(error);
    }
  } finally {
    isProcessingQueue = false;
    
    // Process next request if there are any
    if (requestQueue.length > 0) {
      setTimeout(processQueue, 100); // Small delay before processing next request
    }
  }
}

// Queue a request and return a promise
function queueRequest(url: string, params: any = {}): Promise<any> {
  return new Promise((resolve, reject) => {
    requestQueue.push({ url, params, resolve, reject });
    processQueue(); // Start processing the queue if it's not already running
  });
}

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
      // Use the queuing system for the API request
      const data = await queueRequest(url, params);
      return res.status(200).json(data);
    } catch (apiError: any) {
      // Check if it's a timeout error
      if (apiError.code === 'ECONNABORTED' || 
          (apiError.message && apiError.message.includes('timeout'))) {
        console.log(`Request to ${url} timed out, using fallback data`);
      } else {
        console.error('CoinGecko API error:', apiError);
      }
      
      console.log('Using fallback data for', endpoint);
      // Return fallback mock data if API fails
      return res.status(200).json(fallbackData);
    }
  } catch (error) {
    console.error('API proxy error:', error);
    return res.status(500).json({ error: 'Error in API proxy' });
  }
} 