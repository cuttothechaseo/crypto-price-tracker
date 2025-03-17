# Crypto Price Tracker

## Purpose

This project aims to create a real-time cryptocurrency price tracking application that allows users to monitor the latest prices, market trends, and performance metrics of top cryptocurrencies. The dashboard will provide an intuitive interface for users to quickly view market data and search for specific cryptocurrencies.

## Tech Stack

- **Frontend Framework**: Next.js
- **Styling**: TailwindCSS
- **State Management**: Zustand
- **API Communication**: Axios
- **Icons**: Radix UI Icons
- **Deployment**: Vercel

## Core Components

1. **Navbar**: Navigation component with app title and links
2. **CryptoList**: Main component that displays the list of cryptocurrencies
3. **CoinCard**: Reusable component for displaying individual cryptocurrency information
4. **SearchBar**: Component for filtering cryptocurrencies by name or symbol

## API Endpoints

We will use the CoinGecko API, which is a free cryptocurrency API that provides comprehensive data:

- **Get Top Cryptocurrencies**:

  ```
  GET https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false
  ```

- **Search Cryptocurrencies**:

  ```
  GET https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinIds}&order=market_cap_desc&sparkline=false
  ```

- **Get Supported Currencies**:
  ```
  GET https://api.coingecko.com/api/v3/coins/list
  ```

## Project Structure

```
crypto-price-tracker/
├── components/
│   ├── Navbar.js
│   ├── CryptoList.js
│   ├── CoinCard.js
│   └── SearchBar.js
├── pages/
│   ├── _app.js
│   └── index.js
├── store/
│   └── cryptoStore.js
├── utils/
│   └── fetchCrypto.js
├── styles/
│   └── globals.css
└── public/
    └── ...
```

## Features

- Real-time crypto price tracking
- Sorting by price, market cap, etc.
- Responsive design for mobile and desktop
- Search functionality to find specific coins
- Visual indicators for price changes (up/down)
