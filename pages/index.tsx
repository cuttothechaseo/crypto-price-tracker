import React, { useEffect, useState, useRef } from "react";
import Head from "next/head";
import {
  fetchCryptoData,
  lastApiRequest,
  MIN_REQUEST_INTERVAL,
} from "../utils/fetchCrypto";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import CryptoList from "../components/CryptoList";
import { Coin } from "../types";
import ParticlesBackground from "../components/ParticlesBackground";

// Only keep track of local time for UI purposes
let lastApiRequestTime = 0;

export default function Home() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("rank");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [throttled, setThrottled] = useState(false);
  const [nextRequestTime, setNextRequestTime] = useState<number>(0);

  // Keep a cache of the last successful data fetch
  const cachedData = useRef<{ coins: Coin[]; timestamp: number } | null>(null);

  useEffect(() => {
    // Set neon theme
    document.body.classList.add("neon-theme");

    fetchData();

    // Refresh data every minute, but respect the rate limiting
    const intervalId = setInterval(fetchData, 60 * 1000);

    // Update timestamp every second to keep the countdown accurate
    const timeUpdateInterval = setInterval(() => {
      if (lastUpdated) {
        setLastUpdated(new Date());
      }

      // Update the countdown for the next API request
      if (throttled) {
        setNextRequestTime(Date.now());
      }
    }, 1000);

    return () => {
      clearInterval(intervalId);
      clearInterval(timeUpdateInterval);
      document.body.classList.remove("neon-theme");
    };
  }, []);

  const fetchData = async () => {
    try {
      // Don't show loading if we have cached data already
      const hadCachedData = cachedData.current !== null;
      setLoading(!hadCachedData);
      setError(null);

      // Store the timestamp for this request
      lastApiRequestTime = Date.now();

      const data = await fetchCryptoData();

      // If the API returned no data due to throttling, use cached data if available
      if (data.length === 0) {
        if (cachedData.current) {
          // Use cached data
          setCoins(cachedData.current.coins);
          setThrottled(true);

          // Only update the timestamp if we didn't have one before
          if (!lastUpdated) {
            setLastUpdated(new Date(cachedData.current.timestamp));
          }

          console.log("Using cached data due to API throttling");
        } else {
          // Only set error if we have no cached data
          setError("API rate limit reached. Please try again in a minute.");
        }
      } else {
        // Got fresh data
        setCoins(data);
        setLastUpdated(new Date());
        setThrottled(false);

        // Update cache
        cachedData.current = {
          coins: data,
          timestamp: Date.now(),
        };
      }
    } catch (err) {
      console.error("Error fetching cryptocurrency data:", err);

      // If we have cached data, use it as a fallback
      if (cachedData.current) {
        setCoins(cachedData.current.coins);
        setThrottled(true);
      } else {
        // Only set error if we have no cached data
        setError("Failed to fetch market data. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper function to calculate time until next refresh
  const getSecondsUntilNextRefresh = () => {
    const timeUntilNextRefresh = Math.ceil(
      (lastApiRequestTime + MIN_REQUEST_INTERVAL - Date.now()) / 1000
    );
    return timeUntilNextRefresh > 0 ? timeUntilNextRefresh : 60;
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleSortChange = (option: string) => {
    setSortBy(option);
  };

  // Get top gainer and loser from the coins data
  const getTopGainerAndLoser = () => {
    if (!coins || coins.length === 0) {
      return { gainer: null, loser: null };
    }

    const sortedByChange = [...coins].sort(
      (a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h
    );

    return {
      gainer: sortedByChange[0],
      loser: sortedByChange[sortedByChange.length - 1],
    };
  };

  // Calculate total market cap and 24h volume
  const getTotalMarketStats = () => {
    if (!coins || coins.length === 0) {
      return { marketCap: "2.5T", volume: "120B" };
    }

    // Use actual data or fallback to mock data
    const totalMarketCap = coins.reduce(
      (sum, coin) => sum + (coin.market_cap || 0),
      0
    );
    const total24hVolume = coins.reduce(
      (sum, coin) => sum + (coin.total_volume || 0),
      0
    );

    const formatLargeNumber = (num: number) => {
      if (num >= 1e12) return `${(num / 1e12).toFixed(1)}T`;
      if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
      if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
      return num.toString();
    };

    return {
      marketCap: formatLargeNumber(totalMarketCap),
      volume: formatLargeNumber(total24hVolume),
    };
  };

  const { gainer, loser } = getTopGainerAndLoser();
  const { marketCap, volume } = getTotalMarketStats();

  return (
    <div className="min-h-screen relative app-background">
      {/* Particle Background */}
      <ParticlesBackground />

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
        <link rel="icon" href="/images/crypto-icon.svg" />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <Navbar lastUpdated={lastUpdated} />

      <main className="neon-container">
        {throttled && (
          <div className="bg-black/30 border-l-4 border-neon-cyan text-white p-2 rounded-sm mb-4 text-xs">
            <span className="text-neon-cyan font-semibold mr-1">NOTE:</span>
            Using cached data - new data available in{" "}
            {getSecondsUntilNextRefresh()} seconds
          </div>
        )}

        <div className="mb-8">
          {/* Market Overview Section */}
          <div className="neon-market-overview">
            <h2 className="neon-header-text">Market Overview</h2>
            <div className="neon-gradient-bar"></div>

            {/* Market Statistics */}
            <div className="market-stats-container flex flex-col items-center">
              {/* First row: Market Cap and Volume */}
              <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-20 my-6 w-full">
                {/* Total Market Cap */}
                <div
                  className="neon-stat neon-stat-market-cap"
                  style={{ animationDelay: "0.1s" }}
                >
                  <span className="neon-stat-value">
                    Total Market Cap: ${marketCap}
                  </span>
                </div>

                {/* 24h Volume */}
                <div
                  className="neon-stat neon-stat-volume"
                  style={{ animationDelay: "0.2s" }}
                >
                  <span className="neon-stat-value">24h Volume: ${volume}</span>
                </div>
              </div>

              {/* Second row: Top Gainer and Loser */}
              <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-20 mb-6 w-full">
                {gainer && (
                  <div
                    className="neon-stat neon-stat-gainer"
                    style={{ animationDelay: "0.3s" }}
                  >
                    <span className="neon-stat-value">
                      Top Gainer:{" "}
                      <span className="font-bold">{gainer.name}</span>{" "}
                      <span className="neon-positive">
                        +{gainer.price_change_percentage_24h.toFixed(2)}%
                      </span>
                    </span>
                  </div>
                )}

                {loser && (
                  <div
                    className="neon-stat neon-stat-loser"
                    style={{ animationDelay: "0.4s" }}
                  >
                    <span className="neon-stat-value">
                      Top Loser: <span className="font-bold">{loser.name}</span>{" "}
                      <span className="neon-negative">
                        {loser.price_change_percentage_24h.toFixed(2)}%
                      </span>
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mt-8">
            <div className="w-full lg:w-1/2">
              <SearchBar
                onSearch={handleSearch}
                placeholder="Search cryptocurrencies..."
              />
            </div>

            <div className="w-full lg:w-1/3 mt-4 lg:mt-0 text-center">
              <button className="neon-count-button">
                {coins.length} Cryptocurrencies
              </button>
            </div>
          </div>
        </div>

        {loading && !cachedData.current && (
          <div className="flex justify-center items-center my-16">
            <div className="neon-loader" aria-label="Loading"></div>
            <p className="neon-text-primary ml-4">Loading market data...</p>
          </div>
        )}

        {error && !cachedData.current && (
          <div className="bg-black/20 border-l-4 border-neon-red text-white p-3 rounded-sm my-4 text-sm flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={fetchData}
              className="neon-button text-xs py-1 px-3"
              style={{
                borderColor: "var(--neon-red)",
                color: "var(--neon-red)",
                boxShadow: "0 0 8px var(--neon-red)",
              }}
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && coins.length > 0 && (
          <>
            <div className="my-8">
              <CryptoList
                coins={coins}
                searchTerm={searchTerm}
                sortBy={sortBy}
              />
            </div>

            {/* Neon Footer */}
            <div className="neon-footer">
              Data provided by CoinGecko API | Updated every minute
            </div>
          </>
        )}
      </main>
    </div>
  );
}
