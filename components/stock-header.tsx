"use client";

import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { StockMetadata } from "@/lib/data-provider";

interface StockHeaderProps {
  metadata: StockMetadata;
  activeInterval: string;
  onIntervalChange: (interval: string) => void;
}

const INTERVALS = ["1D", "1W", "1M", "3M", "1Y"];

export default function StockHeader({
  metadata,
  activeInterval,
  onIntervalChange,
}: StockHeaderProps) {
  const { ticker, name, exchange, currentPrice, priceChange, percentChange, isPositive } = metadata;

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-zinc-800/40">
      {/* Stock Ticker Info */}
      <div className="flex items-center space-x-4">
        {/* Rounded Avatar Logo */}
        <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-zinc-900 border border-zinc-800 text-sm font-semibold tracking-wide text-zinc-300">
          {ticker}
        </div>

        {/* Ticker Name details */}
        <div className="flex flex-col space-y-1">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">{ticker}</h1>
            <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
              {exchange}
            </span>
          </div>
          <span className="text-sm text-zinc-400 font-medium">{name}</span>
        </div>
      </div>

      {/* Stock Quote & Time Selector */}
      <div className="flex flex-col md:items-end gap-3">
        {/* Quote Pricing */}
        <div className="flex flex-col md:items-end space-y-1">
          <div className="text-3xl font-extrabold text-white tracking-tight">
            ${currentPrice}
          </div>
          <div
            className={`flex items-center text-sm font-semibold tracking-wide ${
              isPositive ? "text-emerald-500" : "text-red-500"
            }`}
          >
            {isPositive ? (
              <ArrowUpRight className="h-4 w-4 mr-0.5 shrink-0" />
            ) : (
              <ArrowDownRight className="h-4 w-4 mr-0.5 shrink-0" />
            )}
            <span>
              {priceChange} ({percentChange})
            </span>
            <span className="text-zinc-500 font-normal ml-1.5">today</span>
          </div>
        </div>

        {/* Interval Selector Tabs */}
        <div className="inline-flex p-1 bg-zinc-900/60 border border-zinc-800/80 rounded-xl max-w-fit mt-1">
          {INTERVALS.map((interval) => {
            const isSelected = interval === activeInterval;
            return (
              <button
                key={interval}
                type="button"
                onClick={() => onIntervalChange(interval)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  isSelected
                    ? "bg-zinc-800 text-white shadow-sm"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {interval}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
