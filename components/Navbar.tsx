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
    <nav className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="relative w-8 h-8 mr-2">
              <Image
                src="/images/bitcoin-logo.svg"
                alt="Bitcoin Logo"
                width={32}
                height={32}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-white">Crypto Price Tracker</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle onThemeChange={handleThemeChange} />
            <a 
              href="https://www.coingecko.com/en/api" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
            >
              API
            </a>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
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