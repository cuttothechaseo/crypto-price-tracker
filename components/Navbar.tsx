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
    <nav className="bg-darkBackground border-b border-cyberPurple/30 shadow-glow-purple sticky top-0 z-10 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center group">
            <div className="relative w-8 h-8 mr-2 transition-all duration-300 group-hover:scale-110">
              <Image
                src="/images/bitcoin-logo.svg"
                alt="Bitcoin Logo"
                width={32}
                height={32}
                className="w-full h-full object-contain animate-pulse-slow"
                priority
              />
            </div>
            <span className="font-bold text-xl font-['Orbitron'] text-transparent bg-clip-text bg-gradient-to-r from-cyberPurple to-electricBlue transition-all duration-300 group-hover:scale-105 group-hover:animate-glow">
              Crypto Price Tracker
            </span>
          </div>
          
          <div className="flex items-center space-x-6">
            <ThemeToggle onThemeChange={handleThemeChange} />
            <a 
              href="https://www.coingecko.com/en/api" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-electricBlue hover:text-white hover:shadow-glow-blue transition-all duration-300"
            >
              API
            </a>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-neonPink hover:text-white hover:shadow-glow-pink transition-all duration-300"
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