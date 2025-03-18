import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { fetchTopGainers } from '../utils/fetchCrypto';
import Navbar from '../components/Navbar';
import { FaRocket, FaArrowLeft } from 'react-icons/fa';

interface TopGainer {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  market_cap_rank: number;
}

const GainersPage: React.FC = () => {
  const [topGainers, setTopGainers] = useState<TopGainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Format large numbers
  const formatCurrency = (value: number): string => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)} Trillion`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)} Billion`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)} Million`;
    return `$${value.toLocaleString()}`;
  };

  // Format price with appropriate decimal places
  const formatPrice = (price: number): string => {
    if (price < 0.01) return '$' + price.toFixed(6);
    if (price < 1) return '$' + price.toFixed(4);
    if (price < 10) return '$' + price.toFixed(2);
    return '$' + price.toLocaleString('en-US', { maximumFractionDigits: 2 });
  };

  // Format percentage change
  const formatPercentage = (value: number): string => {
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // For this page, we want more gainers than just 3
        const response = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=percent_change_24h_desc&per_page=25&page=1&sparkline=false'
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        
        const data = await response.json();
        setTopGainers(data);
      } catch (err) {
        console.error('Error fetching top gainers data:', err);
        setError('Failed to load top gainers data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-lightGray">
      <Head>
        <title>Top Gainers | Crypto Price Tracker</title>
        <meta name="description" content="View top gaining cryptocurrencies" />
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link href="/" className="flex items-center text-primaryBlue hover:underline mr-4">
            <FaArrowLeft className="mr-2" /> Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-darkGray">
            Top Gaining Cryptocurrencies
          </h1>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
          <div className="flex items-center mb-6">
            <FaRocket className="text-green-500 mr-2 text-xl" />
            <h2 className="text-xl font-medium text-darkGray">
              Biggest 24h Gainers
            </h2>
          </div>
          
          {loading ? (
            <div className="animate-pulse space-y-4">
              {[...Array(10)].map((_, index) => (
                <div key={index} className="flex items-center py-3 border-b border-gray-100">
                  <div className="w-6 text-center mr-4">
                    <div className="h-4 bg-gray-200 rounded w-4 mx-auto"></div>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-gray-200 mr-4"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-20 mr-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-24"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-danger text-lg">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-primaryBlue text-white rounded-md hover:bg-secondaryBlue transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      #
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Coin
                    </th>
                    <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      24h Change
                    </th>
                    <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Market Cap
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {topGainers.map((coin, index) => (
                    <tr key={coin.id} className="hover:bg-gray-50">
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        {index + 1}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-9 w-9">
                            <Image 
                              src={coin.image} 
                              alt={coin.name} 
                              width={36} 
                              height={36}
                              className="rounded-full"
                            />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-darkGray">{coin.name}</div>
                            <div className="text-xs text-gray-500">{coin.symbol.toUpperCase()}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {formatPrice(coin.current_price)}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-right">
                        <span className="text-sm font-medium px-2 py-1 rounded-full bg-green-100 text-green-600">
                          {formatPercentage(coin.price_change_percentage_24h)}
                        </span>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                        {formatCurrency(coin.market_cap)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          <div className="mt-6 text-center text-sm text-gray-500">
            Data refreshes every 5 minutes. Market changes are calculated based on 24-hour performance.
          </div>
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

export default GainersPage; 