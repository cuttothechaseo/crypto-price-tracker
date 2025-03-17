import React, { useState } from 'react';
import Image from 'next/image';
import { CryptoCoin } from '../types';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface CoinCardProps {
  coin: CryptoCoin;
}

const CoinCard: React.FC<CoinCardProps> = ({ coin }) => {
  const [showChart, setShowChart] = useState(false);

  const formatPrice = (price: number) => {
    if (price < 0.01) return '$' + price.toFixed(6);
    if (price < 1) return '$' + price.toFixed(4);
    if (price < 10) return '$' + price.toFixed(2);
    if (price < 1000) return '$' + price.toFixed(2);
    return '$' + price.toLocaleString('en-US', { maximumFractionDigits: 2 });
  };

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) return '$' + (marketCap / 1e12).toFixed(2) + 'T';
    if (marketCap >= 1e9) return '$' + (marketCap / 1e9).toFixed(2) + 'B';
    if (marketCap >= 1e6) return '$' + (marketCap / 1e6).toFixed(2) + 'M';
    return '$' + marketCap.toLocaleString();
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-600' : 'text-danger';
  };

  const getChangeIcon = (change: number) => {
    return change >= 0 ? (
      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
      </svg>
    ) : (
      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
      </svg>
    );
  };

  // Chart configuration
  const chartData = coin.sparkline_in_7d?.price || [];
  const labels = Array.from({ length: chartData.length }, (_, i) => i);
  
  const data = {
    labels,
    datasets: [
      {
        data: chartData,
        borderColor: coin.price_change_percentage_7d_in_currency 
          ? (coin.price_change_percentage_7d_in_currency >= 0 ? 'rgba(22, 163, 74, 0.8)' : 'rgba(220, 38, 38, 0.8)') 
          : 'rgba(59, 130, 246, 0.8)',
        backgroundColor: 'transparent',
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4,
      },
    ],
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-soft border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md hover:translate-y-[-2px]">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 bg-gray-100 rounded-full p-1.5">
              <Image
                src={coin.image}
                alt={coin.name}
                width={32}
                height={32}
                className="rounded-full"
              />
            </div>
            <div>
              <h3 className="font-medium text-darkGray">{coin.name}</h3>
              <span className="text-gray-500 text-sm uppercase">{coin.symbol}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-darkGray font-medium">{formatPrice(coin.current_price)}</div>
            <div className={`flex items-center text-sm ${getChangeColor(coin.price_change_percentage_24h)}`}>
              {getChangeIcon(coin.price_change_percentage_24h)}
              {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
          <div>
            <span className="text-gray-500">Rank</span>
            <div className="text-darkGray font-medium">#{coin.market_cap_rank}</div>
          </div>
          <div>
            <span className="text-gray-500">Market Cap</span>
            <div className="text-darkGray font-medium">{formatMarketCap(coin.market_cap)}</div>
          </div>
        </div>

        {showChart && (
          <div className="mt-3 h-40">
            <Line data={data} options={options} />
          </div>
        )}
      </div>
      
      <button
        onClick={() => setShowChart(!showChart)}
        className="w-full bg-gray-50 border-t border-gray-200 py-2 text-sm text-primaryBlue hover:bg-gray-100 transition-colors duration-200 flex justify-center items-center"
      >
        {showChart ? 'Hide Chart' : 'Show Chart'}
        <svg
          className={`w-4 h-4 ml-1 transition-transform duration-200 ${showChart ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>
  );
};

export default CoinCard; 