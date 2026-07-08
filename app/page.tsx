"use client";

import { useState, useEffect } from "react";
import { Info, Loader2, AlertCircle } from "lucide-react";
import SearchBar from "@/components/search-bar";
import StockHeader from "@/components/stock-header";
import PriceChart from "@/components/price-chart";
import KeyStatistics from "@/components/key-statistics";
import NewsFeed from "@/components/news-feed";
import { StockData } from "@/lib/data-provider";

export default function Home() {
  const [ticker, setTicker] = useState("AAPL");
  const [interval, setInterval] = useState("1M");
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch real-time or mock stock details from server API
  useEffect(() => {
    async function fetchStockDetails() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/stock?ticker=${ticker}&interval=${interval}`);
        if (!res.ok) {
          throw new Error("Failed to load stock data");
        }
        const data: StockData = await res.json();
        setStockData(data);
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    }
    fetchStockDetails();
  }, [ticker, interval]);

  const handleSearch = (newTicker: string) => {
    setTicker(newTicker);
  };

  const chartData = stockData?.charts[interval] || [];

  return (
    <main className="min-h-screen bg-[#09090b] text-zinc-100 py-10 px-4 sm:px-6 md:px-8 lg:px-12 flex justify-center">
      <div className="w-full max-w-5xl flex flex-col space-y-6">
        
        {/* API Demo Status Banner */}
        {stockData?.metadata.isDemo && (
          <div className="bg-amber-500/10 border border-amber-500/25 p-4 rounded-2xl flex items-start space-x-3 text-xs md:text-sm text-amber-450 shadow-md">
            <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="flex-grow">
              <span className="font-bold text-amber-400">Demo Mode Enabled</span> &bull; Showing high-fidelity mock data. To connect to live stock market charts and statistics, create a free API key at{" "}
              <a 
                href="https://twelvedata.com/" 
                target="_blank" 
                rel="noreferrer" 
                className="underline hover:text-amber-300 font-semibold"
              >
                twelvedata.com
              </a>{" "}
              and add it as <code className="bg-[#121214] px-1.5 py-0.5 rounded border border-zinc-800 text-[11px] font-mono text-zinc-300">TWELVEDATA_API_KEY=your_key</code> in your local <code className="bg-[#121214] px-1.5 py-0.5 rounded border border-zinc-800 text-[11px] font-mono text-zinc-300">.env.local</code> file, then restart the server.
            </div>
          </div>
        )}

        {/* Search Header Row */}
        <div className="bg-[#121214] border border-zinc-800/80 p-6 md:p-8 rounded-3xl shadow-xl">
          <SearchBar onSearch={handleSearch} currentTicker={ticker} />
        </div>

        {/* Main Loading / Error states / Content */}
        {loading && !stockData ? (
          /* Initial loading state skeleton */
          <div className="flex flex-col space-y-6">
            <div className="bg-[#121214] border border-zinc-800/80 p-6 md:p-8 rounded-3xl shadow-xl h-96 flex flex-col justify-center items-center space-y-4">
              <Loader2 className="h-10 w-10 text-emerald-400 animate-spin" />
              <span className="text-zinc-500 text-sm font-medium">Fetching stock details...</span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-5 bg-[#121214] border border-zinc-800/80 p-6 rounded-3xl h-64 animate-pulse" />
              <div className="lg:col-span-7 bg-[#121214] border border-zinc-800/80 p-6 rounded-3xl h-64 animate-pulse" />
            </div>
          </div>
        ) : error ? (
          /* Error display */
          <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-3xl text-center space-y-4 shadow-xl">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
            <h3 className="text-lg font-bold text-white">Failed to retrieve data</h3>
            <p className="text-zinc-400 text-sm max-w-md mx-auto">{error}</p>
            <button
              onClick={() => setTicker("AAPL")}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-semibold"
            >
              Reset to AAPL
            </button>
          </div>
        ) : stockData ? (
          /* Loaded Stock details */
          <div className="flex flex-col space-y-6">
            {/* Main Price Chart Card */}
            <div className="relative bg-[#121214] border border-zinc-800/80 p-6 md:p-8 rounded-3xl shadow-xl flex flex-col space-y-8">
              {loading && (
                <div className="absolute top-4 right-4 flex items-center space-x-2 bg-zinc-950/80 border border-zinc-800 px-3 py-1.5 rounded-xl shadow-lg z-10 backdrop-blur-sm">
                  <Loader2 className="h-3 w-3 text-emerald-400 animate-spin" />
                  <span className="text-[10px] font-semibold text-zinc-400">Updating...</span>
                </div>
              )}
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
          </div>
        ) : null}

        {/* Footer */}
        <footer className="text-center text-[11px] text-zinc-650 pt-8 pb-4">
          Tickr &copy; {new Date().getFullYear()} &bull; Modern Stock Intelligence Dashboard &bull; Powered by Next.js & Tailwind CSS v3
        </footer>
      </div>
    </main>
  );
}
