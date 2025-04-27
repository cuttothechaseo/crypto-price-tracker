import React from "react";

interface CoinChartProps {
  coinId: string;
  chartColor?: string;
}

const CoinChart: React.FC<CoinChartProps> = ({ coinId, chartColor }) => {
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

  // Use provided chartColor or determine based on coinId
  const lineColor =
    chartColor ||
    (coinId.includes("bitcoin")
      ? "#00D4FF" // Cyan for Bitcoin
      : coinId.includes("ethereum")
      ? "#FF00FF" // Magenta for Ethereum
      : coinId.includes("tether")
      ? "#39FF14" // Green for Tether
      : "#00D4FF"); // Default cyan

  const chartFill = `${lineColor}20`; // 20% opacity version of the line color

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
            stroke="#B0B0B0"
            strokeWidth="0.5"
            strokeDasharray="1 1"
            strokeOpacity="0.2"
          />
          <line
            x1="0"
            y1="20"
            x2="100"
            y2="20"
            stroke="#B0B0B0"
            strokeWidth="0.5"
            strokeDasharray="1 1"
            strokeOpacity="0.2"
          />
          <line
            x1="0"
            y1="30"
            x2="100"
            y2="30"
            stroke="#B0B0B0"
            strokeWidth="0.5"
            strokeDasharray="1 1"
            strokeOpacity="0.2"
          />
          <line
            x1="0"
            y1="40"
            x2="100"
            y2="40"
            stroke="#B0B0B0"
            strokeWidth="0.5"
            strokeDasharray="1 1"
            strokeOpacity="0.2"
          />

          {/* Vertical time indicators */}
          <line
            x1="25"
            y1="0"
            x2="25"
            y2="50"
            stroke="#B0B0B0"
            strokeWidth="0.5"
            strokeDasharray="1 1"
            strokeOpacity="0.2"
          />
          <line
            x1="50"
            y1="0"
            x2="50"
            y2="50"
            stroke="#B0B0B0"
            strokeWidth="0.5"
            strokeDasharray="1 1"
            strokeOpacity="0.2"
          />
          <line
            x1="75"
            y1="0"
            x2="75"
            y2="50"
            stroke="#B0B0B0"
            strokeWidth="0.5"
            strokeDasharray="1 1"
            strokeOpacity="0.2"
          />

          {/* Chart area */}
          <polygon points={pathData} fill={chartFill} />

          {/* Chart line */}
          <polyline
            points={pathData.split(" 100,50 0,50")[0]}
            fill="none"
            stroke={lineColor}
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 3px ${lineColor})` }}
          />

          {/* Circles at data points for emphasis */}
          {pathData
            .split(" 100,50 0,50")[0]
            .split(" ")
            .map((point, index) => {
              const [x, y] = point.split(",");
              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="1.5"
                  fill={lineColor}
                  style={{ filter: `drop-shadow(0 0 2px ${lineColor})` }}
                />
              );
            })}
        </svg>
      </div>

      {/* Chart message - only show for mobile or if specifically needed */}
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black/50 md:hidden backdrop-blur-sm">
        <div className="text-center">
          <p className="text-white font-bold mb-2 text-glow">
            Chart data for {coinId.toUpperCase()}
          </p>
          <p className="text-sm text-gray-300 opacity-80">
            Interactive charts coming soon
          </p>
        </div>
      </div>

      {/* Neon corner elements */}
      <div
        className="absolute top-0 left-0 w-5 h-5 border-t border-l opacity-50"
        style={{
          borderColor: lineColor,
          boxShadow: `0 0 5px ${lineColor}`,
          borderWidth: "2px",
        }}
      ></div>
      <div
        className="absolute top-0 right-0 w-5 h-5 border-t border-r opacity-50"
        style={{
          borderColor: lineColor,
          boxShadow: `0 0 5px ${lineColor}`,
          borderWidth: "2px",
        }}
      ></div>
      <div
        className="absolute bottom-0 left-0 w-5 h-5 border-b border-l opacity-50"
        style={{
          borderColor: lineColor,
          boxShadow: `0 0 5px ${lineColor}`,
          borderWidth: "2px",
        }}
      ></div>
      <div
        className="absolute bottom-0 right-0 w-5 h-5 border-b border-r opacity-50"
        style={{
          borderColor: lineColor,
          boxShadow: `0 0 5px ${lineColor}`,
          borderWidth: "2px",
        }}
      ></div>
    </div>
  );
};

export default CoinChart;
