import React, { useState, useEffect, useCallback } from 'react';
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
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  // Market overview data
  const [globalMarketCap, setGlobalMarketCap] = useState<number>(0);
  const [globalMarketCapChange, setGlobalMarketCapChange] = useState<number>(0);
  const [volume24h, setVolume24h] = useState<number>(0);
  const [volumeChange, setVolumeChange] = useState<number>(0);
  const [trendingCoins, setTrendingCoins] = useState<CryptoCoin[]>([]);
  const [topGainers, setTopGainers] = useState<CryptoCoin[]>([]);

  // Implement exponential backoff for retries
  const getRetryDelay = useCallback((count: number): number => {
    // Start with 3 seconds, then double for each retry up to a maximum of 30 seconds
    const baseDelay = 3000;
    const maxDelay = 30000;
    const calculatedDelay = baseDelay * Math.pow(2, count);
    return Math.min(calculatedDelay, maxDelay);
  }, []);
  
  const fetchAllData = useCallback(async (isRetry = false) => {
    try {
      if (!isRetry) {
        setLoading(true);
      } else {
        setIsRetrying(true);
      }
      setError(null);
      
      // Fetch all data in parallel, handling each promise separately
      // to allow some data to load even if other requests fail
      const cryptoDataPromise = fetchCryptoData().catch(error => {
        console.error('Failed to fetch cryptocurrency data:', error);
        return [];
      });
      
      const globalDataPromise = fetchGlobalMarketData().catch(error => {
        console.error('Failed to fetch global market data:', error);
        return null;
      });
      
      const trendingDataPromise = fetchTrendingCoins().catch(error => {
        console.error('Failed to fetch trending coins:', error);
        return [];
      });
      
      // Wait for all promises to settle (either resolved or rejected)
      const [cryptoData, globalData, trendingData] = await Promise.all([
        cryptoDataPromise,
        globalDataPromise,
        trendingDataPromise
      ]);
      
      // Check if we got any data at all
      if (cryptoData.length === 0 && !globalData && trendingData.length === 0) {
        throw new Error('Failed to fetch all data types');
      }
      
      // Set crypto data
      if (cryptoData.length > 0) {
        setCoins(cryptoData);
        
        // Calculate top gainers
        const topGainersList = getTopGainers(cryptoData, 3);
        setTopGainers(topGainersList);
      }
      
      // Set global market data
      if (globalData) {
        setGlobalMarketCap(globalData.total_market_cap.usd);
        setGlobalMarketCapChange(globalData.market_cap_change_percentage_24h_usd);
        setVolume24h(globalData.total_volume.usd);
        // Calculate approximate volume change (not directly provided by API)
        setVolumeChange(globalData.market_cap_change_percentage_24h_usd * 0.8); // Rough estimate
      }
      
      // Set trending coins
      if (trendingData.length > 0) {
        setTrendingCoins(trendingData);
      }
      
      setLastUpdated(new Date());
      setRetryCount(0); // Reset retry count on success
      setLoading(false);
      setIsRetrying(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      
      // If this is a retry, increment the retry count
      if (isRetry) {
        setRetryCount(prevCount => prevCount + 1);
      }
      
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to fetch cryptocurrency data. Please try again later.';
      
      setError(errorMessage);
      setLoading(false);
      setIsRetrying(false);
      
      // Auto-retry with backoff if not too many retries yet (max 3 retries)
      if (retryCount < 3) {
        const delay = getRetryDelay(retryCount);
        console.log(`Will retry in ${delay/1000} seconds...`);
        setTimeout(() => {
          fetchAllData(true);
        }, delay);
      }
    }
  }, [retryCount, getRetryDelay]);

  useEffect(() => {
    fetchAllData();
    
    // Set up auto-refresh every 3 minutes
    const intervalId = setInterval(() => {
      // Only refresh if not currently loading or retrying
      if (!loading && !isRetrying) {
        fetchAllData();
      }
    }, 3 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [fetchAllData, loading, isRetrying]);

  const handleManualRefresh = () => {
    if (!loading && !isRetrying) {
      fetchAllData();
    }
  };

  return (
    <div className="min-h-screen bg-lightGray">
      <Head>
        <title>Crypto Price Tracker</title>
        <meta name="description" content="Track cryptocurrency prices in real-time" />
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center flex-wrap mb-6">
          <div>
            <h1 className="text-3xl font-bold text-darkGray mb-2">
              Cryptocurrency Price Tracker
            </h1>
            
            {lastUpdated && (
              <p className="text-gray-500">
                Last updated: {format(lastUpdated, 'MMM d, yyyy h:mm a')}
              </p>
            )}
          </div>
          
          <button
            onClick={handleManualRefresh}
            disabled={loading || isRetrying}
            className={`px-4 py-2 rounded-md flex items-center text-sm transition-all duration-200 ${
              loading || isRetrying 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : 'bg-primaryBlue text-white hover:bg-secondaryBlue shadow-soft'
            }`}
          >
            {loading || isRetrying ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isRetrying ? 'Retrying...' : 'Loading...'}
              </>
            ) : (
              <>
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
              </>
            )}
          </button>
        </div>
        
        {loading && coins.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primaryBlue"></div>
          </div>
        ) : error && coins.length === 0 ? (
          <div className="bg-white rounded-lg shadow-soft p-6 border-l-4 border-danger">
            <h3 className="text-lg font-medium text-danger mb-2">Error</h3>
            <p className="text-gray-600">{error}</p>
            <button
              onClick={() => fetchAllData(true)}
              disabled={isRetrying}
              className={`mt-4 px-4 py-2 text-white rounded-md transition-colors duration-200 ${
                isRetrying
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-primaryBlue hover:bg-secondaryBlue'
              }`}
            >
              {isRetrying ? (
                <>
                  <span className="inline-block mr-2">Retrying</span>
                  <span className="inline-block w-5">
                    <span className="animate-pulse">.</span>
                    <span className="animate-pulse delay-100">.</span>
                    <span className="animate-pulse delay-200">.</span>
                  </span>
                </>
              ) : 'Try Again'}
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