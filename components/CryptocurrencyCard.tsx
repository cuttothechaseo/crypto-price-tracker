import { useState } from "react";
import { Coin } from "../types";
import CryptoPriceChart from "./CryptoPriceChart";
import { formatCurrency } from "../utils/formatters";
import { ChevronDown, ChevronUp, Activity } from "lucide-react";

interface CryptocurrencyCardProps {
  crypto: Coin;
}

const CryptocurrencyCard = ({ crypto }: CryptocurrencyCardProps) => {
  const [showChart, setShowChart] = useState(false);

  // Determine if price is positive or negative
  const isPriceUp = crypto.price_change_percentage_24h > 0;
  const priceChangeClass = isPriceUp ? "text-green-500" : "text-red-500";
  const Icon = isPriceUp ? ChevronUp : ChevronDown;

  // Format percentage with + or - sign
  const formattedPercentage = `${
    isPriceUp ? "+" : ""
  }${crypto.price_change_percentage_24h.toFixed(2)}%`;

  return (
    <div className="crypto-card relative overflow-hidden rounded-xl backdrop-blur-sm bg-black/40 border border-gray-800 p-4 shadow-lg transition-all duration-300 hover:shadow-xl hover:border-gray-700">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          <img
            src={crypto.image}
            alt={crypto.name}
            className="w-10 h-10 mr-3 rounded-full"
          />
          <div>
            <h3 className="font-bold text-white">{crypto.name}</h3>
            <p className="text-gray-400 uppercase text-xs">{crypto.symbol}</p>
          </div>
        </div>
        <div className={`flex items-center ${priceChangeClass}`}>
          <Icon size={18} className="mr-1" />
          <span className="font-medium">{formattedPercentage}</span>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-gray-400 text-xs mb-1">Current Price</p>
        <p className="text-white text-xl font-bold">
          {formatCurrency(crypto.current_price)}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <div>
          <p className="text-gray-400 text-xs mb-1">Market Cap</p>
          <p className="text-white font-medium">
            {formatCurrency(crypto.market_cap)}
          </p>
        </div>
        <div>
          <p className="text-gray-400 text-xs mb-1">Volume</p>
          <p className="text-white font-medium">
            {formatCurrency(crypto.total_volume || 0)}
          </p>
        </div>
      </div>

      {showChart && crypto.sparkline_in_7d?.price && (
        <div className="mt-4">
          <CryptoPriceChart
            data={crypto.sparkline_in_7d.price}
            coinId={crypto.id}
            days={7}
          />
        </div>
      )}

      <button
        onClick={() => setShowChart(!showChart)}
        className="w-full py-2 mt-2 rounded-lg bg-indigo-600/30 text-indigo-300 border border-indigo-600/50 hover:bg-indigo-600/40 transition-all flex items-center justify-center"
      >
        <Activity size={16} className="mr-2" />
        {showChart ? "Hide Chart" : "Show Chart"}
      </button>
    </div>
  );
};

export default CryptocurrencyCard;
