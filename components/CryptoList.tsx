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
      <div className="w-full py-8 text-center">
        <div
          className="bg-black/50 border-2 border-neon-magenta p-8 rounded-lg shadow-lg inline-block max-w-md mx-auto relative"
          style={{ boxShadow: "0 0 15px var(--neon-magenta)" }}
        >
          <svg
            className="mx-auto mb-6 text-neon-magenta"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ filter: "drop-shadow(0 0 5px var(--neon-magenta))" }}
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <h3 className="neon-title mb-4">No Cryptocurrencies Found</h3>
          <p className="neon-text-secondary">
            The digital assets you seek are hidden in the void. Try a different
            search.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredAndSortedCoins.map((coin) => (
        <CoinCard key={coin.id} coin={coin} />
      ))}
    </div>
  );
};

export default CryptoList;
