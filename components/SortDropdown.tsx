import React, { useState, useRef, useEffect } from "react";

interface SortDropdownProps {
  onSortChange: (option: string) => void;
  currentSort: string;
}

const SortDropdown: React.FC<SortDropdownProps> = ({
  onSortChange,
  currentSort,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const sortOptions = [
    { value: "rank", label: "Rank" },
    { value: "name", label: "Name" },
    { value: "price", label: "Price" },
    { value: "marketCap", label: "Market Cap" },
    { value: "priceChange", label: "24h Change" },
  ];

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSort = (option: string) => {
    onSortChange(option);
    setIsOpen(false);
  };

  // Format the current sort label
  const getCurrentSortLabel = () => {
    const option = sortOptions.find((opt) => opt.value === currentSort);
    return option ? option.label : "Sort By";
  };

  return (
    <div
      className="relative inline-block text-left mb-8 ml-4"
      ref={dropdownRef}
    >
      <div className="relative">
        {/* Decorative corner elements with enhanced styling */}
        <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-vintage-teal/60"></div>
        <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-vintage-teal/60"></div>
        <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-vintage-teal/60"></div>
        <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-vintage-teal/60"></div>

        {/* Subtle texture overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-10 mix-blend-overlay">
          <div className="w-full h-full bg-[url('/images/paper-texture.svg')] bg-cover"></div>
        </div>

        <button
          type="button"
          className="inline-flex justify-between items-center w-48 px-4 py-2.5 bg-vintage-beige/40 text-sm font-medium text-vintage-dark border-2 border-vintage-teal/40 shadow-sm hover:bg-vintage-beige/70 focus:outline-none transition-all duration-300 relative overflow-hidden group"
          id="sort-menu-button"
          aria-expanded="true"
          aria-haspopup="true"
          onClick={() => setIsOpen(!isOpen)}
        >
          {/* Decorative ink spread on hover */}
          <div className="absolute inset-0 bg-vintage-teal/5 transform scale-0 group-hover:scale-100 transition-transform origin-center duration-500 rounded-sm"></div>

          <span className="flex items-center relative z-10">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              className="mr-2 text-vintage-orange transition-all duration-300 group-hover:text-vintage-orange/80"
            >
              <path
                fill="currentColor"
                d="M3,18h6v-2H3V18z M3,6v2h18V6H3z M3,13h12v-2H3V13z"
              />
            </svg>
            {getCurrentSortLabel()}
          </span>
          <svg
            className={`-mr-1 ml-2 h-5 w-5 text-vintage-teal transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {/* Dropdown menu with enhanced animation */}
      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-48 rounded shadow-lg bg-vintage-beige/90 border-2 border-vintage-teal/40 divide-y divide-vintage-teal/20 focus:outline-none z-20 animate-fadeIn backdrop-blur-sm"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="sort-menu-button"
          tabIndex={-1}
        >
          {/* Decorative corners for dropdown */}
          <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-vintage-teal/60"></div>
          <div className="absolute -top-1 -right-1 w-2 h-2 border-t border-r border-vintage-teal/60"></div>
          <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b border-l border-vintage-teal/60"></div>
          <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-vintage-teal/60"></div>

          <div className="py-1" role="none">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSort(option.value)}
                className={`text-vintage-dark block px-4 py-2 text-sm w-full text-left hover:bg-vintage-teal/15 flex items-center justify-between transition-colors duration-200 relative ${
                  currentSort === option.value
                    ? "font-semibold bg-vintage-teal/20"
                    : ""
                }`}
                role="menuitem"
                tabIndex={-1}
                id={`sort-menu-item-${option.value}`}
              >
                {/* Subtle decorative line on the left */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-0.5 bg-vintage-orange/40 ${
                    currentSort === option.value ? "opacity-100" : "opacity-0"
                  }`}
                ></div>

                <span className="relative z-10">{option.label}</span>
                {currentSort === option.value && (
                  <svg
                    className="w-4 h-4 text-vintage-orange"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>

          {/* Subtle decorative bottom border */}
          <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-vintage-teal/30 to-transparent"></div>
        </div>
      )}

      {/* Enhanced decorative bottom element */}
      <div className="absolute bottom-[-12px] left-1/2 transform -translate-x-1/2">
        <img
          src="/images/scroll-bottom.svg"
          alt=""
          className="w-16 h-4 opacity-60"
        />
      </div>

      {/* Additional decorative element - compass rose */}
      <div className="absolute -right-10 -bottom-6">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          className="text-vintage-teal/40"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
          />
          <path
            d="M12,2 L12,22 M2,12 L22,12 M7,7 L17,17 M7,17 L17,7"
            stroke="currentColor"
            strokeWidth="0.5"
          />
          <circle cx="12" cy="12" r="2" fill="currentColor" fillOpacity="0.3" />
        </svg>
      </div>
    </div>
  );
};

export default SortDropdown;
