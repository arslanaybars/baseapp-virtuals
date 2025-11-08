"use client";

import { VirtualToken } from "@/lib/types";
import { formatValue, formatPriceChange } from "@/lib/utils";
import Image from "next/image";

interface TokenCardProps {
  token: VirtualToken;
  coingeckoPrice: number;
}

export default function TokenCard({ token, coingeckoPrice }: TokenCardProps) {
  // Calculate FDV: fdvInVirtual * virtual-protocol USD price from CoinGecko
  const fdv = (token.fdvInVirtual || 0) * coingeckoPrice;
  const formattedFdv = formatValue(fdv);
  const priceChange = formatPriceChange(token.priceChangePercent24h);
  const isPositiveChange = token.priceChangePercent24h >= 0;

  // Get Twitter/X link
  const twitterLink =
    token.socials?.VERIFIED_LINKS?.TWITTER || token.socials?.TWITTER || null;

  // Get Website URL (only if it exists and is not empty)
  const websiteUrl = token.socials?.USER_LINKS?.WEBSITE?.trim() || null;
  const hasWebsite = websiteUrl && websiteUrl.length > 0;

  // Generate DexScreener and DeBank links
  const dexLpLink = `https://dexscreener.com/base/${token.lpAddress}`;
  const developerWalletLink = `https://debank.com/profile/${token.walletAddress}`;

  return (
    <div className="bg-white border border-green-100 rounded-lg p-4 sm:p-5 hover:shadow-lg hover:border-green-200 transition-all duration-200">
      <div className="flex items-start gap-3 sm:gap-4">
        {/* Logo */}
        <div className="flex-shrink-0">
          {token.image?.url ? (
            <Image
              src={token.image.url}
              alt={token.name}
              width={56}
              height={56}
              className="rounded-full border-2 border-green-200 w-12 h-12 sm:w-14 sm:h-14"
              unoptimized
            />
          ) : (
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-green-100 border-2 border-green-200 flex items-center justify-center">
              <span className="text-green-600 font-semibold text-base sm:text-lg">
                {token.symbol?.[0] || "?"}
              </span>
            </div>
          )}
        </div>

        {/* Token Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
              {token.name}
            </h3>
            <span className="text-xs sm:text-sm text-gray-500 font-medium">
              ${token.symbol}
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 flex-wrap mb-3">
            {/* FDV */}
            <div className="flex items-center gap-1">
              <span className="text-xs sm:text-sm text-gray-600">FDV: </span>
              <span className="text-sm sm:text-base font-semibold text-green-700">
                ${formattedFdv}
              </span>
            </div>

            {/* Price Change */}
            <div className="flex items-center">
              <span
                className={`text-xs sm:text-sm font-medium ${
                  isPositiveChange ? "text-green-600" : "text-red-600"
                }`}
              >
                {priceChange}
              </span>
            </div>

            {/* Volume 24h */}
            <div className="flex items-center gap-1">
              <span className="text-xs sm:text-sm text-gray-600">Vol 24h: </span>
              <span className="text-xs sm:text-sm font-medium text-gray-900">
                ${formatValue(token.volume24h)}
              </span>
            </div>

            {/* Liquidity */}
            <div className="flex items-center gap-1">
              <span className="text-xs sm:text-sm text-gray-600">Liquidity: </span>
              <span className="text-xs sm:text-sm font-medium text-gray-900">
                ${formatValue(token.liquidityUsd)}
              </span>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center gap-2 sm:gap-3 pt-3 border-t border-green-50 flex-wrap">
            {twitterLink && (
              <a
                href={twitterLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs sm:text-sm text-green-600 hover:text-green-700 font-medium transition-colors hover:underline"
              >
                X/Twitter
              </a>
            )}
            {hasWebsite && (
              <a
                href={websiteUrl!}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs sm:text-sm text-green-600 hover:text-green-700 font-medium transition-colors hover:underline"
              >
                Website
              </a>
            )}
            <a
              href={dexLpLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs sm:text-sm text-green-600 hover:text-green-700 font-medium transition-colors hover:underline"
            >
              DexScreener (LP)
            </a>
            <a
              href={developerWalletLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs sm:text-sm text-green-600 hover:text-green-700 font-medium transition-colors hover:underline"
            >
              Dev Wallet
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

