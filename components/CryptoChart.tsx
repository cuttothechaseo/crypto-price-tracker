import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { fetchCryptoHistory, PriceHistoryData } from '../utils/fetchCrypto';

interface CryptoChartProps {
  coinId: string;
  coinName: string;
  coinSymbol: string;
  color?: string;
}

interface ChartDataPoint {
  date: string;
  price: number;
  formattedDate: string;
}

const CryptoChart: React.FC<CryptoChartProps> = ({ 
  coinId, 
  coinName,
  coinSymbol,
  color = '#4f46e5' // Default color (primary-600)
}) => {
  const [historyData, setHistoryData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<number>(7); // Default 7 days

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await fetchCryptoHistory(coinId, timeframe);
        
        // Transform data for the chart
        const chartData = transformHistoryData(data);
        setHistoryData(chartData);
      } catch (err) {
        console.error('Error in chart component:', err);
        setError('Failed to load price history');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [coinId, timeframe]);

  // Transform the raw history data for the chart
  const transformHistoryData = (data: PriceHistoryData[]): ChartDataPoint[] => {
    return data.map(point => {
      const date = new Date(point.timestamp);
      
      // Format the date differently based on timeframe
      let formattedDate = '';
      if (timeframe <= 1) {
        // For 1 day, show hour:minute
        formattedDate = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else if (timeframe <= 30) {
        // For up to 30 days, show day/month
        formattedDate = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
      } else {
        // For longer periods, show month/year
        formattedDate = date.toLocaleDateString([], { month: 'short', year: '2-digit' });
      }
      
      return {
        date: date.toISOString(),
        price: point.price,
        formattedDate
      };
    });
  };

  // Format price with appropriate precision
  const formatPrice = (price: number) => {
    if (price < 0.01) return `$${price.toFixed(6)}`;
    if (price < 1) return `$${price.toFixed(4)}`;
    if (price < 1000) return `$${price.toFixed(2)}`;
    return `$${price.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  };

  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded shadow-md border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">{data.formattedDate}</p>
          <p className="font-bold text-gray-800 dark:text-white">
            {formatPrice(data.price)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mt-4 w-full bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800 dark:text-white">
          {coinName} ({coinSymbol}) Price History
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setTimeframe(1)}
            className={`px-2 py-1 text-xs rounded ${
              timeframe === 1
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            24h
          </button>
          <button
            onClick={() => setTimeframe(7)}
            className={`px-2 py-1 text-xs rounded ${
              timeframe === 7
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            7d
          </button>
          <button
            onClick={() => setTimeframe(30)}
            className={`px-2 py-1 text-xs rounded ${
              timeframe === 30
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            30d
          </button>
        </div>
      </div>

      {loading ? (
        <div className="h-52 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : error ? (
        <div className="h-52 flex items-center justify-center text-danger">
          <p>{error}</p>
        </div>
      ) : historyData.length === 0 ? (
        <div className="h-52 flex items-center justify-center text-gray-500 dark:text-gray-400">
          <p>No historical data available</p>
        </div>
      ) : (
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={historyData}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#eaeaea" />
              <XAxis
                dataKey="formattedDate"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                minTickGap={20}
              />
              <YAxis
                tickFormatter={formatPrice}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                width={60}
                domain={['dataMin', 'dataMax']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="price"
                stroke={color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default CryptoChart; 