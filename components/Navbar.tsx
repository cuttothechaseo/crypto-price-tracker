import React, { useState } from 'react';
import Image from 'next/image';
import ThemeToggle from './ThemeToggle';

const Navbar: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Handler for theme changes
  const handleThemeChange = (darkMode: boolean) => {
    setIsDarkMode(darkMode);
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