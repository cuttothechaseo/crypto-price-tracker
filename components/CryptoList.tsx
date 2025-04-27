import React, { useMemo } from "react";
import CoinCard from "./CoinCard";
import { type Coin } from "../types";

interface CryptoListProps {
  coins: Coin[];
  searchTerm: string;
  sortBy: string;
}

const CryptoList: React.FC<CryptoListProps> = ({
  coins,
  searchTerm,
  sortBy,
}) => {
  const filteredAndSortedCoins = useMemo(() => {
    // First filter by search term
    const filtered = coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Then sort by selected criteria
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "rank":
          return a.market_cap_rank - b.market_cap_rank;
        case "name":
          return a.name.localeCompare(b.name);
        case "price":
          return b.current_price - a.current_price;
        case "marketCap":
          return b.market_cap - a.market_cap;
        case "priceChange":
          return b.price_change_percentage_24h - a.price_change_percentage_24h;
        default:
          return a.market_cap_rank - b.market_cap_rank;
      }
    });
  }, [coins, searchTerm, sortBy]);

  if (filteredAndSortedCoins.length === 0) {
    return (
      <div className="w-full p-4 sm:p-8 text-center">
        <div className="bg-vintage-card-bg border-3 sm:border-4 border-vintage-card-border p-4 sm:p-8 rounded-lg shadow-md inline-block max-w-md mx-auto relative">
          {/* Decorative corners */}
          <div className="absolute -top-1 -left-1 w-4 sm:w-5 h-4 sm:h-5 border-t-2 border-l-2 border-vintage-accent-pattern"></div>
          <div className="absolute -top-1 -right-1 w-4 sm:w-5 h-4 sm:h-5 border-t-2 border-r-2 border-vintage-accent-pattern"></div>
          <div className="absolute -bottom-1 -left-1 w-4 sm:w-5 h-4 sm:h-5 border-b-2 border-l-2 border-vintage-accent-pattern"></div>
          <div className="absolute -bottom-1 -right-1 w-4 sm:w-5 h-4 sm:h-5 border-b-2 border-r-2 border-vintage-accent-pattern"></div>

          <svg
            className="mx-auto mb-3 sm:mb-4 text-vintage-card-border w-8 h-8 sm:w-12 sm:h-12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <h3 className="text-vintage-header-text text-lg sm:text-xl mb-2 font-bold font-vintage-header">
            No Cryptocurrencies Found
          </h3>
          <p className="text-vintage-text text-sm sm:text-base">
            The coins you seek are hidden elsewhere. Try a different search
            term.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Ornate frame for the entire content */}
      <div className="absolute -inset-1 -z-10 border-ornate-border border-6 sm:border-8 border-opacity-30 rounded-lg"></div>

      {/* Count indicator with decorative elements */}
      <div className="flex justify-center mb-4 sm:mb-6">
        <div className="relative py-1 sm:py-2 px-4 sm:px-8 bg-vintage-card-bg border-2 border-vintage-card-border rounded-md shadow-sm">
          <span className="text-vintage-header-text font-vintage-body text-sm sm:text-base font-bold">
            {filteredAndSortedCoins.length} Cryptocurrencies
          </span>

          {/* Decorative flourish on left - hide on small screens */}
          <div className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 hidden sm:flex items-center">
            <svg
              className="h-5 w-5 sm:h-6 sm:w-6 text-vintage-card-border"
              viewBox="0 0 24 24"
              fill="currentColor"
              opacity="0.7"
            >
              <path
                d="M5,12 L19,12 M12,5 L12,19"
                stroke="currentColor"
                strokeWidth="1"
                transform="rotate(45, 12, 12)"
              ></path>
            </svg>
          </div>

          {/* Decorative flourish on right - hide on small screens */}
          <div className="absolute right-0 top-1/2 translate-x-full -translate-y-1/2 hidden sm:flex items-center">
            <svg
              className="h-5 w-5 sm:h-6 sm:w-6 text-vintage-card-border"
              viewBox="0 0 24 24"
              fill="currentColor"
              opacity="0.7"
            >
              <path
                d="M5,12 L19,12 M12,5 L12,19"
                stroke="currentColor"
                strokeWidth="1"
                transform="rotate(45, 12, 12)"
              ></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Card grid with ornate background - improved for mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-10 relative">
        {filteredAndSortedCoins.map((coin) => (
          <CoinCard key={coin.id} coin={coin} />
        ))}
      </div>

      {/* Decorative footer element */}
      <div className="flex justify-center mt-6 sm:mt-10 mb-4 sm:mb-6">
        <div className="relative flex items-center w-2/3 sm:w-1/2">
          <div className="flex-grow border-t-1 sm:border-t-2 border-vintage-card-border opacity-30"></div>
          <div className="mx-2 sm:mx-4">
            <svg
              className="w-6 h-6 sm:w-8 sm:h-8 text-vintage-card-border opacity-60"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                d="M12,3 L16,7 L12,11 L8,7 z"
                fill="currentColor"
                opacity="0.5"
              />
              <path
                d="M12,12 L16,16 L12,20 L8,16 z"
                fill="currentColor"
                opacity="0.5"
              />
            </svg>
          </div>
          <div className="flex-grow border-t-1 sm:border-t-2 border-vintage-card-border opacity-30"></div>
        </div>
      </div>
    </div>
  );
};

export default CryptoList;
