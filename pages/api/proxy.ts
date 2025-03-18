import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { url } = req.query;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ message: 'URL is required' });
  }

  try {
    // Forward the request to CoinGecko
    const response = await axios.get(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    // Return the data
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Proxy error:', error);
    
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const data = error.response?.data || { message: 'Unknown error' };
      
      return res.status(status).json(data);
    }
    
    return res.status(500).json({ message: 'Internal server error' });
  }
} 