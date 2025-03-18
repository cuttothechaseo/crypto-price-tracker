import React, { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '../components/Navbar';
import { FaFire, FaArrowLeft } from 'react-icons/fa';
import useCryptoStore from '../store/useCryptoStore';

const TrendingPage: React.FC = () => {
  const { trendingCoins, loading, error, fetchTrendingCoinsData } = useCryptoStore();

  useEffect(() => {
    // Fetch more trending coins for the detailed page (up to 10)
    fetchTrendingCoinsData(10);
  }, [fetchTrendingCoinsData]);

  return (
    <div className="min-h-screen bg-lightGray">
      <Head>
        <title>Trending Cryptocurrencies | Crypto Price Tracker</title>
        <meta name="description" content="View trending cryptocurrencies" />
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link href="/" className="flex items-center text-primaryBlue hover:underline mr-4">
            <FaArrowLeft className="mr-2" /> Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-darkGray">
            Trending Cryptocurrencies
          </h1>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
          <div className="flex items-center mb-6">
            <FaFire className="text-orange-500 mr-2 text-xl" />
            <h2 className="text-xl font-medium text-darkGray">
              Currently Trending on CoinGecko
            </h2>
          </div>
          
          {loading && trendingCoins.length === 0 ? (
            <div className="animate-pulse space-y-4">
              {[...Array(7)].map((_, index) => (
                <div key={index} className="flex items-center py-3 border-b border-gray-100">
                  <div className="h-12 w-12 rounded-full bg-gray-200 mr-4"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
              ))}
            </div>
          ) : error && trendingCoins.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-danger text-lg">{error}</p>
              <button
                onClick={() => fetchTrendingCoinsData(10)}
                className="mt-4 px-4 py-2 bg-primaryBlue text-white rounded-md hover:bg-secondaryBlue transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {trendingCoins.map((coin, index) => (
                <div key={coin.item.id} className="flex items-center py-4 justify-between">
                  <div className="flex items-center">
                    <div className="font-medium text-gray-500 mr-4 w-6 text-center">{index + 1}</div>
                    <div className="w-10 h-10 mr-4 relative flex-shrink-0">
                      <Image 
                        src={coin.item.large || coin.item.thumb} 
                        alt={coin.item.name} 
                        width={40} 
                        height={40}
                        className="rounded-full"
                      />
                    </div>
                    <div>
                      <div className="font-medium text-darkGray">{coin.item.name}</div>
                      <div className="text-sm text-gray-500">{coin.item.symbol}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="text-sm mr-6 bg-gray-100 px-2 py-1 rounded">
                      Rank #{coin.item.market_cap_rank || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-700">
                      Score: {coin.item.score}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
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
};

export default TrendingPage; 