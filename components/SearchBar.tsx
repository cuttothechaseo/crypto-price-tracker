import React, { useState } from "react";

interface SearchBarProps {
  onSearch: (term: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = "Search cryptocurrencies...",
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <div className="relative w-full">
      <div className="max-w-xl mx-auto w-full">
        <form onSubmit={handleSubmit} className="relative w-full">
          <div className="relative">
            {/* Enhanced ornate border with vintage styling */}
            <div className="absolute -inset-1 sm:-inset-1.5 border-2 border-vintage-card-border rounded-full opacity-90 z-0"></div>

            {/* Decorative corner elements - smaller on mobile */}
            <div className="absolute -top-1 -left-1 w-3 sm:w-4 h-3 sm:h-4 border-t-2 border-l-2 border-vintage-accent-pattern rounded-tl-full z-10"></div>
            <div className="absolute -top-1 -right-1 w-3 sm:w-4 h-3 sm:h-4 border-t-2 border-r-2 border-vintage-accent-pattern rounded-tr-full z-10"></div>
            <div className="absolute -bottom-1 -left-1 w-3 sm:w-4 h-3 sm:h-4 border-b-2 border-l-2 border-vintage-accent-pattern rounded-bl-full z-10"></div>
            <div className="absolute -bottom-1 -right-1 w-3 sm:w-4 h-3 sm:h-4 border-b-2 border-r-2 border-vintage-accent-pattern rounded-br-full z-10"></div>

            {/* Search icon with vintage styling */}
            <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none z-10">
              <svg
                className="h-4 w-4 sm:h-5 sm:w-5 text-vintage-card-border"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            <input
              type="text"
              className="bg-vintage-card-bg border-2 border-vintage-card-border rounded-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2 sm:py-3 w-full shadow-md
                        focus:ring-vintage-accent-pattern focus:border-vintage-card-border focus:outline-none 
                        transition-all duration-300 text-vintage-header-text placeholder-vintage-text/60 
                        font-vintage-body text-sm sm:text-base relative z-0"
              style={{
                backgroundImage: "url('/images/vintage-texture.svg')",
                backgroundRepeat: "repeat",
                backgroundSize: "200px",
              }}
              placeholder={placeholder}
              value={searchTerm}
              onChange={handleChange}
            />

            {/* Decorative element on right side - smaller on mobile */}
            <div className="absolute top-0 right-0 h-full flex items-center mr-3 sm:mr-4 z-10">
              <div className="w-5 sm:w-6 h-5 sm:h-6 rounded-full flex items-center justify-center relative">
                <div className="w-4 sm:w-5 h-4 sm:h-5 border-2 border-vintage-card-border rounded-full absolute"></div>
                <div className="w-2 sm:w-3 h-2 sm:h-3 bg-vintage-accent-pattern/30 rounded-full absolute"></div>
                <div className="w-1 h-1 bg-vintage-accent-pattern rounded-full absolute"></div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchBar;
