import { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useState, useMemo } from 'react';
import { useCryptoStore } from '../store/useCryptoStore';
import Navbar from '../components/Navbar';
import CryptoList from '../components/CryptoList';
import SearchBar from '../components/SearchBar';
import { CryptoData } from '../utils/fetchCrypto';

const Home: NextPage = () => {
  const { cryptoList, loading, error, fetchData, getSortedCryptoList, sortOrder } = useCryptoStore();
  const [isClient, setIsClient] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Mark component as client-side rendered
    setIsClient(true);
    
    // Fetch crypto data when the component mounts
    fetchData();
    
    // Set up an interval to refresh data every 60 seconds
    const intervalId = setInterval(() => {
      fetchData();
    }, 60000);
    
    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [fetchData]);

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
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          Real-Time Cryptocurrency Prices
        </h1>

        <SearchBar onSearch={handleSearch} />
        
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
          </div>
        ) : error ? (
          <div className="text-center text-danger py-10">
            <p>Error loading crypto data: {error}</p>
            <button 
              onClick={() => fetchData()}
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