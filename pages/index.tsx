import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import axios from 'axios';
import { format } from 'date-fns';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import CryptoList from '../components/CryptoList';
import MarketOverview from '../components/MarketOverview';
import { CryptoCoin } from '../types';
import { fetchCryptoData, fetchGlobalMarketData, fetchTrendingCoins, getTopGainers } from '../utils/fetchCrypto';

export default function Home() {
  const [coins, setCoins] = useState<CryptoCoin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Market overview data
  const [globalMarketCap, setGlobalMarketCap] = useState<number>(0);
  const [globalMarketCapChange, setGlobalMarketCapChange] = useState<number>(0);
  const [volume24h, setVolume24h] = useState<number>(0);
  const [volumeChange, setVolumeChange] = useState<number>(0);
  const [trendingCoins, setTrendingCoins] = useState<CryptoCoin[]>([]);
  const [topGainers, setTopGainers] = useState<CryptoCoin[]>([]);
  
  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all data in parallel
      const [cryptoData, globalData, trendingData] = await Promise.all([
        fetchCryptoData(),
        fetchGlobalMarketData(),
        fetchTrendingCoins(),
      ]);
      
      // Set crypto data
      setCoins(cryptoData);
      
      // Set global market data
      if (globalData) {
        setGlobalMarketCap(globalData.total_market_cap.usd);
        setGlobalMarketCapChange(globalData.market_cap_change_percentage_24h_usd);
        setVolume24h(globalData.total_volume.usd);
        // Calculate approximate volume change (not directly provided by API)
        setVolumeChange(globalData.market_cap_change_percentage_24h_usd * 0.8); // Rough estimate
      }
      
      // Set trending coins
      setTrendingCoins(trendingData);
      
      // Calculate top gainers from crypto data
      const topGainersList = getTopGainers(cryptoData, 3);
      setTopGainers(topGainersList);
      
      setLastUpdated(new Date());
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch cryptocurrency data. Please try again later.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
    
    // Set up auto-refresh every 2 minutes
    const intervalId = setInterval(fetchAllData, 2 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="min-h-screen bg-lightGray">
      <Head>
        <title>Crypto Price Tracker</title>
        <meta name="description" content="Track cryptocurrency prices in real-time" />
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-darkGray mb-2">
          Cryptocurrency Price Tracker
        </h1>
        
        {lastUpdated && (
          <p className="text-gray-500 mb-6">
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
              onClick={fetchAllData}
              className="mt-4 px-4 py-2 bg-primaryBlue text-white rounded-md hover:bg-secondaryBlue transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <MarketOverview 
              globalMarketCap={globalMarketCap}
              globalMarketCapChange={globalMarketCapChange}
              volume24h={volume24h}
              volumeChange={volumeChange}
              trendingCoins={trendingCoins}
              topGainers={topGainers}
              isLoading={loading}
            />
            
            <SearchBar onSearch={setSearchTerm} />
            <CryptoList coins={coins} searchTerm={searchTerm} />
            
            <div className="flex justify-center mt-12">
              <button
                onClick={fetchAllData}
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