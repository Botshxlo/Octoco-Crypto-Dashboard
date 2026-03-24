# CryptoTracker - Live Cryptocurrency Dashboard

A React + TypeScript application that displays live cryptocurrency prices using the CoinGecko API.

**Live Demo:** [octoco-crypto-dashboard.vercel.app](https://octoco-crypto-dashboard.vercel.app)

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
│   ├── ui/                    # shadcn/ui primitives (Tabs, Skeleton)
│   ├── CoinRow.tsx            # Single coin row with hover effects
│   ├── CoinTable.tsx          # Flex-based coin list with header
│   ├── CoinTableSkeleton.tsx  # Staggered loading skeleton
│   ├── CurrencySelector.tsx   # ZAR/USD/EUR/BTC toggle
│   ├── Header.tsx             # Glass header with nav and logo
│   ├── PriceChart.tsx         # Trend-colored area chart
│   └── StatCard.tsx           # Reusable stat display card
├── hooks/
│   └── useMetaMask.ts         # MetaMask wallet connection hook
├── lib/
│   └── utils.ts               # Formatting helpers (currency, %, compact)
├── pages/
│   ├── Dashboard.tsx          # Landing page with market stats + coin list
│   ├── CoinDetail.tsx         # Coin detail with tabbed charts and stats
│   └── Wallet.tsx             # MetaMask wallet page
├── store/
│   ├── api/coingecko.ts       # RTK Query API slice with retry logic
│   ├── currencySlice.ts       # Currency state
│   ├── hooks.ts               # Typed Redux hooks
│   └── store.ts               # Redux store config
├── types/
│   └── index.ts               # TypeScript interfaces
├── App.tsx
├── main.tsx
└── index.css                  # Theme variables and utility classes
```
## Architecture Decisions

### RTK Query over plain fetch/SWR

The assignment calls for Redux caching, so RTK Query was the natural pick. It gives us automatic cache management, polling (`pollingInterval: 60000` for live price updates), and request deduplication, all wired into the Redux store. The coin list, detail pages, and chart data share one cache layer with configurable TTL (`keepUnusedDataFor: 120`), so we're not making redundant API calls when users navigate between pages.

### Hybrid pagination strategy

Page 1 uses RTK Query with polling so prices stay fresh. Pages 2+ use plain `fetch()` instead. I tried RTK Query for all pages initially, but changing the page argument invalidated the cache and the UI would flash empty during refetches. Not great. Keeping page 1 on RTK Query and appending extra pages via local state gives us live updates for the top 100 coins and stable infinite scroll for the rest.

### Null-safe formatting

CoinGecko returns `null` for fields like `price_change_percentage_24h` on lesser-known coins (usually page 2+). All formatting utilities (`formatCurrency`, `formatPercentage`, `formatCompact`) accept `number | null` and return `"N/A"` for nulls. Without this, infinite scroll would crash on missing data.

### Rate limit handling

CoinGecko's free tier is heavily rate-limited (5-15 req/min). The RTK Query base query calls `retry.fail()` on 429 responses to bail immediately instead of retrying but retrying just makes throttling worse. Combined with a 2-minute cache TTL, the app stays functional even when rate-limited. A Demo API key can optionally go in `VITE_COINGECKO_API_KEY` for higher limits.

### Flex-based table layout

The coin list uses `div` + flexbox instead of a `<table>`. Responsive column hiding is simpler (`hidden md:block` on individual cells), hover effects work with absolute-positioned overlays, and we avoid table layout's rigidity for the sparkline and action columns.

### Chart trend coloring

The price chart colors green or red based on whether the last data point is above or below the first. Gives immediate visual feedback on trend direction without extra API calls.

## Deployment

Deployed to [Vercel](https://vercel.com) with the CoinGecko API key set as an environment variable (`VITE_COINGECKO_API_KEY`).

## API

Uses the [CoinGecko API](https://www.coingecko.com/en/api) (free tier, no API key required):

- `/coins/markets` — Top coins by market cap
- `/coins/{id}` — Coin details
- `/coins/{id}/market_chart` — Historical price data
