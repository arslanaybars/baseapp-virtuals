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

### Deploy to Vercel

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com) and sign in
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings
   - Click "Deploy"

3. **Configure Environment Variables**
   - After deployment, go to your project Settings → Environment Variables
   - Add: `NEXT_PUBLIC_ROOT_URL` = `https://your-app.vercel.app` (use your actual Vercel URL)
   - Redeploy to apply the environment variable

4. **Disable Deployment Protection**
   - Go to Settings → Deployment Protection
   - Toggle "Vercel Authentication" to OFF
   - Click Save

### Configure Base App

After your app is deployed to Vercel:

1. **Generate Account Association Credentials**
   - Go to [Base Build Account Association Tool](https://build.base.org/account-association)
   - Paste your Vercel URL (e.g., `https://your-app.vercel.app`) in the "App URL" field
   - Click "Submit"
   - Click "Verify" and follow the instructions
   - Copy the generated `accountAssociation` object

2. **Update Configuration**
   - Update `minikit.config.ts` with the `accountAssociation` credentials you copied
   - Push the changes to trigger a new Vercel deployment:
     ```bash
     git add minikit.config.ts
     git commit -m "Add account association credentials"
     git push origin main
     ```

3. **Preview Your App**
   - Go to [base.dev/preview](https://base.dev/preview)
   - Add your app URL to view embeds
   - Click the launch button to verify the app launches correctly
   - Use the "Account association" tab to verify credentials
   - Use the "Metadata" tab to check manifest fields

4. **Publish to Base App**
   - Create a post in the Base app with your app's URL
   - Your mini app will now be discoverable!

### Environment Variables

Create a `.env.local` file for local development:
```env
NEXT_PUBLIC_ROOT_URL=http://localhost:3000
```

**Note:** The production URL will be automatically set in Vercel's environment variables after deployment.

