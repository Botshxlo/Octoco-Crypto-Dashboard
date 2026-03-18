# CryptoTracker - Live Cryptocurrency Dashboard

A React + TypeScript application that displays live cryptocurrency prices using the CoinGecko API.

## Tech Stack

- **Framework:** React 18 + TypeScript
- **Build:** Vite
- **State Management:** Redux Toolkit (RTK Query for API caching)
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Routing:** React Router v6
- **Wallet:** ethers.js (MetaMask integration)

## Features

### Core
- **Dashboard** — Top 100+ cryptocurrencies ranked by market cap
- **Coin Detail Page** — Price, market data, supply info, ATH/ATL, description, links
- **Currency Selector** — Toggle between ZAR, USD, EUR, BTC
- **All prices in ZAR by default**

### Bonus Features
- **Infinite Scroll** — Starts with top 100, loads more on scroll
- **Historical Price Charts** — Interactive area charts with granularity (24h, 7d, 30d, 1y)
- **Chart Dataset Toggle** — Switch between Price, Market Cap, and Volume
- **Redux Caching** — RTK Query caches API responses, auto-refreshes every 60s
- **MetaMask Wallet** — Connect wallet, view ETH balance, chain detection
- **Responsive Design** — Mobile-friendly with hamburger nav and responsive table

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Install & Run

```bash
npm install --legacy-peer-deps
npm run dev
```

The app will be available at `http://localhost:5173`.

### Production Build

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── CoinRow.tsx          # Single coin table row
│   ├── CoinTable.tsx        # Coins data table
│   ├── CurrencySelector.tsx # ZAR/USD/EUR/BTC toggle
│   ├── Header.tsx           # App header with nav
│   └── PriceChart.tsx       # Historical price area chart
├── hooks/
│   ├── useInfiniteScroll.ts # Intersection Observer hook
│   └── useMetaMask.ts       # MetaMask wallet hook
├── lib/
│   └── utils.ts             # Formatting helpers (currency, %, compact)
├── pages/
│   ├── Dashboard.tsx        # Landing page with coin list
│   ├── CoinDetail.tsx       # Coin detail with charts and stats
│   └── Wallet.tsx           # MetaMask wallet page
├── store/
│   ├── api/coingecko.ts     # RTK Query API slice
│   ├── currencySlice.ts     # Currency state
│   ├── hooks.ts             # Typed Redux hooks
│   └── store.ts             # Redux store config
├── types/
│   └── index.ts             # TypeScript interfaces
├── App.tsx
├── main.tsx
└── index.css
```

## API

Uses the [CoinGecko API](https://www.coingecko.com/en/api) (free tier, no API key required):

- `/coins/markets` — Top coins by market cap
- `/coins/{id}` — Coin details
- `/coins/{id}/market_chart` — Historical price data
