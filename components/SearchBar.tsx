import React, { useState } from "react";

interface SearchBarProps {
  onSearch: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
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
    <div className="relative mb-6">
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-vintage-teal"
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
              className="bg-vintage-beige/40 border-2 border-vintage-teal/40 rounded-md pl-12 pr-12 py-3 w-full shadow-sm focus:ring-vintage-orange focus:border-vintage-orange focus:outline-none transition-all duration-300 text-vintage-dark placeholder-vintage-dark/60"
              placeholder="Search for treasures..."
              value={searchTerm}
              onChange={handleChange}
            />

            {/* Vintage paper texture overlay */}
            <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-20">
              <div className="w-full h-full bg-[url('/images/paper-texture.svg')] bg-cover"></div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-0 right-0 h-full flex items-center mr-3">
              <svg
                viewBox="0 0 50 50"
                width="24"
                height="24"
                className="text-vintage-orange opacity-70"
              >
                <circle
                  cx="25"
                  cy="25"
                  r="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeDasharray="4 2"
                />
                <circle
                  cx="25"
                  cy="25"
                  r="10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                />
                <circle cx="25" cy="25" r="3" fill="currentColor" />
              </svg>
            </div>
          </div>
        </form>

        <div className="text-center mt-2 text-sm font-serif italic text-vintage-dark/70">
          Seek knowledge of coins ancient and modern
        </div>

        {/* Decorative bottom flourish */}
        <div className="flex justify-center mt-1">
          <svg width="120" height="10" className="text-vintage-teal/40">
            <line
              x1="0"
              y1="5"
              x2="120"
              y2="5"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="1 3"
            />
            <circle
              cx="60"
              cy="5"
              r="3"
              fill="currentColor"
              fillOpacity="0.3"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
