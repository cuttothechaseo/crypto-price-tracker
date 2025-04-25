import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";

interface NewsItem {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  source: string;
  created_at: string;
}

const NewsSection: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);

        // Note: You'll need to use a real news API here
        // For demonstration, we'll simulate a response
        // In a real app, use something like:
        // const response = await axios.get('https://api.cryptonews-api.com/api/v1/...');

        // This is simulated data for demonstration only
        const simulatedNews = [
          {
            id: "1",
            title: "Dragon's Hoard Bitcoin Surpasses 40,000 Gold Pieces",
            description:
              "The legendary Bitcoin treasure continues to grow as merchant guilds increasingly adopt the mystical coin for their trade routes.",
            url: "https://example.com/news/1",
            thumbnail: "https://via.placeholder.com/150",
            source: "Realm Chronicles",
            created_at: "2023-07-15T10:30:00Z",
          },
          {
            id: "2",
            title: "Ethereum Enchantment Protocol Upgrade Announced",
            description:
              "The Council of Ethereum has revealed plans for a powerful new enchantment that promises to reduce magic consumption and increase scroll processing speed.",
            url: "https://example.com/news/2",
            thumbnail: "https://via.placeholder.com/150",
            source: "Arcane Insights",
            created_at: "2023-07-14T14:15:00Z",
          },
          {
            id: "3",
            title: "Solana Knights Break Speed Records in Latest Tournament",
            description:
              "The Solana Knights have demonstrated unprecedented speed in the latest blockchain tournament, processing over 65,000 transactions per minute.",
            url: "https://example.com/news/3",
            thumbnail: "https://via.placeholder.com/150",
            source: "Crystal Network News",
            created_at: "2023-07-13T08:45:00Z",
          },
          {
            id: "4",
            title: "Cardano Scholars Unveil New Peer-Reviewed Magic Scroll",
            description:
              "After years of research, the Cardano Scholars have published their peer-reviewed magic scroll, promising a more sustainable and secure future for crypto enchantments.",
            url: "https://example.com/news/4",
            thumbnail: "https://via.placeholder.com/150",
            source: "Wisdom Quarterly",
            created_at: "2023-07-12T16:20:00Z",
          },
          {
            id: "5",
            title: "Goblin Markets Show Signs of Recovery After Winter Frost",
            description:
              "Following the harsh crypto winter, goblin markets across the realm show signs of warming as trading volumes increase and new adventurers enter the markets.",
            url: "https://example.com/news/5",
            thumbnail: "https://via.placeholder.com/150",
            source: "Market Whispers",
            created_at: "2023-07-11T11:10:00Z",
          },
        ];

        // In a real implementation, you would fetch from an API
        // setNews(response.data.news);
        setNews(simulatedNews);
      } catch (err) {
        console.error("Error fetching news:", err);
        setError(
          "Failed to fetch the latest scrolls from the messenger ravens."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNews();

    // Refresh news every 30 minutes
    const interval = setInterval(fetchNews, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const toggleExpand = (id: string) => {
    const newExpandedItems = new Set(expandedItems);
    if (expandedItems.has(id)) {
      newExpandedItems.delete(id);
    } else {
      newExpandedItems.add(id);
    }
    setExpandedItems(newExpandedItems);
  };

  if (loading) {
    return (
      <div className="fantasy-card mb-8 p-6 flex justify-center items-center min-h-[200px]">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-highlight rounded-full border-t-transparent animate-spin mb-4"></div>
          <p className="text-accent font-serif">Summoning news scrolls...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fantasy-card mb-8 p-6">
        <div className="text-danger text-center">
          <h3 className="text-xl mb-2">Message Interception</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fantasy-card mb-8">
      <h2 className="text-2xl font-serif text-accent text-center mb-6 relative">
        <span className="relative">
          Chronicles of the Realm
          <svg
            className="absolute -bottom-2 left-0 right-0 mx-auto"
            width="200"
            height="8"
          >
            <line
              x1="0"
              y1="4"
              x2="200"
              y2="4"
              stroke="#AD8453"
              strokeWidth="2"
              strokeDasharray="1 3"
            />
          </svg>
        </span>
      </h2>

      <div className="space-y-4">
        {news.map((item) => (
          <div
            key={item.id}
            className="fantasy-card bg-card/80 hover:bg-card/100 transition-colors duration-300"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="md:w-1/4 lg:w-1/5 flex-shrink-0">
                <div className="relative h-24 md:h-full w-full overflow-hidden rounded-lg border-2 border-highlight/40">
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    width={150}
                    height={150}
                    className="object-cover w-full h-full"
                    style={{ objectFit: "cover" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/50"></div>
                </div>
              </div>

              <div className="md:w-3/4 lg:w-4/5 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-serif text-accent">
                    {item.title}
                  </h3>
                  <span className="text-xs text-text/70 whitespace-nowrap">
                    {formatDate(item.created_at)}
                  </span>
                </div>

                <div className="fantasy-divider mb-2"></div>

                <p
                  className={`text-text ${
                    expandedItems.has(item.id) ? "" : "line-clamp-2"
                  }`}
                >
                  {item.description}
                </p>

                <div className="mt-3 flex justify-between items-center">
                  <button
                    onClick={() => toggleExpand(item.id)}
                    className="text-sm text-highlight hover:text-accent transition-colors duration-200"
                  >
                    {expandedItems.has(item.id) ? "Close Scroll" : "Read More"}
                  </button>

                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm italic text-text/70"
                  >
                    Source: {item.source}
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsSection;
