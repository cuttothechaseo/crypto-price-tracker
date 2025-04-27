import React, { useEffect, useState } from "react";
import Head from "next/head";
import { fetchCryptoData } from "../utils/fetchCrypto";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import CryptoList from "../components/CryptoList";
import MarketOverview from "../components/MarketOverview";
import { Coin } from "../types";
import SortDropdown from "../components/SortDropdown";

export default function Home() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("rank");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    fetchData();

    // Refresh data every 5 minutes
    const intervalId = setInterval(fetchData, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchCryptoData();
      setCoins(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Error fetching cryptocurrency data:", err);
      setError("Failed to fetch market data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleSortChange = (option: string) => {
    setSortBy(option);
  };

  return (
    <div className="bg-vintage-bg min-h-screen font-vintage-body relative overflow-hidden">
      {/* Enhanced background pattern overlay */}
      <div
        className="absolute inset-0 z-0 bg-vintage-pattern opacity-15"
        style={{
          backgroundSize: "400px",
          backgroundRepeat: "repeat",
        }}
      ></div>

      <Head>
        <title>Cryptocurrency Price Tracker</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <meta
          name="description"
          content="Track cryptocurrency prices and market data"
        />
        <link rel="icon" href="/images/artistic-bitcoin.svg" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Merriweather:wght@300;400;700&family=Cinzel:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <Navbar lastUpdated={lastUpdated} />

      <main className="relative z-10 container mx-auto px-3 sm:px-6 py-4 sm:py-8">
        <div className="mb-6 sm:mb-12 flex flex-col lg:flex-row justify-between items-center gap-4 sm:gap-6">
          {/* Market Overview Button with ornate styling */}
          <div className="w-full lg:w-1/3">
            <div className="relative">
              <div
                className="bg-vintage-card-bg px-4 sm:px-6 py-3 sm:py-4 rounded-lg border-3 sm:border-4 border-vintage-card-border shadow-vintage-card text-center relative z-10"
                style={{
                  backgroundImage: "url('/images/vintage-texture.svg')",
                  backgroundRepeat: "repeat",
                  backgroundSize: "200px",
                }}
              >
                {/* Corner decorations - smaller on mobile */}
                <div className="absolute top-0 left-0 w-6 sm:w-8 h-6 sm:h-8 border-t-2 sm:border-t-3 border-l-2 sm:border-l-3 border-vintage-accent-pattern opacity-60 rounded-tl-sm"></div>
                <div className="absolute top-0 right-0 w-6 sm:w-8 h-6 sm:h-8 border-t-2 sm:border-t-3 border-r-2 sm:border-r-3 border-vintage-accent-pattern opacity-60 rounded-tr-sm"></div>
                <div className="absolute bottom-0 left-0 w-6 sm:w-8 h-6 sm:h-8 border-b-2 sm:border-b-3 border-l-2 sm:border-l-3 border-vintage-accent-pattern opacity-60 rounded-bl-sm"></div>
                <div className="absolute bottom-0 right-0 w-6 sm:w-8 h-6 sm:h-8 border-b-2 sm:border-b-3 border-r-2 sm:border-r-3 border-vintage-accent-pattern opacity-60 rounded-br-sm"></div>

                <h2 className="text-xl sm:text-2xl font-vintage-header text-vintage-header-text relative z-10 flex items-center justify-center">
                  <span className="hidden sm:inline-block w-5 sm:w-7 h-px bg-vintage-card-border opacity-70 mr-2 sm:mr-3"></span>
                  Market Overview
                  <span className="hidden sm:inline-block w-5 sm:w-7 h-px bg-vintage-card-border opacity-70 ml-2 sm:ml-3"></span>
                </h2>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 mt-4 sm:mt-0">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search cryptocurrencies..."
            />
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center my-8 sm:my-16">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-vintage-accent-pattern"></div>
            <span className="ml-3 text-vintage-text text-sm sm:text-base font-vintage-body">
              Loading market data...
            </span>
          </div>
        )}

        {error && (
          <div className="bg-red-900/30 border-3 sm:border-4 border-red-700 text-red-300 p-4 sm:p-6 rounded-lg my-6 sm:my-8 text-center">
            <p className="font-vintage-body text-base sm:text-lg font-semibold mb-2">
              MARKET DATA UNAVAILABLE
            </p>
            <p className="font-vintage-body text-sm sm:text-base mb-4">
              {error}
            </p>
            <button
              onClick={fetchData}
              className="px-4 sm:px-6 py-2 bg-vintage-link text-white text-sm sm:text-base font-semibold rounded hover:bg-vintage-link-hover transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="my-6 sm:my-8">
              <CryptoList
                coins={coins}
                searchTerm={searchTerm}
                sortBy={sortBy}
              />
            </div>

            {/* Ornate footer */}
            <div className="relative text-center py-4 sm:py-6 mt-6 sm:mt-10">
              <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-vintage-card-border to-transparent opacity-50"></div>
              <div className="flex justify-center my-2">
                <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-vintage-card-border mx-1 opacity-60"></div>
                <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-vintage-card-border mx-1 opacity-60"></div>
                <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-vintage-card-border mx-1 opacity-60"></div>
              </div>
              <p className="text-vintage-text font-vintage-body text-[10px] sm:text-xs">
                Data provided by CoinGecko API | Updated every 5 minutes
              </p>
              <div className="absolute left-0 right-0 bottom-0 h-px bg-gradient-to-r from-transparent via-vintage-card-border to-transparent opacity-50"></div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
