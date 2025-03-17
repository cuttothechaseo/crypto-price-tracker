/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Modern white & blue theme colors
        primaryBlue: "#007BFF",
        secondaryBlue: "#0056b3",
        lightBlue: "#E6F3FF",
        lightGray: "#F8F9FA",
        mediumGray: "#E9ECEF",
        darkGray: "#343A40",
        subtleGray: "#F1F3F5",
        
        // Update primary colors to match blue theme
        primary: {
          50: '#e6f3ff',
          100: '#cce7ff',
          200: '#99ceff',
          300: '#66b5ff',
          400: '#339cff',
          500: '#007BFF', // primaryBlue as primary
          600: '#0056b3', // secondaryBlue
          700: '#004494',
          800: '#003166',
          900: '#001f3f',
        },
        
        // Keep success and danger colors but make them more modern
        success: '#28a745',
        danger: '#dc3545',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.05)',
        'card': '0 4px 6px rgba(0, 0, 0, 0.04)',
        'hover': '0 10px 15px rgba(0, 0, 0, 0.03)',
        'button': '0 4px 6px rgba(0, 123, 255, 0.25)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      backgroundImage: {
        'gradient-blue': 'linear-gradient(135deg, #007BFF, #0056b3)',
      },
    },
  },
  plugins: [],
} 