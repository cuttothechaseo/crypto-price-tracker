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
        // Fantasy-inspired vintage theme
        background: '#F5E0C3',
        card: '#F3DDA1',
        accent: '#5F4B32',
        text: '#3B2E2A',
        border: '#AD8453',
        highlight: '#D95F18',
        shadow: '#3D3026',
        
        // Keep vintage theme colors for compatibility
        vintage: {
          background: "#f9e6c8", // Beige background
          orange: "#e76f51",     // Deep orange
          lightOrange: "#f4a261", // Light orange
          teal: "#2a9d8f",       // Teal/green
          gold: "#e9c46a",       // Gold yellow
          dark: "#2d3047",       // Dark blue-gray
        },

        // Success and error colors
        success: '#57844B',
        danger: '#A13325',
      },
      fontFamily: {
        serif: ['"Cinzel"', 'serif'],
        body: ['"EB Garamond"', 'serif'],
        'arvo': ['Arvo', 'serif'],
        'josefin': ['Josefin Sans', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(61, 48, 38, 0.15)',
        'card': '0 4px 10px rgba(61, 48, 38, 0.12)',
        'hover': '0 8px 20px rgba(61, 48, 38, 0.18)',
        'button': '0 4px 6px rgba(217, 95, 24, 0.25)',
        'scroll': '0 4px 10px rgba(61, 48, 38, 0.25)',
      },
      backgroundImage: {
        'grain': "url('/images/grain.png')",
        'parchment': "url('/images/parchment-texture.png')",
        'gradient-vintage': 'linear-gradient(135deg, #AD8453, #F3DDA1)',
      },
      borderWidth: {
        '3': '3px',
      },
    },
  },
  plugins: [],
} 