import { NextResponse } from "next/server";
import { getStockData } from "@/lib/data-provider";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ticker = searchParams.get("ticker")?.toUpperCase() || "AAPL";
  const interval = searchParams.get("interval") || "1M";

  const apiKey = process.env.TWELVEDATA_API_KEY;

  // Fallback to high-fidelity mock data if no API Key is set
  if (!apiKey) {
    const mockData = getStockData(ticker);
    return NextResponse.json(mockData);
  }

  try {
    // 1. Fetch live stock quote details
    const quoteUrl = `https://api.twelvedata.com/quote?symbol=${ticker}&apikey=${apiKey}`;
    const quoteRes = await fetch(quoteUrl);
    
    if (!quoteRes.ok) {
      throw new Error(`Twelve Data Quote API HTTP Error: ${quoteRes.status}`);
    }
    
    const quoteData = await quoteRes.json();
    
    if (quoteData.status === "error" || !quoteData.close) {
      throw new Error(quoteData.message || `No data found for symbol: ${ticker}`);
    }

    // 2. Map intervals to Twelve Data configurations
    let tdInterval = "1day";
    let outputSize = 30;
    
    if (interval === "1D") {
      tdInterval = "5min";
      outputSize = 78; // Covers typical 6.5 hour trading day (78 * 5 mins)
    } else if (interval === "1W") {
      tdInterval = "30min";
      outputSize = 70; // 5 trading days (14 intervals per day)
    } else if (interval === "1M") {
      tdInterval = "1day";
      outputSize = 30;
    } else if (interval === "3M") {
      tdInterval = "1day";
      outputSize = 90;
    } else if (interval === "1Y") {
      tdInterval = "1week";
      outputSize = 52;
    }

    // 3. Fetch historical time series data
    const seriesUrl = `https://api.twelvedata.com/time_series?symbol=${ticker}&interval=${tdInterval}&outputsize=${outputSize}&apikey=${apiKey}`;
    const seriesRes = await fetch(seriesUrl);
    
    if (!seriesRes.ok) {
      throw new Error(`Twelve Data Time Series HTTP Error: ${seriesRes.status}`);
    }
    
    const seriesData = await seriesRes.json();
    
    if (seriesData.status === "error" || !seriesData.values) {
      throw new Error(seriesData.message || "Failed to retrieve price history charts");
    }

    // 4. Format price data points for Recharts
    const charts: { [key: string]: { date: string; price: number }[] } = {};
    const points = seriesData.values.map((v: any) => {
      const dateStr = v.datetime;
      let formattedDate = dateStr;
      
      if (interval === "1D" || interval === "1W") {
        try {
          const parts = dateStr.split(" ");
          const timeParts = parts[1].split(":");
          let hour = parseInt(timeParts[0]);
          const min = timeParts[1];
          const ampm = hour >= 12 ? "PM" : "AM";
          hour = hour % 12;
          hour = hour ? hour : 12; // Handle 0 as 12 AM
          
          if (interval === "1D") {
            formattedDate = `${hour}:${min} ${ampm}`;
          } else {
            const dateObj = new Date(parts[0]);
            const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            formattedDate = `${dayNames[dateObj.getDay()]} ${hour}:${min} ${ampm}`;
          }
        } catch {
          formattedDate = dateStr;
        }
      } else {
        try {
          const dateObj = new Date(dateStr);
          const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          if (interval === "1Y") {
            formattedDate = `${months[dateObj.getMonth()]} ${dateObj.getFullYear().toString().substring(2)}`;
          } else {
            formattedDate = `${months[dateObj.getMonth()]} ${dateObj.getDate().toString().padStart(2, '0')}`;
          }
        } catch {
          formattedDate = dateStr;
        }
      }

      return {
        date: formattedDate,
        price: parseFloat(v.close),
      };
    }).reverse(); // Order from oldest to newest for linear graphing

    charts[interval] = points;

    // 5. Structure data formatting
    const priceChangeNum = parseFloat(quoteData.change || "0");
    const isPositive = priceChangeNum >= 0;
    const priceChange = (isPositive ? "+" : "") + priceChangeNum.toFixed(2);
    const percentChange = (isPositive ? "+" : "") + parseFloat(quoteData.percent_change || "0").toFixed(2) + "%";

    const mktCapVal = quoteData.market_cap ? parseFloat(quoteData.market_cap) : null;
    let mktCap = "N/A";
    if (mktCapVal) {
      mktCap = mktCapVal >= 1e12 
        ? (mktCapVal / 1e12).toFixed(2) + "T" 
        : (mktCapVal / 1e9).toFixed(1) + "B";
    }

    const realData = {
      metadata: {
        ticker: quoteData.symbol,
        name: quoteData.name || ticker,
        exchange: quoteData.exchange || "NYSE",
        currentPrice: parseFloat(quoteData.close).toFixed(2),
        priceChange,
        percentChange,
        isPositive,
        isDemo: false, // Running on real data!
      },
      stats: {
        open: parseFloat(quoteData.open || "0").toFixed(2),
        prevClose: parseFloat(quoteData.previous_close || "0").toFixed(2),
        dayHigh: parseFloat(quoteData.high || "0").toFixed(2),
        dayLow: parseFloat(quoteData.low || "0").toFixed(2),
        fiftyTwoWeekHigh: parseFloat(quoteData.fifty_two_week?.high || "0").toFixed(2),
        fiftyTwoWeekLow: parseFloat(quoteData.fifty_two_week?.low || "0").toFixed(2),
        volume: parseInt(quoteData.volume || "0").toLocaleString(),
        mktCap,
        peRatio: quoteData.pe ? parseFloat(quoteData.pe).toFixed(1) : "N/A",
      },
      charts,
      // Fallback news feed uses database procedurals
      news: getStockData(ticker).news,
    };

    return NextResponse.json(realData);
  } catch (error: any) {
    console.error("Live Stock API fetch failed, transparently falling back to mock data:", error);
    
    // Transparently fallback to mock data on error/rate limit exceeded
    const mockData = getStockData(ticker);
    mockData.metadata.isDemo = true; // Flag it as demo
    return NextResponse.json(mockData);
  }
}
