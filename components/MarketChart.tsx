import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';

interface ChartDataPoint {
  timestamp: number;
  value: number;
}

interface MarketChartProps {
  data: ChartDataPoint[];
  color: string;
  height?: number;
  tooltipEnabled?: boolean;
  areaEnabled?: boolean;
  gradientId?: string;
  strokeWidth?: number;
}

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const date = new Date(label);
    const formattedDate = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    return (
      <div className="bg-white p-2 rounded shadow-md border border-gray-200">
        <p className="text-xs text-gray-500">{formattedDate}</p>
        <p className="text-sm font-medium">
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            notation: 'compact',
            maximumFractionDigits: 2
          }).format(payload[0].value)}
        </p>
      </div>
    );
  }

  return null;
};

export const MarketChart: React.FC<MarketChartProps> = ({ 
  data, 
  color,
  height = 100,
  tooltipEnabled = true,
  areaEnabled = true,
  gradientId = 'marketGradient',
  strokeWidth = 2
}) => {
  // Format timestamp to be more readable
  const formattedData = data.map(item => ({
    ...item,
    formattedDate: new Date(item.timestamp).toLocaleDateString()
  }));

  if (!data || data.length === 0) {
    return (
      <div 
        className="flex items-center justify-center bg-gray-50 rounded" 
        style={{ height }}
      >
        <p className="text-sm text-gray-400">No chart data available</p>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        {areaEnabled ? (
          <AreaChart
            data={formattedData}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="timestamp" 
              tick={false}
              axisLine={false}
              hide={true}
            />
            <YAxis 
              domain={['auto', 'auto']}
              tick={false}
              axisLine={false}
              hide={true}
            />
            {tooltipEnabled && <Tooltip content={<CustomTooltip />} />}
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke={color} 
              strokeWidth={strokeWidth}
              fillOpacity={1}
              fill={`url(#${gradientId})`}
              activeDot={{ r: 4 }}
              isAnimationActive={false}
            />
          </AreaChart>
        ) : (
          <LineChart
            data={formattedData}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <XAxis 
              dataKey="timestamp" 
              tick={false}
              axisLine={false}
              hide={true}
            />
            <YAxis 
              domain={['auto', 'auto']}
              tick={false}
              axisLine={false}
              hide={true}
            />
            {tooltipEnabled && <Tooltip content={<CustomTooltip />} />}
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={color} 
              strokeWidth={strokeWidth}
              dot={false}
              isAnimationActive={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default MarketChart; 