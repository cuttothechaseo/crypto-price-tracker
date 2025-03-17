import { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { useCryptoStore } from '../store/useCryptoStore';
import Navbar from '../components/Navbar';
import CryptoList from '../components/CryptoList';
import SearchBar from '../components/SearchBar';
import { CryptoData } from '../utils/fetchCrypto';

const Home: NextPage = () => {
  const { cryptoList, loading, error, fetchData, getSortedCryptoList, sortOrder } = useCryptoStore();
  const [isClient, setIsClient] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [lastFetchAttempt, setLastFetchAttempt] = useState(0);
  const [lastSuccessfulFetch, setLastSuccessfulFetch] = useState<Date | null>(null);

  // Function to safely fetch data with rate limiting
  const safeFetchData = useCallback(() => {
    const now = Date.now();
    const MIN_FETCH_INTERVAL = 30000; // 30 seconds minimum between fetches
    
    if (now - lastFetchAttempt < MIN_FETCH_INTERVAL) {
      console.log('Throttling API requests. Skipping this fetch.');
      return;
    }
    
    setLastFetchAttempt(now);
    fetchData().then(() => {
      setLastSuccessfulFetch(new Date());
    });
  }, [fetchData, lastFetchAttempt]);

  useEffect(() => {
    // Mark component as client-side rendered
    setIsClient(true);
    
    // Fetch crypto data when the component mounts
    safeFetchData();
    
    // Set up an interval to refresh data every 60 seconds
    const intervalId = setInterval(() => {
      safeFetchData();
    }, 60000);
    
    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [safeFetchData]);

  // Get sorted list
  const sortedCryptoList = useMemo(() => {
    console.log('Recalculating sorted list with sort order:', sortOrder);
    return getSortedCryptoList();
  }, [getSortedCryptoList, cryptoList, sortOrder]);

  // Filter cryptoList based on searchTerm
  const filteredCryptoList = useMemo(() => {
    if (!searchTerm.trim()) return sortedCryptoList;
    
    const searchTermLower = searchTerm.toLowerCase();
    return sortedCryptoList.filter(
      (crypto) =>
        crypto.name.toLowerCase().includes(searchTermLower) ||
        crypto.symbol.toLowerCase().includes(searchTermLower)
    );
  }, [sortedCryptoList, searchTerm]);

  // Handle search
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  // Format the last updated time
  const formatLastUpdated = () => {
    if (!lastSuccessfulFetch) return 'Never';
    
    // Format: "Today, 2:45 PM" or "May 12, 2:45 PM"
    return lastSuccessfulFetch.toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      month: 'short',
      day: 'numeric'
    });
  };

  // Display a simple loading state before client-side code runs
  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Head>
        <title>Crypto Price Tracker</title>
        <meta name="description" content="Track cryptocurrency prices in real-time" />
      </Head>

      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            Real-Time Cryptocurrency Prices
          </h1>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Last updated: {formatLastUpdated()}
            </span>
            <button
              onClick={() => safeFetchData()}
              disabled={loading || Date.now() - lastFetchAttempt < 30000}
              className={`p-2 rounded-full ${
                loading || Date.now() - lastFetchAttempt < 30000
                  ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                  : 'bg-primary-100 dark:bg-primary-900 hover:bg-primary-200 dark:hover:bg-primary-800'
              }`}
              title="Refresh data"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-primary-600 dark:text-primary-400 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>

        <SearchBar onSearch={handleSearch} />
        
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
          </div>
        ) : error ? (
          <div className="text-center text-danger py-10">
            <p>Error loading crypto data: {error}</p>
            <button 
              onClick={() => safeFetchData()}
              className="mt-4 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
            >
              Try Again
            </button>
          </div>
        ) : (
          <CryptoList cryptoData={filteredCryptoList} />
        )}

        <div className="text-center text-gray-500 text-sm mt-10">
          <p>Data provided by CoinGecko API</p>
          <p>Prices refresh automatically every minute</p>
        </div>
      </main>
    </div>
  );
};

export default Home; 