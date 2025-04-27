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
        // Fantasy-inspired vintage theme - keep for backward compatibility
        background: '#F5E0C3',
        card: '#F3DDA1',
        accent: '#5F4B32',
        text: '#3B2E2A',
        border: '#AD8453',
        highlight: '#D95F18',
        shadow: '#3D3026',
        
        // Ornate vintage design colors (based on second image)
        'vintage-dark': '#27231f', // Dark background for header
        'vintage-bg': '#e6b964', // Main background golden/orange
        'vintage-card-bg': '#f0cb7a', // Card background amber/gold
        'vintage-header-text': '#78350f', // Dark brown for headers
        'vintage-subheader-text': '#78350f', // Dark brown for subheaders  
        'vintage-text': '#78350f', // Standard text color
        'vintage-link': '#1b5042', // Green for links
        'vintage-link-hover': '#1e3a8a', // Hover state for links
        'vintage-card-border': '#15803d', // Green border for cards
        'vintage-accent-pattern': '#b43e25', // Red/burgundy for accents
        'vintage-accent-green': '#15803d', // Positive change
        'vintage-accent-red': '#b91c1c', // Negative change
        'vintage-border-pattern': '#15803d', // Green ornamental borders
        
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
        // Uncomment and use these vintage fonts
        'vintage-header': ['"Playfair Display"', 'serif'],
        'vintage-body': ['"Merriweather"', 'serif'],
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(61, 48, 38, 0.15)',
        'card': '0 4px 10px rgba(61, 48, 38, 0.12)',
        'hover': '0 8px 20px rgba(61, 48, 38, 0.18)',
        'button': '0 4px 6px rgba(217, 95, 24, 0.25)',
        'scroll': '0 4px 10px rgba(61, 48, 38, 0.25)',
        'vintage-card': '0 4px 8px rgba(0, 0, 0, 0.2)', // Card shadow
      },
      backgroundImage: {
        'grain': "url('/images/grain.png')",
        'parchment': "url('/images/parchment-texture.png')",
        'gradient-vintage': 'linear-gradient(135deg, #AD8453, #F3DDA1)',
        'vintage-pattern': "url('/images/vintage-background-pattern.svg')", // Fixed extension to .svg
        'ornate-border': "url('/images/ornate-border.svg')", // Fixed extension to .svg
      },
      borderWidth: {
        '3': '3px',
      },
    },
  },
  plugins: [],
} 