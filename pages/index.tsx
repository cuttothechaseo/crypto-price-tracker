import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import axios from 'axios';
import { format } from 'date-fns';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import CryptoList from '../components/CryptoList';
import MarketOverview from '../components/MarketOverview';
import { CryptoCoin } from '../types';

export default function Home() {
  const [coins, setCoins] = useState<CryptoCoin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showHighlights, setShowHighlights] = useState(true);
  
  const fetchCryptoData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(
        'https://api.coingecko.com/api/v3/coins/markets',
        {
          params: {
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: 100,
            page: 1,
            sparkline: true,
            price_change_percentage: '7d',
          },
        }
      );
      
      setCoins(response.data);
      setLastUpdated(new Date());
      setLoading(false);
    } catch (err) {
      console.error('Error fetching crypto data:', err);
      setError('Failed to fetch cryptocurrency data. Please try again later.');
      setLoading(false);
    }
  };

  // Handle highlights toggle from navbar
  const handleHighlightsToggle = (value: boolean) => {
    setShowHighlights(value);
  };

  useEffect(() => {
    fetchCryptoData();
    
    // Set up auto-refresh every 2 minutes
    const intervalId = setInterval(fetchCryptoData, 2 * 60 * 1000);
    
    // Initialize highlights preference from localStorage
    const storedHighlights = localStorage.getItem('showHighlights');
    if (storedHighlights !== null) {
      setShowHighlights(storedHighlights === 'true');
    }
    
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="min-h-screen bg-lightGray">
      <Head>
        <title>Crypto Price Tracker</title>
        <meta name="description" content="Track cryptocurrency prices in real-time" />
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <Navbar onHighlightsToggle={handleHighlightsToggle} />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-darkGray mb-2">
          Cryptocurrency Price Tracker
        </h1>
        
        {lastUpdated && (
          <p className="text-gray-500 mb-8">
            Last updated: {format(lastUpdated, 'MMM d, yyyy h:mm a')}
          </p>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primaryBlue"></div>
          </div>
        ) : error ? (
          <div className="bg-white rounded-lg shadow-soft p-6 border-l-4 border-danger">
            <h3 className="text-lg font-medium text-danger mb-2">Error</h3>
            <p className="text-gray-600">{error}</p>
            <button
              onClick={fetchCryptoData}
              className="mt-4 px-4 py-2 bg-primaryBlue text-white rounded-md hover:bg-secondaryBlue transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            {showHighlights && <MarketOverview />}
            
            <SearchBar onSearch={setSearchTerm} />
            <CryptoList coins={coins} searchTerm={searchTerm} />
            
            <div className="flex justify-center mt-12">
              <button
                onClick={fetchCryptoData}
                className="px-6 py-2 bg-primaryBlue text-white rounded-md hover:bg-secondaryBlue transition-all duration-200 shadow-soft flex items-center"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Refresh
              </button>
            </div>
          </>
        )}
      </main>
      
      <footer className="bg-white py-6 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-500">
            Data provided by <a href="https://www.coingecko.com/" target="_blank" rel="noopener noreferrer" className="text-primaryBlue hover:underline">CoinGecko</a>
          </p>
        </div>
      </footer>
    </div>
  );
} 