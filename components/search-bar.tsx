"use client";

import { useState } from "react";
import { Search, TrendingUp } from "lucide-react";

interface SearchBarProps {
  onSearch: (ticker: string) => void;
  currentTicker: string;
}

const POPULAR_TICKERS = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "NVDA", "META", "NFLX"];

export default function SearchBar({ onSearch, currentTicker }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim().toUpperCase());
    }
  };

  return (
    <div className="w-full flex flex-col space-y-6">
      {/* Brand Logo and Subtitle */}
      <div className="flex flex-col space-y-1">
        <div className="flex items-center space-x-2 text-white">
          <div className="bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
            <TrendingUp className="h-6 w-6 text-emerald-400 animate-pulse" />
          </div>
          <span className="text-2xl font-bold tracking-tight">Tickr</span>
        </div>
        <p className="text-zinc-400 text-sm">
          Search any ticker to see its price chart and the latest company news.
        </p>
      </div>

      {/* Search Input */}
      <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a ticker, e.g. AAPL"
            className="w-full h-12 bg-zinc-900/60 border border-zinc-800 text-white pl-12 pr-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all text-sm placeholder:text-zinc-500"
          />
        </div>
        <button
          type="submit"
          className="h-12 px-6 bg-white hover:bg-zinc-200 text-black font-medium rounded-xl text-sm transition-colors shadow-lg active:scale-95 duration-100"
        >
          Search
        </button>
      </form>

      {/* Popular Tickers List */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-zinc-500">Popular:</span>
        {POPULAR_TICKERS.map((ticker) => {
          const isActive = ticker === currentTicker;
          return (
            <button
              key={ticker}
              type="button"
              onClick={() => onSearch(ticker)}
              className={`px-3 py-1.5 rounded-lg border font-medium transition-all ${
                isActive
                  ? "bg-zinc-800 border-zinc-700 text-white"
                  : "bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800/60 hover:border-zinc-700"
              }`}
            >
              {ticker}
            </button>
          );
        })}
      </div>
    </div>
  );
}
