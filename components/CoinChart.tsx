import React from "react";

interface CoinChartProps {
  coinId: string;
}

const CoinChart: React.FC<CoinChartProps> = ({ coinId }) => {
  // Generate random chart data based on coinId for consistent display
  const seed = coinId
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const random = (min: number, max: number) => {
    const x = Math.sin(seed) * 10000;
    const result = min + (Math.abs(x) % (max - min));
    return result;
  };

  // Generate price points for chart
  const generatePoints = () => {
    const points = [];
    let currentY = random(25, 45);

    // Add starting point
    points.push(`0,${currentY}`);

    // Create a naturally varying line with 10 points
    for (let i = 1; i <= 10; i++) {
      const variation = random(-8, 8) * (Math.sin(i * seed) * 0.5);
      currentY = Math.max(5, Math.min(45, currentY + variation));
      points.push(`${i * 10},${currentY}`);
    }

    // Add bottom corners for area fill
    points.push(`100,50 0,50`);

    return points.join(" ");
  };

  const chartColor =
    coinId.includes("bitcoin") || parseFloat(coinId) % 2 === 0
      ? "rgba(21, 128, 61, 0.7)" // Green for bitcoin and even ids
      : "rgba(180, 62, 37, 0.7)"; // Red for odd ids

  const chartFill =
    coinId.includes("bitcoin") || parseFloat(coinId) % 2 === 0
      ? "rgba(21, 128, 61, 0.1)"
      : "rgba(180, 62, 37, 0.1)";

  const pathData = generatePoints();

  return (
    <div className="p-4 text-center relative overflow-hidden min-h-[120px]">
      {/* Decorative chart lines with random data */}
      <div className="absolute inset-0 opacity-90 pointer-events-none">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 50"
          preserveAspectRatio="none"
          className="overflow-visible"
        >
          {/* Grid lines */}
          <line
            x1="0"
            y1="10"
            x2="100"
            y2="10"
            stroke="rgba(120, 53, 15, 0.1)"
            strokeWidth="0.5"
            strokeDasharray="1 1"
          />
          <line
            x1="0"
            y1="20"
            x2="100"
            y2="20"
            stroke="rgba(120, 53, 15, 0.1)"
            strokeWidth="0.5"
            strokeDasharray="1 1"
          />
          <line
            x1="0"
            y1="30"
            x2="100"
            y2="30"
            stroke="rgba(120, 53, 15, 0.1)"
            strokeWidth="0.5"
            strokeDasharray="1 1"
          />
          <line
            x1="0"
            y1="40"
            x2="100"
            y2="40"
            stroke="rgba(120, 53, 15, 0.1)"
            strokeWidth="0.5"
            strokeDasharray="1 1"
          />

          {/* Vertical time indicators */}
          <line
            x1="25"
            y1="0"
            x2="25"
            y2="50"
            stroke="rgba(120, 53, 15, 0.1)"
            strokeWidth="0.5"
            strokeDasharray="1 1"
          />
          <line
            x1="50"
            y1="0"
            x2="50"
            y2="50"
            stroke="rgba(120, 53, 15, 0.1)"
            strokeWidth="0.5"
            strokeDasharray="1 1"
          />
          <line
            x1="75"
            y1="0"
            x2="75"
            y2="50"
            stroke="rgba(120, 53, 15, 0.1)"
            strokeWidth="0.5"
            strokeDasharray="1 1"
          />

          {/* Chart area */}
          <polygon points={pathData} fill={chartFill} />

          {/* Chart line */}
          <polyline
            points={pathData.split(" 100,50 0,50")[0]}
            fill="none"
            stroke={chartColor}
            strokeWidth="1.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* Circles at data points for emphasis */}
          {pathData
            .split(" 100,50 0,50")[0]
            .split(" ")
            .map((point, index) => {
              const [x, y] = point.split(",");
              return (
                <circle key={index} cx={x} cy={y} r="1" fill={chartColor} />
              );
            })}
        </svg>
      </div>

      {/* Chart message - only show for mobile or if specifically needed */}
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-vintage-card-bg/50 md:hidden">
        <div className="text-center">
          <p className="text-vintage-header-text font-vintage-body mb-2 font-semibold">
            Chart data for {coinId.toUpperCase()}
          </p>
          <p className="text-sm text-vintage-text opacity-80 font-vintage-body">
            Interactive charts coming soon
          </p>
        </div>
      </div>

      {/* Ornate corner elements */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-vintage-card-border opacity-50"></div>
      <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-vintage-card-border opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-vintage-card-border opacity-50"></div>
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-vintage-card-border opacity-50"></div>
    </div>
  );
};

export default CoinChart;
