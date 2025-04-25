import React, { useState, useEffect } from "react";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";

interface NavbarProps {
  onHighlightsToggle?: (showHighlights: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onHighlightsToggle }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showHighlights, setShowHighlights] = useState(true);

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

  return (
    <nav className="sticky top-0 z-10 bg-background border-b-4 border-border shadow-md">
      <div className="container mx-auto">
        <div className="flex justify-between items-center p-3 relative">
          {/* Decorative top line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-vintage opacity-80"></div>

          <div className="flex items-center group">
            <div className="relative w-12 h-12 mr-3 transition-transform duration-300 group-hover:scale-110">
              <Image
                src="/images/artistic-bitcoin.svg"
                alt="Bitcoin Logo"
                width={48}
                height={48}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <span className="font-serif font-semibold text-2xl text-accent transition-all duration-300">
              Crypto Price Tracker
            </span>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-accent font-medium font-body">
                Highlights
              </span>
              <button
                onClick={toggleHighlights}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  showHighlights ? "bg-highlight" : "bg-gray-300"
                }`}
                aria-pressed={showHighlights}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform ${
                    showHighlights ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <ThemeToggle onThemeChange={handleThemeChange} />

            {/* Sun icon */}
            <a
              href="https://www.coingecko.com/en/api"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-highlight transition-colors duration-200 font-medium font-body flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                  clipRule="evenodd"
                />
              </svg>
              API
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-highlight transition-colors duration-200 font-medium font-body flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </a>
          </div>

          {/* Decorative bottom line */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-vintage opacity-80"></div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
