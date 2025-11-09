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
  useEffect(() => {
    // Base App SDK is automatically injected by Base App
    // We need to wait for it and call ready() to dismiss splash screen
    let retryCount = 0;
    const maxRetries = 100; // 10 seconds max wait time (100 * 100ms)
    let timeoutId: NodeJS.Timeout | null = null;
    
    const callReady = () => {
      if (typeof window === "undefined") return;
      
      const win = window as any;
      
      // Check multiple possible SDK locations
      // Base App may inject SDK as window.sdk, window.farcaster, or window.base
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
          console.log("Base SDK ready() called successfully");
          if (timeoutId) clearTimeout(timeoutId);
          return;
        } catch (error) {
          console.error("Error calling SDK ready():", error);
        }
      }
      
      // Retry if SDK is not yet available (Base App injects it)
      retryCount++;
      if (retryCount < maxRetries) {
        timeoutId = setTimeout(callReady, 100);
      } else {
        console.warn("Base SDK not found after maximum retries. App may not be running in Base App context.");
        // Try one more time after a longer delay in case SDK loads very late
        setTimeout(() => {
          const win = window as any;
          if (win.sdk?.actions?.ready) {
            try {
              win.sdk.actions.ready();
              console.log("Base SDK ready() called on final retry");
            } catch (error) {
              console.error("Error calling SDK ready() on final retry:", error);
            }
          }
        }, 2000);
      }
    };
    
    // Start checking immediately
    callReady();
    
    // Also check when DOM is ready
    if (typeof document !== "undefined") {
      if (document.readyState === "complete") {
        callReady();
      } else {
        window.addEventListener("load", callReady);
      }
    }
    
    // Cleanup
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (typeof window !== "undefined") {
        window.removeEventListener("load", callReady);
      }
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

