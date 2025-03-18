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
  tooltipEnabled = false,
  areaEnabled = true,
  gradientId = 'marketGradient',
  strokeWidth = 1.5
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
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.15} />
                <stop offset="95%" stopColor={color} stopOpacity={0.01} />
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
              activeDot={tooltipEnabled ? { r: 4, strokeWidth: 0 } : false}
              dot={false}
              isAnimationActive={false}
            />
          </AreaChart>
        ) : (
          <LineChart
            data={formattedData}
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
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
              activeDot={tooltipEnabled ? { r: 4, strokeWidth: 0 } : false}
              isAnimationActive={false}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default MarketChart; 