import { NextResponse } from "next/server";
import { getStockData, StockData } from "@/lib/data-provider";

// Helper function to convert all USD prices inside StockData to INR (Rupees)
function convertToINR(data: StockData, rate: number): StockData {
  const convertPrice = (usdPriceStr: string) => {
    const price = parseFloat(usdPriceStr.replace(/[^0-9.]/g, ""));
    if (isNaN(price)) return usdPriceStr;
    return (price * rate).toFixed(2);
  };

  const convertMktCap = (usdMktCapStr: string) => {
    // e.g. "3.48T" or "420B" -> converted to INR equivalents
    const match = usdMktCapStr.match(/^([0-9.]+)([TBMk]?)$/);
    if (!match) return usdMktCapStr;
    
    const value = parseFloat(match[1]);
    const multiplier = match[2];
    
    let numericValue = value;
    if (multiplier === "T") numericValue *= 1e12;
    else if (multiplier === "B") numericValue *= 1e9;
    else if (multiplier === "M") numericValue *= 1e6;
    
    const inrValue = numericValue * rate;
    
    if (inrValue >= 1e12) {
      return (inrValue / 1e12).toFixed(2) + "T";
    } else if (inrValue >= 1e9) {
      return (inrValue / 1e9).toFixed(1) + "B";
    } else if (inrValue >= 1e6) {
      return (inrValue / 1e6).toFixed(1) + "M";
    }
    return inrValue.toFixed(0);
  };

  // Convert metadata
  const convertedMetadata = {
    ...data.metadata,
    currentPrice: convertPrice(data.metadata.currentPrice),
    priceChange: (data.metadata.isPositive ? "+" : "") + (parseFloat(data.metadata.priceChange) * rate).toFixed(2),
  };

  // Convert stats
  const convertedStats = {
    ...data.stats,
    open: convertPrice(data.stats.open),
    prevClose: convertPrice(data.stats.prevClose),
    dayHigh: convertPrice(data.stats.dayHigh),
    dayLow: convertPrice(data.stats.dayLow),
    fiftyTwoWeekHigh: convertPrice(data.stats.fiftyTwoWeekHigh),
    fiftyTwoWeekLow: convertPrice(data.stats.fiftyTwoWeekLow),
    mktCap: convertMktCap(data.stats.mktCap),
  };

  // Convert charts
  const convertedCharts: typeof data.charts = {};
  for (const interval in data.charts) {
    convertedCharts[interval] = data.charts[interval].map((point) => ({
      ...point,
      price: Number((point.price * rate).toFixed(2)),
    }));
  }

  return {
    ...data,
    metadata: convertedMetadata,
    stats: convertedStats,
    charts: convertedCharts,
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ticker = searchParams.get("ticker")?.toUpperCase() || "AAPL";
  const interval = searchParams.get("interval") || "1M";

  const apiKey = process.env.TWELVEDATA_API_KEY;

  // Get current USD/INR exchange rate (with fallbacks)
  let exchangeRate = 95.58; // Default fallback matching local 2026 rates
  
  try {
    // Attempt to query a free, keyless exchange rate API first
    const currencyRes = await fetch("https://open.er-api.com/v6/latest/USD");
    if (currencyRes.ok) {
      const currencyData = await currencyRes.json();
      if (currencyData.rates && currencyData.rates.INR) {
        exchangeRate = parseFloat(currencyData.rates.INR);
      }
    }
  } catch (e) {
    console.error("Open exchange rate query failed, trying Twelve Data config:", e);
    // If keyless fails but we have Twelve Data, query Twelve Data
    if (apiKey) {
      try {
        const rateUrl = `https://api.twelvedata.com/exchange_rate?symbol=USD/INR&apikey=${apiKey}`;
        const rateRes = await fetch(rateUrl);
        if (rateRes.ok) {
          const rateData = await rateRes.json();
          if (rateData.rate) {
            exchangeRate = parseFloat(rateData.rate);
          }
        }
      } catch (err) {
        console.error("Twelve Data exchange rate lookup failed:", err);
      }
    }
  }

  // Fallback to high-fidelity mock data if no API Key is set
  if (!apiKey) {
    const mockData = getStockData(ticker);
    const inrMockData = convertToINR(mockData, exchangeRate);
    return NextResponse.json(inrMockData);
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
      outputSize = 78;
    } else if (interval === "1W") {
      tdInterval = "30min";
      outputSize = 70;
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
          hour = hour ? hour : 12;
          
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
    }).reverse();

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
        isDemo: false,
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
      news: getStockData(ticker).news,
    };

    // 6. Convert real stock data from USD to INR
    const inrRealData = convertToINR(realData, exchangeRate);
    return NextResponse.json(inrRealData);
  } catch (error: any) {
    console.error("Live Stock API fetch failed, falling back to converted mock:", error);
    const mockData = getStockData(ticker);
    const inrMockData = convertToINR(mockData, exchangeRate);
    inrMockData.metadata.isDemo = true;
    return NextResponse.json(inrMockData);
  }
}
