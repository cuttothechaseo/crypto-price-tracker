import React, { useEffect, useState } from "react";

interface ThemeToggleProps {
  onThemeChange?: (theme: string) => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ onThemeChange }) => {
  const [theme, setTheme] = useState("vintage");

  // Initialize theme from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "vintage";
    setTheme(savedTheme);

    // Apply theme class to body
    document.body.classList.remove("neon-theme", "vintage-theme");
    document.body.classList.add(`${savedTheme}-theme`);

    // Notify parent component of initial theme
    if (onThemeChange) {
      onThemeChange(savedTheme);
    }
  }, [onThemeChange]);

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === "vintage" ? "neon" : "vintage";
    setTheme(newTheme);

    // Apply theme class to body
    document.body.classList.remove("neon-theme", "vintage-theme");
    document.body.classList.add(`${newTheme}-theme`);

    // Save to localStorage
    localStorage.setItem("theme", newTheme);

    // Notify parent component of theme change
    if (onThemeChange) {
      onThemeChange(newTheme);
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className={
        theme === "neon"
          ? "neon-button flex items-center gap-2"
          : "vintage-btn flex items-center gap-2"
      }
      aria-label={`Switch to ${theme === "neon" ? "vintage" : "neon"} theme`}
      title={`Switch to ${theme === "neon" ? "vintage" : "neon"} theme`}
    >
      {theme === "neon" ? (
        // Vintage icon for switching to vintage theme
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z"
              clipRule="evenodd"
            />
          </svg>
          <span>Vintage Mode</span>
        </>
      ) : (
        // Neon icon for switching to neon theme
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
          </svg>
          <span>Neon Mode</span>
        </>
      )}
    </button>
  );
};

export default ThemeToggle;
