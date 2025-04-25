import React, { useState } from "react";
import Image from "next/image";
import {
  formatPrice,
  formatMarketCap,
  formatPercentage,
} from "../utils/formatters";
import dynamic from "next/dynamic";
import { Coin } from "../types";

// Dynamically import the chart to avoid SSR issues
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

  return (
    <div className="fantasy-card p-5 hover:shadow-scroll transition-all duration-300">
      {/* Top decorative elements */}
      <div className="absolute top-0 left-0 w-full overflow-hidden">
        <Image
          src="/images/scroll-top.svg"
          alt="Scroll decoration"
          width={100}
          height={40}
          className="w-full h-auto"
        />
      </div>

      <div className="mb-4 mt-2">
        <div className="flex items-center mb-3">
          <div className="relative w-12 h-12 mr-3 p-1 rounded-full border-2 border-border bg-card shadow-sm">
            <Image
              src={coin.image}
              alt={`${coin.name} logo`}
              width={40}
              height={40}
              className="rounded-full"
            />
          </div>
          <div>
            <h3 className="font-serif text-xl text-accent mb-0">{coin.name}</h3>
            <span className="text-highlight uppercase text-sm font-semibold font-body">
              {coin.symbol}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-4 border-t border-b border-border/40 py-3">
        <div className="flex justify-between items-baseline mb-2">
          <span className="text-text/80 text-sm font-medium font-body">
            Current Price
          </span>
          <span className="font-serif font-bold text-xl text-accent">
            {formatPrice(coin.current_price)}
          </span>
        </div>

        <div className="flex justify-between items-baseline mb-2">
          <span className="text-text/80 text-sm font-medium font-body">
            24h Change
          </span>
          <span
            className={`font-semibold font-body ${
              coin.price_change_percentage_24h >= 0
                ? "text-success"
                : "text-danger"
            }`}
          >
            {formatPercentage(coin.price_change_percentage_24h)}
          </span>
        </div>

        <div className="flex justify-between items-baseline">
          <span className="text-text/80 text-sm font-medium font-body">
            Market Cap
          </span>
          <span className="font-medium text-text font-body">
            {formatMarketCap(coin.market_cap)}
          </span>
        </div>
      </div>

      <button
        onClick={toggleChart}
        className="fantasy-btn w-full py-2 flex justify-center items-center gap-2"
      >
        <span className="font-body">
          {showChart ? "Hide Chart" : "Show Chart"}
        </span>
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

      {showChart && (
        <div className="mt-4 py-3 rounded-lg bg-card/50 border-2 border-border/30">
          <CoinChart coinId={coin.id} />
        </div>
      )}

      {/* Bottom decorative element */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <Image
          src="/images/scroll-bottom.svg"
          alt="Scroll decoration"
          width={100}
          height={40}
          className="w-full h-auto"
        />
      </div>
    </div>
  );
};

export default CoinCard;
