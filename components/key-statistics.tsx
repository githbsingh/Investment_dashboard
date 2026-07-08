"use client";

import { Info } from "lucide-react";
import { StockStats } from "@/lib/data-provider";

interface KeyStatisticsProps {
  stats: StockStats;
}

export default function KeyStatistics({ stats }: KeyStatisticsProps) {
  const statItems = [
    { label: "Open", value: stats.open },
    { label: "Prev Close", value: stats.prevClose },
    { label: "Day High", value: stats.dayHigh },
    { label: "Day Low", value: stats.dayLow },
    { label: "52W High", value: stats.fiftyTwoWeekHigh },
    { label: "52W Low", value: stats.fiftyTwoWeekLow },
    { label: "Volume", value: stats.volume },
    { label: "Mkt Cap", value: stats.mktCap },
    { label: "P/E Ratio", value: stats.peRatio },
  ];

  return (
    <div className="flex flex-col space-y-4">
      {/* Title */}
      <h2 className="text-lg font-bold text-white tracking-tight">Key statistics</h2>

      {/* Grid of Statistics */}
      <div className="grid grid-cols-3 gap-px bg-zinc-800/40 border border-zinc-800/80 rounded-2xl overflow-hidden">
        {statItems.map((item, index) => (
          <div
            key={`${item.label}-${index}`}
            className="bg-card p-4 flex flex-col space-y-1.5 min-h-[85px] justify-center transition-colors hover:bg-zinc-900/40"
          >
            <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
              {item.label}
            </span>
            <span className="text-base font-bold text-white tracking-tight">
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {/* Footer Info Disclaimer */}
      <div className="flex items-start space-x-2 text-[11px] text-zinc-500 leading-normal max-w-sm pt-1">
        <Info className="h-4 w-4 text-zinc-650 shrink-0 mt-0.5" />
        <span>
          Sample data shown for demonstration. Connect a market data API to display live quotes and news.
        </span>
      </div>
    </div>
  );
}
