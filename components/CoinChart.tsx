import React from "react";

interface CoinChartProps {
  coinId: string;
}

const CoinChart: React.FC<CoinChartProps> = ({ coinId }) => {
  return (
    <div className="p-4 text-center">
      <p className="text-vintage-dark mb-2">
        Chart data for {coinId} is currently unavailable.
      </p>
      <p className="text-sm text-vintage-dark/70">
        Price history visualization will be implemented in a future update.
      </p>
    </div>
  );
};

export default CoinChart;
