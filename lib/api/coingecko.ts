import { CoinGeckoPriceResponse } from "@/lib/types";

const COINGECKO_API_BASE = "https://api.coingecko.com/api/v3";

export async function fetchCoinGeckoPrices(): Promise<CoinGeckoPriceResponse> {
  const url = `${COINGECKO_API_BASE}/simple/price?ids=virtual-protocol%2Cethereum&vs_currencies=USD`;

  const response = await fetch(url, {
    next: { revalidate: 300 }, // Revalidate every 5 minutes
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch CoinGecko prices: ${response.statusText}`);
  }

  return response.json();
}

