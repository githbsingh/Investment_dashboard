export interface PricePoint {
  date: string;
  price: number;
}

export interface StockStats {
  open: string;
  prevClose: string;
  dayHigh: string;
  dayLow: string;
  fiftyTwoWeekHigh: string;
  fiftyTwoWeekLow: string;
  volume: string;
  mktCap: string;
  peRatio: string;
}

export interface NewsItem {
  id: string;
  publisher: string;
  timeAgo: string;
  title: string;
  summary: string;
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
}

export interface StockMetadata {
  ticker: string;
  name: string;
  exchange: string;
  currentPrice: string;
  priceChange: string;
  percentChange: string;
  isPositive: boolean;
}

export interface StockData {
  metadata: StockMetadata;
  stats: StockStats;
  charts: {
    [key: string]: PricePoint[];
  };
  news: NewsItem[];
}

// Popular tickers pre-populated data
const stockDataRegistry: { [ticker: string]: StockData } = {
  AAPL: {
    metadata: {
      ticker: "AAPL",
      name: "Apple Inc.",
      exchange: "NASDAQ",
      currentPrice: "227.40",
      priceChange: "+2.93",
      percentChange: "+1.29%",
      isPositive: true,
    },
    stats: {
      open: "224.28",
      prevClose: "224.47",
      dayHigh: "229.09",
      dayLow: "223.10",
      fiftyTwoWeekHigh: "252.02",
      fiftyTwoWeekLow: "183.54",
      volume: "41,043,366",
      mktCap: "3.48T", // Note: Screen shows 1.64T for demo, but we can stick to realistic/screenshot values
      peRatio: "34.1",
    },
    charts: {
      "1D": [
        { date: "09:30 AM", price: 224.28 },
        { date: "10:30 AM", price: 223.50 },
        { date: "11:30 AM", price: 225.10 },
        { date: "12:30 PM", price: 226.40 },
        { date: "01:30 PM", price: 225.80 },
        { date: "02:30 PM", price: 227.00 },
        { date: "03:30 PM", price: 227.40 },
      ],
      "1W": [
        { date: "Mon", price: 224.50 },
        { date: "Tue", price: 223.10 },
        { date: "Wed", price: 225.90 },
        { date: "Thu", price: 226.80 },
        { date: "Fri", price: 227.40 },
      ],
      "1M": [
        { date: "Week 1", price: 218.40 },
        { date: "Week 2", price: 221.20 },
        { date: "Week 3", price: 223.80 },
        { date: "Week 4", price: 227.40 },
      ],
      "3M": [
        { date: "Apr", price: 210.50 },
        { date: "May", price: 218.90 },
        { date: "Jun", price: 227.40 },
      ],
      "1Y": [
        { date: "Q1", price: 185.20 },
        { date: "Q2", price: 195.40 },
        { date: "Q3", price: 212.80 },
        { date: "Q4", price: 227.40 },
      ],
    },
    news: [
      {
        id: "aapl-news-1",
        publisher: "Financial Times",
        timeAgo: "1h ago",
        title: "Apple Inc. invests in next-generation infrastructure",
        summary: "Apple Inc. detailed a significant capital investment plan to scale its infrastructure, positioning the company for long-term efficiency gains.",
        sentiment: "Neutral",
      },
      {
        id: "aapl-news-2",
        publisher: "The Wall Street Journal",
        timeAgo: "4h ago",
        title: "What investors should watch in Apple Inc.'s upcoming report",
        summary: "Ahead of Apple Inc.'s next earnings release, investors are focused on margins, forward guidance, and commentary on macro headwinds affecting the sector.",
        sentiment: "Neutral",
      },
      {
        id: "aapl-news-3",
        publisher: "Bloomberg",
        timeAgo: "13h ago",
        title: "Analysts raise price target for Apple Inc. after product update",
        summary: "Several Wall Street analysts lifted their price targets for Apple Inc., citing an improved product roadmap and momentum in its highest-margin segments.",
        sentiment: "Bullish",
      },
      {
        id: "aapl-news-4",
        publisher: "Yahoo Finance",
        timeAgo: "12h ago",
        title: "Apple Inc. shares slip as broader market pulls back",
        summary: "Shares of Apple Inc. traded lower amid a broad market decline, as investors rotated out of high-growth names on renewed rate concerns.",
        sentiment: "Bearish",
      },
      {
        id: "aapl-news-5",
        publisher: "Reuters",
        timeAgo: "20h ago",
        title: "Apple Inc. faces regulatory scrutiny over new practices",
        summary: "Regulators opened a preliminary review into certain business practices at Apple Inc. The company said it is cooperating and does not expect a material impact.",
        sentiment: "Bearish",
      },
      {
        id: "aapl-news-6",
        publisher: "Barron's",
        timeAgo: "20h ago",
        title: "Institutional investors increase stakes in Apple Inc.",
        summary: "Recent filings show several institutional investors added to their positions in Apple Inc. last quarter, signaling continued confidence in the name.",
        sentiment: "Bullish",
      },
    ],
  },
  MSFT: {
    metadata: {
      ticker: "MSFT",
      name: "Microsoft Corporation",
      exchange: "NASDAQ",
      currentPrice: "420.55",
      priceChange: "-4.12",
      percentChange: "-0.97%",
      isPositive: false,
    },
    stats: {
      open: "424.10",
      prevClose: "424.67",
      dayHigh: "425.80",
      dayLow: "419.20",
      fiftyTwoWeekHigh: "468.35",
      fiftyTwoWeekLow: "380.12",
      volume: "22,450,112",
      mktCap: "3.12T",
      peRatio: "35.8",
    },
    charts: {
      "1D": [
        { date: "09:30 AM", price: 424.10 },
        { date: "10:30 AM", price: 423.20 },
        { date: "11:30 AM", price: 421.50 },
        { date: "12:30 PM", price: 422.00 },
        { date: "01:30 PM", price: 420.80 },
        { date: "02:30 PM", price: 419.50 },
        { date: "03:30 PM", price: 420.55 },
      ],
      "1W": [
        { date: "Mon", price: 428.30 },
        { date: "Tue", price: 426.10 },
        { date: "Wed", price: 425.40 },
        { date: "Thu", price: 422.10 },
        { date: "Fri", price: 420.55 },
      ],
      "1M": [
        { date: "Week 1", price: 432.10 },
        { date: "Week 2", price: 428.50 },
        { date: "Week 3", price: 425.90 },
        { date: "Week 4", price: 420.55 },
      ],
      "3M": [
        { date: "Apr", price: 415.20 },
        { date: "May", price: 429.30 },
        { date: "Jun", price: 420.55 },
      ],
      "1Y": [
        { date: "Q1", price: 375.40 },
        { date: "Q2", price: 395.20 },
        { date: "Q3", price: 415.80 },
        { date: "Q4", price: 420.55 },
      ],
    },
    news: [
      {
        id: "msft-news-1",
        publisher: "Bloomberg",
        timeAgo: "2h ago",
        title: "Microsoft Cloud margins expand amid AI service acceleration",
        summary: "Robust adoption of Copilot tools across enterprise customers pushes Azure cloud growth past consensus expectations.",
        sentiment: "Bullish",
      },
      {
        id: "msft-news-2",
        publisher: "Reuters",
        timeAgo: "6h ago",
        title: "Microsoft faces antitrust inspection in Europe over office bundles",
        summary: "European Union regulators are investigating whether Microsoft's integration of Teams within standard packages continues to suppress competitors.",
        sentiment: "Bearish",
      },
    ],
  },
  GOOGL: {
    metadata: {
      ticker: "GOOGL",
      name: "Alphabet Inc.",
      exchange: "NASDAQ",
      currentPrice: "182.10",
      priceChange: "+3.45",
      percentChange: "+1.93%",
      isPositive: true,
    },
    stats: {
      open: "179.20",
      prevClose: "178.65",
      dayHigh: "183.15",
      dayLow: "178.50",
      fiftyTwoWeekHigh: "193.30",
      fiftyTwoWeekLow: "130.40",
      volume: "28,340,991",
      mktCap: "2.26T",
      peRatio: "24.5",
    },
    charts: {
      "1D": [
        { date: "09:30 AM", price: 179.20 },
        { date: "10:30 AM", price: 178.90 },
        { date: "11:30 AM", price: 180.40 },
        { date: "12:30 PM", price: 181.20 },
        { date: "01:30 PM", price: 180.80 },
        { date: "02:30 PM", price: 181.90 },
        { date: "03:30 PM", price: 182.10 },
      ],
      "1W": [
        { date: "Mon", price: 178.50 },
        { date: "Tue", price: 177.10 },
        { date: "Wed", price: 179.90 },
        { date: "Thu", price: 181.20 },
        { date: "Fri", price: 182.10 },
      ],
      "1M": [
        { date: "Week 1", price: 172.40 },
        { date: "Week 2", price: 175.20 },
        { date: "Week 3", price: 178.80 },
        { date: "Week 4", price: 182.10 },
      ],
      "3M": [
        { date: "Apr", price: 165.50 },
        { date: "May", price: 174.90 },
        { date: "Jun", price: 182.10 },
      ],
      "1Y": [
        { date: "Q1", price: 138.20 },
        { date: "Q2", price: 152.40 },
        { date: "Q3", price: 168.80 },
        { date: "Q4", price: 182.10 },
      ],
    },
    news: [
      {
        id: "googl-news-1",
        publisher: "TechCrunch",
        timeAgo: "3h ago",
        title: "Google releases next-generation Gemini 2.0 Ultra model",
        summary: "The upgraded LLM features native multimodal reasoning, a context window of 2 million tokens, and substantial coding capability increases.",
        sentiment: "Bullish",
      },
    ],
  },
};

// Generates procedural stock data if search term doesn't match the cache
export function getStockData(tickerSymbol: string): StockData {
  const ticker = tickerSymbol.trim().toUpperCase();
  
  if (stockDataRegistry[ticker]) {
    return stockDataRegistry[ticker];
  }

  // Fallback procedural stock generator
  // Hash code generation for pseudo-random but consistent values for any ticker
  let hash = 0;
  for (let i = 0; i < ticker.length; i++) {
    hash = ticker.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const basePrice = Math.abs((hash % 400) + 15);
  const isPositive = hash % 2 === 0;
  const changeAmt = ((Math.abs(hash) % 100) / 25).toFixed(2);
  const percentChangeVal = ((Number(changeAmt) / basePrice) * 100).toFixed(2);
  
  const currentPrice = basePrice.toFixed(2);
  const priceChange = (isPositive ? "+" : "-") + changeAmt;
  const percentChange = (isPositive ? "+" : "-") + percentChangeVal + "%";

  const open = (basePrice * (1 - (isPositive ? 0.015 : -0.015))).toFixed(2);
  const prevClose = (basePrice * (1 - (isPositive ? 0.02 : -0.02))).toFixed(2);
  const dayHigh = (basePrice * 1.025).toFixed(2);
  const dayLow = (basePrice * 0.975).toFixed(2);
  const fiftyTwoWeekHigh = (basePrice * 1.35).toFixed(2);
  const fiftyTwoWeekLow = (basePrice * 0.72).toFixed(2);
  
  const volume = Math.floor(Math.abs(hash * 45000) % 50000000 + 100000).toLocaleString();
  const mktCap = ((Math.abs(hash * 123) % 2500) / 10).toFixed(1) + "B";
  const peRatio = ((Math.abs(hash * 17) % 50) + 10).toFixed(1);

  // Generate charts procedurally
  const generateChartPoints = (pointsCount: number, base: number) => {
    const points: PricePoint[] = [];
    let current = base * 0.95;
    for (let i = 0; i < pointsCount; i++) {
      const dayFactor = i / pointsCount;
      const fluctuation = ((Math.abs(Math.sin(hash + i)) * 10) - 5) / 100;
      const trend = isPositive ? 0.05 * dayFactor : -0.05 * dayFactor;
      current = current * (1 + fluctuation + (trend / pointsCount));
      points.push({
        date: `Point ${i + 1}`,
        price: Number(current.toFixed(2)),
      });
    }
    // Set last point to exact price
    points[points.length - 1].price = base;
    return points;
  };

  const nameMap: { [key: string]: string } = {
    AMZN: "Amazon.com, Inc.",
    TSLA: "Tesla, Inc.",
    NVDA: "NVIDIA Corporation",
    META: "Meta Platforms, Inc.",
    NFLX: "Netflix, Inc.",
  };

  const name = nameMap[ticker] || `${ticker} Corporation`;
  
  return {
    metadata: {
      ticker,
      name,
      exchange: ticker.length <= 4 ? "NASDAQ" : "NYSE",
      currentPrice,
      priceChange,
      percentChange,
      isPositive,
    },
    stats: {
      open,
      prevClose,
      dayHigh,
      dayLow,
      fiftyTwoWeekHigh,
      fiftyTwoWeekLow,
      volume,
      mktCap,
      peRatio,
    },
    charts: {
      "1D": generateChartPoints(7, basePrice),
      "1W": generateChartPoints(5, basePrice),
      "1M": generateChartPoints(10, basePrice),
      "3M": generateChartPoints(12, basePrice),
      "1Y": generateChartPoints(24, basePrice),
    },
    news: [
      {
        id: `${ticker.toLowerCase()}-news-1`,
        publisher: "Yahoo Finance",
        timeAgo: "2h ago",
        title: `${name} (${ticker}) updates fiscal performance targets`,
        summary: `Market analysts evaluate the updated targets issued by ${name} board members regarding cloud computing expansion and AI productivity.`,
        sentiment: isPositive ? "Bullish" : "Neutral",
      },
      {
        id: `${ticker.toLowerCase()}-news-2`,
        publisher: "Reuters",
        timeAgo: "8h ago",
        title: `${name} faces supply chain alignment discussions`,
        summary: `Logistics experts indicate ${name} is actively restructuring its hardware suppliers to hedge against regional shipping disruptions.`,
        sentiment: "Neutral",
      },
      {
        id: `${ticker.toLowerCase()}-news-3`,
        publisher: "Bloomberg",
        timeAgo: "15h ago",
        title: `Technical indicators check: What is next for ${ticker}?`,
        summary: `A look at moving averages and MACD trends suggests an interesting setup for ${ticker} shares heading into the options expiration Friday.`,
        sentiment: isPositive ? "Bullish" : "Bearish",
      },
    ],
  };
}
