"use client";

import { useState } from "react";
import SearchBar from "@/components/search-bar";
import StockHeader from "@/components/stock-header";
import PriceChart from "@/components/price-chart";
import KeyStatistics from "@/components/key-statistics";
import NewsFeed from "@/components/news-feed";
import { getStockData } from "@/lib/data-provider";

export default function Home() {
  const [ticker, setTicker] = useState("AAPL");
  const [interval, setInterval] = useState("1M");

  const stockData = getStockData(ticker);
  const chartData = stockData.charts[interval] || stockData.charts["1M"];

  const handleSearch = (newTicker: string) => {
    setTicker(newTicker);
  };

  return (
    <main className="min-h-screen bg-[#09090b] text-zinc-100 py-10 px-4 sm:px-6 md:px-8 lg:px-12 flex justify-center">
      <div className="w-full max-w-5xl flex flex-col space-y-8">
        
        {/* Search Header Row */}
        <div className="bg-[#121214] border border-zinc-800/80 p-6 md:p-8 rounded-3xl shadow-xl">
          <SearchBar onSearch={handleSearch} currentTicker={ticker} />
        </div>

        {/* Main Price Chart Dashboard Card */}
        <div className="bg-[#121214] border border-zinc-800/80 p-6 md:p-8 rounded-3xl shadow-xl flex flex-col space-y-8">
          <StockHeader
            metadata={stockData.metadata}
            activeInterval={interval}
            onIntervalChange={setInterval}
          />
          <PriceChart data={chartData} isPositive={stockData.metadata.isPositive} />
        </div>

        {/* Bottom Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Key Statistics Column (Left) */}
          <div className="lg:col-span-5 bg-[#121214] border border-zinc-800/80 p-6 md:p-8 rounded-3xl shadow-xl h-fit">
            <KeyStatistics stats={stockData.stats} />
          </div>

          {/* Latest News Feed Column (Right) */}
          <div className="lg:col-span-7 bg-[#121214] border border-zinc-800/80 p-6 md:p-8 rounded-3xl shadow-xl h-fit">
            <NewsFeed news={stockData.news} ticker={ticker} />
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-[11px] text-zinc-650 pt-8 pb-4">
          Tickr &copy; {new Date().getFullYear()} &bull; Modern Stock Intelligence Dashboard &bull; Powered by Next.js & Tailwind CSS v3
        </footer>
      </div>
    </main>
  );
}
