export interface VirtualToken {
  id: number;
  uid: string;
  createdAt: string;
  walletAddress: string;
  name: string;
  description: string;
  symbol: string;
  lpAddress: string;
  tokenAddress: string;
  virtualTokenValue: string;
  priceChangePercent24h: number;
  volume24h: number;
  fdvInVirtual: number;
  liquidityUsd: number;
  image: {
    url: string;
  };
  socials: {
    TWITTER?: string;
    VERIFIED_LINKS?: {
      TWITTER?: string;
    };
    USER_LINKS?: {
      WEBSITE?: string;
    };
  };
  lpCreatedAt: string;
}

export interface VirtualsResponse {
  data: VirtualToken[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface CoinGeckoPriceResponse {
  "virtual-protocol": {
    usd: number;
  };
  ethereum: {
    usd: number;
  };
}

export type SortOption = "volume24h" | "priceChangePercent24h" | "age";

