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
        // Cyberpunk theme colors
        cyberPurple: "#6C00FF",
        electricBlue: "#00F0FF",
        neonPink: "#FF00A8",
        darkBackground: "#0A0A0A",
        neonGreen: "#39FF14",
        cyberYellow: "#FFD700",
        
        // Updating primary colors to match cyberpunk theme
        primary: {
          50: '#e0d9ff',
          100: '#c6b5ff',
          200: '#ac92ff',
          300: '#916eff',
          400: '#794bff',
          500: '#6C00FF', // cyberPurple as primary
          600: '#5f00df',
          700: '#5200bf',
          800: '#45009f',
          900: '#38007f',
        },
        
        // Keep existing success and danger colors but enhance them
        success: '#39FF14', // neonGreen
        danger: '#FF00A8',  // neonPink
      },
      boxShadow: {
        // Custom glowing shadows
        'glow-purple': '0 0 10px rgba(108, 0, 255, 0.7)',
        'glow-blue': '0 0 10px rgba(0, 240, 255, 0.7)',
        'glow-pink': '0 0 10px rgba(255, 0, 168, 0.7)',
        'glow-green': '0 0 10px rgba(57, 255, 20, 0.7)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'glitch': 'glitch 1s infinite',
      },
      keyframes: {
        glow: {
          '0%': { textShadow: '0 0 5px rgba(108, 0, 255, 0.7)' },
          '100%': { textShadow: '0 0 15px rgba(108, 0, 255, 0.9), 0 0 20px rgba(0, 240, 255, 0.4)' },
        },
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '10%': { transform: 'translate(-1px, 1px)' },
          '20%': { transform: 'translate(0px, 1px)' },
          '30%': { transform: 'translate(1px, -1px)' },
          '40%': { transform: 'translate(-1px, 0)' },
        },
      },
      backgroundImage: {
        'cyber-grid': "url('/images/cyber-grid.svg')",
      },
    },
  },
  plugins: [],
} 