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
      <div className="min-h-screen flex items-center justify-center bg-darkBackground">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyberPurple"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen cyber-grid-bg">
      <Head>
        <title>Crypto Price Tracker | Cyberpunk Edition</title>
        <meta name="description" content="Track cryptocurrency prices in real-time with a cyberpunk aesthetic" />
      </Head>

      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-10 flex-wrap">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 md:mb-0 relative inline-block glitch-effect">
            <span className="neon-text">Real-Time Cryptocurrency Prices</span>
            <div className="absolute top-0 left-0 w-full h-full bg-darkBackground -z-10"></div>
          </h1>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-electricBlue">
              Last updated: <span className="text-neonPink">{formatLastUpdated()}</span>
            </span>
            <button
              onClick={() => safeFetchData()}
              disabled={loading || Date.now() - lastFetchAttempt < 30000}
              className={`p-2.5 rounded-full transition-all duration-300 ${
                loading || Date.now() - lastFetchAttempt < 30000
                  ? 'bg-gray-800 cursor-not-allowed'
                  : 'bg-electricBlue/10 border border-electricBlue hover:shadow-glow-blue'
              }`}
              title="Refresh data"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-electricBlue ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>

        <SearchBar onSearch={handleSearch} />
        
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="relative">
              <div className="absolute inset-0 bg-cyberPurple rounded-full blur-xl opacity-30 animate-pulse"></div>
              <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-neonPink relative z-10"></div>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-16 border border-neonPink rounded-lg bg-neonPink/5 shadow-glow-pink">
            <p className="text-white mb-4">Error loading crypto data: <span className="text-neonPink font-bold">{error}</span></p>
            <button 
              onClick={() => safeFetchData()}
              className="mt-4 bg-neonPink text-white px-6 py-2.5 rounded-md hover:bg-opacity-80 hover:shadow-glow-pink transition-all duration-300 font-['Orbitron']"
            >
              Try Again
            </button>
          </div>
        ) : (
          <CryptoList cryptoData={filteredCryptoList} />
        )}

        <div className="text-center text-gray-500 text-sm mt-12 border-t border-gray-800 pt-8">
          <p className="text-electricBlue mb-1">Data provided by CoinGecko API</p>
          <p className="text-gray-500">Prices refresh automatically every minute</p>
        </div>
      </main>
    </div>
  );
};

export default Home; 