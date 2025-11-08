/**
 * Format a numeric value for display
 * Formats large numbers with K, M, B suffixes
 */
export function formatValue(value: number | string): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  
  if (isNaN(num)) {
    return "0";
  }

  if (num === 0) {
    return "0";
  }

  const absNum = Math.abs(num);
  
  // Check for billions first (>= 1 billion)
  if (absNum >= 1e9) {
    return `${(num / 1e9).toFixed(2)}B`;
  }
  
  // Check for millions (>= 1 million, < 1 billion)
  if (absNum >= 1e6) {
    return `${(num / 1e6).toFixed(2)}M`;
  }
  
  // Check for thousands (>= 1 thousand, < 1 million)
  if (absNum >= 1e3) {
    return `${(num / 1e3).toFixed(2)}K`;
  }
  
  if (absNum >= 1) {
    return num.toFixed(2);
  }
  
  if (absNum >= 0.01) {
    return num.toFixed(4);
  }
  
  return num.toExponential(2);
}

/**
 * Calculate token price from virtualTokenValue and CoinGecko price
 */
export function calculatePrice(
  virtualTokenValue: string | number,
  coingeckoPrice: number
): number {
  const value = typeof virtualTokenValue === "string" 
    ? parseFloat(virtualTokenValue) 
    : virtualTokenValue;
  
  return value * coingeckoPrice;
}

/**
 * Format price change percentage with color indicator
 */
export function formatPriceChange(change: number): string {
  const sign = change >= 0 ? "+" : "";
  return `${sign}${change.toFixed(2)}%`;
}

