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
      <form onSubmit={handleSubmit} className="relative w-full">
        <div className="relative">
          {/* Search icon */}
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
            <svg
              className="h-5 w-5 text-neon-green"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              style={{ filter: "drop-shadow(0 0 3px var(--neon-green))" }}
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
            className="neon-search pl-10 pr-4 py-2 w-full"
            placeholder={placeholder}
            value={searchTerm}
            onChange={handleChange}
            style={{
              background: "rgba(0, 0, 0, 0.8)",
              borderRadius: "8px",
              border: "2px solid var(--neon-green)",
              boxShadow: "0 0 8px var(--neon-green)",
            }}
          />
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
