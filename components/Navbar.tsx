import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface NavbarProps {
  onHighlightsToggle?: (showHighlights: boolean) => void;
  lastUpdated: Date | null;
}

const Navbar: React.FC<NavbarProps> = ({ onHighlightsToggle, lastUpdated }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showHighlights, setShowHighlights] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  // Initialize state from localStorage on component mount
  useEffect(() => {
    const storedHighlights = localStorage.getItem("showHighlights");
    if (storedHighlights !== null) {
      const parsedValue = storedHighlights === "true";
      setShowHighlights(parsedValue);
      if (onHighlightsToggle) {
        onHighlightsToggle(parsedValue);
      }
    }
  }, [onHighlightsToggle]);

  // Handler for theme changes
  const handleThemeChange = (darkMode: boolean) => {
    setIsDarkMode(darkMode);
  };

  // Handler for highlights toggle
  const toggleHighlights = () => {
    const newValue = !showHighlights;
    setShowHighlights(newValue);
    localStorage.setItem("showHighlights", String(newValue));
    if (onHighlightsToggle) {
      onHighlightsToggle(newValue);
    }
  };

  // Toggle mobile menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="relative">
      {/* Ornate border frame for entire header */}
      <div className="absolute inset-0 border-ornate-border border-8 border-opacity-60 pointer-events-none"></div>

      {/* Top decorative border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-vintage-border-pattern"></div>

      <nav
        className="relative bg-vintage-card-bg border-b-4 border-vintage-border-pattern text-vintage-text py-4 sm:py-6 px-4 sm:px-8 shadow-md"
        style={{
          backgroundImage: `url('/images/vintage-texture.svg')`,
          backgroundRepeat: "repeat",
          backgroundSize: "200px",
        }}
      >
        <div className="container mx-auto">
          {/* Ornate header content with decorative elements */}
          <div
            className="relative border-4 border-vintage-card-border rounded-lg p-3 sm:p-5"
            style={{
              backgroundImage:
                "radial-gradient(circle at center, rgba(240, 203, 122, 0.8) 0%, rgba(240, 203, 122, 0.3) 100%)",
            }}
          >
            {/* Corner decorations - hide smaller ones on mobile */}
            <div className="absolute top-0 left-0 w-10 sm:w-16 h-10 sm:h-16 pointer-events-none">
              <div className="absolute top-0 left-0 w-6 sm:w-10 h-6 sm:h-10 border-t-4 border-l-4 border-vintage-card-border rounded-tl-md"></div>
              <div className="absolute top-2 sm:top-3 left-2 sm:left-3 w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-vintage-accent-pattern opacity-80"></div>
            </div>
            <div className="absolute top-0 right-0 w-10 sm:w-16 h-10 sm:h-16 pointer-events-none">
              <div className="absolute top-0 right-0 w-6 sm:w-10 h-6 sm:h-10 border-t-4 border-r-4 border-vintage-card-border rounded-tr-md"></div>
              <div className="absolute top-2 sm:top-3 right-2 sm:right-3 w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-vintage-accent-pattern opacity-80"></div>
            </div>
            <div className="absolute bottom-0 left-0 w-10 sm:w-16 h-10 sm:h-16 pointer-events-none">
              <div className="absolute bottom-0 left-0 w-6 sm:w-10 h-6 sm:h-10 border-b-4 border-l-4 border-vintage-card-border rounded-bl-md"></div>
              <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-vintage-accent-pattern opacity-80"></div>
            </div>
            <div className="absolute bottom-0 right-0 w-10 sm:w-16 h-10 sm:h-16 pointer-events-none">
              <div className="absolute bottom-0 right-0 w-6 sm:w-10 h-6 sm:h-10 border-b-4 border-r-4 border-vintage-card-border rounded-br-md"></div>
              <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-vintage-accent-pattern opacity-80"></div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center relative z-10">
              <div className="text-center md:text-left mb-4 md:mb-0">
                <h1 className="font-vintage-header text-2xl sm:text-3xl md:text-4xl font-bold text-vintage-header-text">
                  Cryptocurrency Price Tracker
                </h1>
                {lastUpdated && (
                  <p className="font-vintage-body text-xs sm:text-sm text-vintage-text mt-1">
                    Last updated: {lastUpdated.toLocaleString()}
                  </p>
                )}
              </div>

              {/* Decorative center element - only show on medium screens and up */}
              <div className="hidden md:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-8 h-8 rounded-full border-2 border-vintage-card-border flex items-center justify-center">
                  <div className="w-5 h-5 rounded-full border-2 border-vintage-accent-pattern"></div>
                </div>
              </div>

              <div className="flex items-center space-x-4 sm:space-x-6">
                <a
                  href="https://www.coingecko.com/en/api"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-vintage-link hover:text-vintage-link-hover transition-colors duration-200 font-vintage-body"
                >
                  {/* Sun icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 sm:h-5 sm:w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm sm:text-base">API</span>
                </a>
                <a
                  href="https://github.com/ChaseOttimo/crypto-price-tracker"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-vintage-link hover:text-vintage-link-hover transition-colors duration-200 font-vintage-body"
                >
                  {/* GitHub icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 sm:h-5 sm:w-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  <span className="text-sm sm:text-base">GitHub</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Bottom decorative border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-vintage-border-pattern"></div>
    </header>
  );
};

export default Navbar;
