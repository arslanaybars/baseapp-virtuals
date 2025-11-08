# Virtuals - Base Mini App

A Base mini app for discovering and browsing virtual tokens on the Base blockchain.

## Features

- Browse virtual tokens with real-time data
- Sort by Volume 24h, Price Change %, or Age
- View token details including price, logo, and links
- Direct links to X/Twitter and DexScreener (LP and Wallet addresses)
- Clean, modern green-themed UI

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Configuration

Update `minikit.config.ts` with your app details and account association credentials.

## API Integration

The app integrates with:
- Virtuals API (`api2.virtuals.io`) - Token data
- CoinGecko API - Price data for virtual-protocol token

## Deployment

Follow the Base mini app deployment guide to deploy to Vercel and configure your manifest.

