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

  // Color class for percentage change
  const changeColorClass =
    coin.price_change_percentage_24h >= 0
      ? "text-vintage-accent-green"
      : "text-vintage-accent-red";

  const getSymbolIcon = (symbol: string) => {
    const commonIcons: Record<string, JSX.Element> = {
      btc: (
        <svg
          viewBox="0 0 24 24"
          className="w-5 h-5 text-amber-600 fill-current"
        >
          <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-18.5a8.5 8.5 0 100 17 8.5 8.5 0 000-17z" />
          <path d="M14.5 10.675c.4-.255.7-.65.75-1.425.1-1.35-.825-2.125-2.225-2.3V6h-1v.975c-.25 0-.5 0-.75.025V6h-1v1h-1.5v1h.8c.075 0 .15.025.2.025.05.025.075.05.075.125v3.75c0 .075-.025.125-.075.125-.05.025-.125.025-.2.025H9v1h1.5v1h1v-1c.25 0 .5.025.75.025V14h1v-.975c1.525-.15 2.5-1 2.5-2.45a2.025 2.025 0 00-1.25-1.9zM12.5 7.975c.75.05 1.1.325 1.1.95 0 .6-.375.9-1.1.95v-1.9zm-.75 5.025v-2.025c.85.05 1.275.35 1.275 1 0 .65-.425.975-1.275 1.025z" />
        </svg>
      ),
      eth: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-gray-600 fill-current">
          <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z" />
        </svg>
      ),
      usdt: (
        <svg
          viewBox="0 0 24 24"
          className="w-5 h-5 text-green-600 fill-current"
        >
          <path
            d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"
            fill="white"
          />
          <path d="M13.09 11.647v-2.02h3.122V7.205h-8.42v2.422h3.122v2.02c-3.496.13-6.114.858-6.114 1.724 0 .866 2.618 1.591 6.114 1.722v5.064h2.18v-5.064c3.497-.13 6.117-.856 6.117-1.722 0-.866-2.62-1.594-6.118-1.724h-.003zm0 2.945c-.076.004-1.356.09-2.182.09-.791 0-2.05-.073-2.147-.09v-.017c-.076-.013-1.256-.15-1.256-.611 0-.391.915-.595 1.255-.618v.922c.103.014 1.257.098 2.15.098.969 0 2.052-.098 2.181-.098l-.001-.928c1.01.056 1.256.292 1.256.618 0 .312-.307.528-1.256.613v.021z" />
        </svg>
      ),
      usdc: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-blue-600 fill-current">
          <path
            d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"
            fill="white"
          />
          <path d="M15.75 13.95v-1.125a1.88 1.88 0 00-1.875-1.875h-3.75A.375.375 0 019.75 10.575v-1.2a.375.375 0 01.375-.375h5.625V7.5h-2.25V6h-1.5v1.5h-1.875A1.88 1.88 0 008.25 9.375v1.2a1.88 1.88 0 001.875 1.875h3.75a.375.375 0 01.375.375v1.125a.375.375 0 01-.375.375H8.25V16.5h2.25V18h1.5v-1.5h1.875a1.88 1.88 0 001.875-1.875v-1.125a.375.375 0 00-.375-.375z" />
        </svg>
      ),
    };

    const lowerSymbol = symbol.toLowerCase();
    return commonIcons[lowerSymbol] || null;
  };

  return (
    <div className="relative group">
      {/* Enhanced ornate vintage card */}
      <div
        className="bg-vintage-card-bg rounded-lg p-5 shadow-vintage-card transition-all duration-300 
                  relative overflow-hidden border-4 border-vintage-card-border hover:shadow-lg"
        style={{
          backgroundImage: "url('/images/vintage-texture.svg')",
          backgroundRepeat: "repeat",
          backgroundSize: "200px",
        }}
      >
        {/* Ornate border decoration */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-vintage-card-border rounded-tl"></div>
          <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-vintage-card-border rounded-tr"></div>
          <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-vintage-card-border rounded-bl"></div>
          <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-vintage-card-border rounded-br"></div>

          {/* Ornate corner flourishes */}
          <div className="absolute top-3 left-3 w-3 h-3 rounded-full bg-vintage-accent-pattern opacity-80"></div>
          <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-vintage-accent-pattern opacity-80"></div>
          <div className="absolute bottom-3 left-3 w-3 h-3 rounded-full bg-vintage-accent-pattern opacity-80"></div>
          <div className="absolute bottom-3 right-3 w-3 h-3 rounded-full bg-vintage-accent-pattern opacity-80"></div>
        </div>

        {/* Top Section: Logo, Name, Symbol */}
        <div className="flex items-center mb-4 relative z-10">
          <div className="relative w-10 h-10 mr-3 flex-shrink-0">
            <Image
              src={coin.image}
              alt={`${coin.name} logo`}
              fill
              style={{ objectFit: "contain" }}
              className="rounded-full"
            />
          </div>
          <div className="flex-grow">
            <h3
              className="font-vintage-header text-xl text-vintage-header-text"
              title={coin.name}
            >
              {coin.name}
            </h3>
            <div className="flex items-center">
              <span className="text-vintage-card-border uppercase text-sm font-bold font-vintage-body">
                {coin.symbol}
              </span>
              {getSymbolIcon(coin.symbol)}
            </div>
          </div>
        </div>

        {/* Middle Section: Price, Change, Market Cap */}
        <div className="mb-5 space-y-4 relative z-10">
          <div className="flex justify-between items-baseline">
            <span className="text-vintage-text text-sm font-vintage-body font-semibold">
              Current Price
            </span>
            <span className="font-vintage-body font-bold text-lg text-vintage-header-text">
              {formatPrice(coin.current_price)}
            </span>
          </div>

          <div className="flex justify-between items-baseline">
            <span className="text-vintage-text text-sm font-vintage-body font-semibold">
              24h Change
            </span>
            <span className={`font-bold font-vintage-body ${changeColorClass}`}>
              {coin.price_change_percentage_24h >= 0 ? "+" : ""}
              {formatPercentage(coin.price_change_percentage_24h)}
            </span>
          </div>

          <div className="flex justify-between items-baseline">
            <span className="text-vintage-text text-sm font-vintage-body font-semibold">
              Market Cap
            </span>
            <span className="font-medium text-sm text-vintage-header-text font-vintage-body">
              {formatMarketCap(coin.market_cap)}
            </span>
          </div>
        </div>

        {/* Ornate Divider */}
        <div className="relative flex items-center my-4 z-10">
          <div className="flex-grow h-px bg-vintage-card-border opacity-40"></div>
          <div className="mx-2 flex items-center">
            <div className="w-1 h-1 rounded-full bg-vintage-card-border mx-0.5"></div>
            <div className="w-2 h-2 rounded-full bg-vintage-card-border mx-0.5"></div>
            <div className="w-1 h-1 rounded-full bg-vintage-card-border mx-0.5"></div>
          </div>
          <div className="flex-grow h-px bg-vintage-card-border opacity-40"></div>
        </div>

        {/* Bottom Section: Chart Toggle Button */}
        <div className="mt-auto relative z-10">
          <button
            onClick={toggleChart}
            className="w-full py-2 px-3 bg-vintage-card-bg border-2 border-vintage-card-border rounded-md
                      text-vintage-header-text hover:bg-vintage-card-border/10 transition-colors duration-200 
                      text-sm font-vintage-body font-bold flex justify-center items-center gap-2"
          >
            <span>{showChart ? "Hide Chart" : "Show Chart"}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 transition-transform duration-300 ${
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

          {/* Chart Display Area */}
          {showChart && (
            <div className="mt-4 p-3 rounded bg-vintage-card-bg/80 border-2 border-vintage-card-border">
              <CoinChart coinId={coin.id} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoinCard;
