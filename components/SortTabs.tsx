"use client";

import { SortOption } from "@/lib/types";

interface SortTabsProps {
  activeSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export default function SortTabs({ activeSort, onSortChange }: SortTabsProps) {
  const tabs: { label: string; value: SortOption }[] = [
    { label: "Volume 24h", value: "volume24h" },
    { label: "Price Change %", value: "priceChangePercent24h" },
    { label: "Age", value: "age" },
  ];

  return (
    <div className="flex gap-1 sm:gap-2 mb-6 border-b border-green-100">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onSortChange(tab.value)}
          className={`
            px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200
            border-b-2 -mb-px whitespace-nowrap
            ${
              activeSort === tab.value
                ? "border-green-600 text-green-700 bg-green-50"
                : "border-transparent text-gray-600 hover:text-green-600 hover:border-green-300"
            }
          `}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

