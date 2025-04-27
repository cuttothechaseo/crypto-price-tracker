import React, { useState } from "react";
import Image from "next/image";
import {
  formatPrice,
  formatMarketCap,
  formatPercentage,
} from "../utils/formatters";
import dynamic from "next/dynamic";
import { Coin } from "../types";

// Dynamically import the chart
const CoinChart = dynamic(() => import("../components/CoinChart"), {
  ssr: false,
});

interface CoinCardProps {
  coin: Coin;
}

const CoinCard: React.FC<CoinCardProps> = ({ coin }) => {
  const [showChart, setShowChart] = useState(false);

  const toggleChart = () => {
    setShowChart(!showChart);
  };

  // Determine card type based on coin
  const getCardType = () => {
    const symbol = coin.symbol.toLowerCase();
    if (symbol === "btc") return "neon-card-bitcoin";
    if (symbol === "eth") return "neon-card-ethereum";
    if (symbol === "usdt") return "neon-card-tether";
    if (symbol === "xrp") return "neon-card-xrp";
    if (symbol === "bnb") return "neon-card-bnb";
    if (symbol === "sol") return "neon-card-solana";
    return "neon-card-other";
  };

  // Get color for the icon glow effect based on card type
  const getIconColor = () => {
    const symbol = coin.symbol.toLowerCase();
    if (symbol === "btc") return "#00D4FF"; // Cyan
    if (symbol === "eth") return "#FF00FF"; // Magenta
    if (symbol === "usdt") return "#39FF14"; // Green
    if (symbol === "xrp") return "#800080"; // Purple
    if (symbol === "bnb") return "#FFFF00"; // Yellow
    if (symbol === "sol") return "#00CED1"; // Teal
    return "#00D4FF"; // Cyan for other coins
  };

  // Get color for the chart line
  const getChartColor = () => {
    const symbol = coin.symbol.toLowerCase();
    if (symbol === "btc") return "#00D4FF"; // Cyan
    if (symbol === "eth") return "#FF00FF"; // Magenta
    if (symbol === "usdt") return "#39FF14"; // Green
    if (symbol === "xrp") return "#800080"; // Purple
    if (symbol === "bnb") return "#FFFF00"; // Yellow
    if (symbol === "sol") return "#00CED1"; // Teal
    return "#00D4FF"; // Cyan for other coins
  };

  return (
    <div className="relative">
      <div className={`neon-card ${getCardType()}`}>
        {/* Coin header with icon and name */}
        <div className="neon-coin-header">
          <div className="relative w-10 h-10 mr-3 flex-shrink-0">
            <Image
              src={coin.image}
              alt={`${coin.name} logo`}
              fill
              style={{
                objectFit: "contain",
                filter: `drop-shadow(0 0 5px ${getIconColor()})`,
              }}
              className="rounded-full"
            />
          </div>
          <div>
            <h3 className="neon-coin-name">{coin.name}</h3>
            <div className="neon-coin-symbol">{coin.symbol.toUpperCase()}</div>
          </div>
        </div>

        {/* Price with animation */}
        <div className="neon-price">{formatPrice(coin.current_price)}</div>

        {/* Data rows */}
        <div className="neon-data-row">
          <div className="neon-data-label">24h Change</div>
          <div
            className={
              coin.price_change_percentage_24h >= 0
                ? "neon-positive"
                : "neon-negative"
            }
            style={{
              boxShadow:
                coin.price_change_percentage_24h >= 0
                  ? "0 0 5px #39FF14"
                  : "0 0 5px #FF0000",
            }}
          >
            {coin.price_change_percentage_24h >= 0 ? "+" : ""}
            {formatPercentage(coin.price_change_percentage_24h)}
          </div>
        </div>

        <div className="neon-data-row">
          <div className="neon-data-label">Market Cap</div>
          <div className="neon-data-value">
            {formatMarketCap(coin.market_cap)}
          </div>
        </div>

        {/* Chart toggle button */}
        <button
          onClick={toggleChart}
          className="neon-button flex items-center justify-center w-full mt-4"
        >
          <span>{showChart ? "Hide Chart" : "Show Chart"}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-4 w-4 ml-2 transition-transform duration-300 ${
              showChart ? "rotate-180" : ""
            }`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Chart display area */}
        {showChart && (
          <div className="neon-chart-container">
            <CoinChart coinId={coin.id} chartColor={getChartColor()} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CoinCard;
