import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import ThemeToggle from './ThemeToggle';

interface NavbarProps {
  onHighlightsToggle?: (showHighlights: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onHighlightsToggle }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showHighlights, setShowHighlights] = useState(true);
  
  // Initialize state from localStorage on component mount
  useEffect(() => {
    const storedHighlights = localStorage.getItem('showHighlights');
    if (storedHighlights !== null) {
      const parsedValue = storedHighlights === 'true';
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
    localStorage.setItem('showHighlights', String(newValue));
    if (onHighlightsToggle) {
      onHighlightsToggle(newValue);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-soft sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center group">
            <div className="relative w-8 h-8 mr-2 transition-transform duration-200 group-hover:scale-105">
              <Image
                src="/images/bitcoin-logo.svg"
                alt="Bitcoin Logo"
                width={32}
                height={32}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <span className="font-bold text-xl text-darkGray transition-colors duration-200 group-hover:text-primaryBlue">
              Crypto Price Tracker
            </span>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Highlights</span>
              <button
                onClick={toggleHighlights}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  showHighlights ? 'bg-primaryBlue' : 'bg-gray-300'
                }`}
                aria-pressed={showHighlights}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    showHighlights ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            <ThemeToggle onThemeChange={handleThemeChange} />
            <a 
              href="https://www.coingecko.com/en/api" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-primaryBlue transition-colors duration-200"
            >
              API
            </a>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-primaryBlue transition-colors duration-200"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 