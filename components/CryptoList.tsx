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
      <div className="w-full p-8 text-center">
        <div className="bg-vintage-beige/40 border-2 border-vintage-teal/30 p-6 rounded shadow-md inline-block max-w-md mx-auto relative">
          {/* Decorative corners */}
          <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-vintage-teal/80"></div>
          <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-vintage-teal/80"></div>
          <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-vintage-teal/80"></div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-vintage-teal/80"></div>

          <svg
            className="mx-auto mb-4 text-vintage-orange"
            width="48"
            height="48"
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
          <h3 className="text-vintage-dark text-xl mb-2 font-bold">
            No treasures found
          </h3>
          <p className="text-vintage-dark/70">
            The coins you seek are hidden elsewhere. Try a different search
            term.
          </p>

          {/* Decorative ink splatter */}
          <div className="absolute -bottom-6 right-4">
            <svg width="40" height="20" viewBox="0 0 40 20" fill="none">
              <path
                d="M2,10 C5,5 10,2 20,8 C30,14 35,12 38,8"
                stroke="rgba(79, 70, 60, 0.4)"
                strokeWidth="1"
                fill="none"
              />
              <circle cx="35" cy="8" r="3" fill="rgba(79, 70, 60, 0.2)" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Decorative header */}
      <div className="w-full flex justify-center mb-6">
        <div className="relative">
          <div className="h-px w-48 bg-gradient-to-r from-transparent via-vintage-teal/50 to-transparent absolute top-1/2 -left-52"></div>
          <div className="h-px w-48 bg-gradient-to-r from-vintage-teal/50 via-transparent to-transparent absolute top-1/2 -right-52"></div>
          <span className="text-vintage-dark/60 inline-block px-4 text-sm italic">
            {filteredAndSortedCoins.length} coins discovered
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {filteredAndSortedCoins.map((coin) => (
          <CoinCard key={coin.id} coin={coin} />
        ))}
      </div>

      {/* Decorative footer */}
      <div className="w-full flex justify-center mt-8 mb-14">
        <img
          src="/images/scroll-bottom.svg"
          alt=""
          className="w-32 h-8 opacity-50"
        />
      </div>
    </div>
  );
};

export default CryptoList;
