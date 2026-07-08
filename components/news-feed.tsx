"use client";

import { Newspaper } from "lucide-react";
import { NewsItem } from "@/lib/data-provider";

interface NewsFeedProps {
  news: NewsItem[];
  ticker: string;
}

export default function NewsFeed({ news, ticker }: NewsFeedProps) {
  const getSentimentStyles = (sentiment: string) => {
    switch (sentiment) {
      case "Bullish":
        return "bg-emerald-500/5 text-emerald-400 border-emerald-500/15";
      case "Bearish":
        return "bg-red-500/5 text-red-400 border-red-500/15";
      default:
        return "bg-zinc-900/50 text-zinc-400 border-zinc-800";
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* Title with icon */}
      <div className="flex items-center space-x-2">
        <Newspaper className="h-5 w-5 text-zinc-400" />
        <h2 className="text-lg font-bold text-white tracking-tight">
          Latest news <span className="text-zinc-400 font-semibold">{ticker}</span>
        </h2>
      </div>

      {/* News Cards Stack */}
      <div className="flex flex-col space-y-3">
        {news.length === 0 ? (
          <div className="bg-card border border-zinc-800 p-6 rounded-2xl text-center">
            <p className="text-zinc-500 text-sm">No recent news found for {ticker}.</p>
          </div>
        ) : (
          news.map((item) => (
            <div
              key={item.id}
              className="bg-card border border-zinc-800/80 p-5 rounded-2xl flex flex-col space-y-3 hover:border-zinc-700/60 transition-all hover:-translate-y-0.5 duration-200"
            >
              {/* Meta row: Publisher, Age, Sentiment Badge */}
              <div className="flex items-center justify-between text-[11px] font-semibold tracking-wide text-zinc-500">
                <div className="flex items-center space-x-2">
                  <span className="text-zinc-300 font-bold">{item.publisher}</span>
                  <span className="h-1 w-1 rounded-full bg-zinc-700" />
                  <span>{item.timeAgo}</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-md border text-[9px] uppercase font-bold tracking-wider ${getSentimentStyles(
                    item.sentiment
                  )}`}
                >
                  {item.sentiment}
                </span>
              </div>

              {/* Title & Summary */}
              <div className="flex flex-col space-y-1.5">
                <h3 className="text-sm md:text-base font-bold text-white leading-snug tracking-tight hover:text-emerald-400 transition-colors cursor-pointer">
                  {item.title}
                </h3>
                <p className="text-xs md:text-sm text-zinc-400 leading-relaxed font-normal">
                  {item.summary}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
