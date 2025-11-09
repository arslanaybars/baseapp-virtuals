"use client";

import { useState, useEffect } from "react";
import { VirtualToken, SortOption, CoinGeckoPriceResponse } from "@/lib/types";
import { fetchVirtuals } from "@/lib/api/virtuals";
import { fetchCoinGeckoPrices } from "@/lib/api/coingecko";
import SortTabs from "@/components/SortTabs";
import TokenCard from "@/components/TokenCard";

// Declare Base SDK types
declare global {
  interface Window {
    sdk?: {
      actions: {
        ready: () => void;
      };
    };
  }
}

export default function Home() {
  const [sortBy, setSortBy] = useState<SortOption>("volume24h");
  const [tokens, setTokens] = useState<VirtualToken[]>([]);
  const [coingeckoPrice, setCoingeckoPrice] = useState<number>(1.37); // Default fallback
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Call Base SDK ready() when component mounts and SDK is available
  // This is a backup in case the layout script didn't catch it
  useEffect(() => {
    // Base App SDK is automatically injected by Base App
    // We need to wait for it and call ready() to dismiss splash screen
    let retryCount = 0;
    const maxRetries = 50; // 5 seconds max wait time
    let timeoutId: NodeJS.Timeout | null = null;
    let called = false;
    
    const callReady = () => {
      if (called) return; // Prevent multiple calls
      if (typeof window === "undefined") return;
      
      const win = window as any;
      
      // Check multiple possible SDK locations
      let sdkReady = null;
      
      if (win.sdk?.actions?.ready) {
        sdkReady = win.sdk.actions.ready;
      } else if (win.farcaster?.sdk?.actions?.ready) {
        sdkReady = win.farcaster.sdk.actions.ready;
      } else if (win.base?.sdk?.actions?.ready) {
        sdkReady = win.base.sdk.actions.ready;
      }
      
      if (sdkReady) {
        try {
          sdkReady();
          called = true;
          console.log("[Base SDK] ready() called successfully from page component");
          if (timeoutId) clearTimeout(timeoutId);
          return;
        } catch (error) {
          console.error("[Base SDK] Error calling ready():", error);
        }
      }
      
      // Retry if SDK is not yet available
      retryCount++;
      if (retryCount < maxRetries) {
        timeoutId = setTimeout(callReady, 100);
      }
    };
    
    // Start checking after a small delay to let layout script try first
    timeoutId = setTimeout(callReady, 200);
    
    // Cleanup
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  // Fetch CoinGecko price on mount
  useEffect(() => {
    async function loadPrice() {
      try {
        const prices: CoinGeckoPriceResponse = await fetchCoinGeckoPrices();
        setCoingeckoPrice(prices["virtual-protocol"].usd);
      } catch (err) {
        console.error("Failed to fetch CoinGecko price:", err);
        // Keep default fallback value
      }
    }
    loadPrice();
  }, []);

  // Fetch virtuals data when sort option changes
  useEffect(() => {
    async function loadTokens() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchVirtuals(sortBy);
        setTokens(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load tokens");
        console.error("Failed to fetch virtuals:", err);
      } finally {
        setLoading(false);
      }
    }
    loadTokens();
  }, [sortBy]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50/50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 max-w-6xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
            Virtuals
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Discover virtual tokens on Base. Sort by volume, price change, or age.
          </p>
        </div>

        {/* Sort Tabs */}
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <SortTabs activeSort={sortBy} onSortChange={setSortBy} />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
              <p className="text-gray-600">Loading tokens...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
            <button
              onClick={() => {
                setSortBy("volume24h");
                setError(null);
              }}
              className="mt-2 text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Try again
            </button>
          </div>
        )}

        {/* Token List */}
        {!loading && !error && (
          <div className="grid gap-3 sm:gap-4">
            {tokens.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No tokens found.
              </div>
            ) : (
              tokens.map((token) => (
                <TokenCard
                  key={token.id}
                  token={token}
                  coingeckoPrice={coingeckoPrice}
                />
              ))
            )}
          </div>
        )}
      </div>
    </main>
  );
}

