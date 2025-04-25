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
  const [showHighlights, setShowHighlights] = useState(true);

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
      setError("Failed to load cryptocurrency data. Please try again later.");
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

  const handleHighlightsToggle = (showHighlights: boolean) => {
    setShowHighlights(showHighlights);
  };

  return (
    <div className="bg-background min-h-screen">
      <Head>
        <title>Cryptocurrency Price Tracker</title>
        <meta
          name="description"
          content="Track cryptocurrency prices and market data"
        />
        <link rel="icon" href="/images/artistic-bitcoin.svg" />
      </Head>

      <Navbar onHighlightsToggle={handleHighlightsToggle} />

      <div className="vintage-border min-h-[calc(100vh-76px)] p-8">
        <main className="fantasy-container mx-auto my-8">
          <h1 className="fantasy-header">Cryptocurrency Price Tracker</h1>

          {lastUpdated && (
            <p className="fantasy-subheader">
              Last updated: {lastUpdated.toLocaleString()}
            </p>
          )}

          {loading ? (
            <div className="flex justify-center items-center my-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-highlight"></div>
              <span className="ml-3 text-accent font-body">
                Loading market data...
              </span>
            </div>
          ) : error ? (
            <div className="bg-danger/10 border-2 border-danger/30 text-danger p-6 rounded-lg my-8 text-center">
              <p className="font-body text-lg">{error}</p>
              <button
                onClick={fetchData}
                className="fantasy-btn mt-4 px-6 py-2 bg-highlight hover:bg-highlight/90 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              {showHighlights && <MarketOverview />}

              <div className="my-8 flex flex-col md:flex-row items-center justify-between">
                <div className="w-full md:w-3/4">
                  <SearchBar onSearch={handleSearch} />
                </div>
                <div className="w-full md:w-1/4 flex justify-end">
                  <SortDropdown
                    onSortChange={handleSortChange}
                    currentSort={sortBy}
                  />
                </div>
              </div>

              <div className="my-8">
                <CryptoList
                  coins={coins}
                  searchTerm={searchTerm}
                  sortBy={sortBy}
                />
              </div>

              <div className="fantasy-divider"></div>

              <div className="text-center text-text/70 font-body text-sm py-4">
                Data provided by CoinGecko API | Updated every 5 minutes
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
