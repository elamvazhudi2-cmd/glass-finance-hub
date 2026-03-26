import { TrendingUp, TrendingDown } from "lucide-react";

interface TickerItem {
  symbol: string;
  price: string;
  change: number;
}

const DEFAULT_ITEMS: TickerItem[] = [
  { symbol: "AAPL", price: "$189.30", change: 1.24 },
  { symbol: "MSFT", price: "$415.22", change: -0.38 },
  { symbol: "GOOGL", price: "$175.43", change: 2.11 },
  { symbol: "AMZN", price: "$198.71", change: 0.87 },
  { symbol: "TSLA", price: "$248.50", change: -1.92 },
  { symbol: "NVDA", price: "$875.39", change: 3.45 },
  { symbol: "META", price: "$527.14", change: 0.63 },
  { symbol: "BTC", price: "$67,420", change: 2.34 },
  { symbol: "ETH", price: "$3,842", change: 1.78 },
  { symbol: "NIFTY50", price: "22,531", change: 0.45 },
  { symbol: "SENSEX", price: "74,119", change: 0.52 },
  { symbol: "GOLD", price: "$2,341/oz", change: 0.21 },
  { symbol: "USD/INR", price: "₹83.47", change: -0.08 },
  { symbol: "RELIANCE", price: "₹2,948", change: 1.13 },
  { symbol: "TCS", price: "₹3,851", change: -0.29 },
];

interface MarketTickerProps {
  items?: TickerItem[];
}

export default function MarketTicker({ items = DEFAULT_ITEMS }: MarketTickerProps) {
  const doubled = [...items, ...items];

  return (
    <div
      className="glass border-b overflow-hidden"
      style={{ borderColor: "hsl(var(--glass-border))" }}
      role="marquee"
      aria-label="Live market ticker"
    >
      <div className="ticker-animate py-2 px-4">
        {doubled.map((item, i) => (
          <span
            key={`${item.symbol}-${i}`}
            className="inline-flex items-center gap-2 mr-10 text-sm font-medium cursor-default"
            title={`${item.symbol}: ${item.price}`}
          >
            <span className="text-muted-foreground font-mono text-xs tracking-wider">
              {item.symbol}
            </span>
            <span className="font-semibold" style={{ color: "hsl(var(--foreground))" }}>
              {item.price}
            </span>
            <span
              className={`flex items-center gap-0.5 text-xs font-bold ${
                item.change >= 0 ? "text-gain" : "text-loss"
              }`}
            >
              {item.change >= 0 ? (
                <TrendingUp size={12} />
              ) : (
                <TrendingDown size={12} />
              )}
              {item.change >= 0 ? "+" : ""}
              {item.change.toFixed(2)}%
            </span>
            <span
              className="ml-6 opacity-20 select-none"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              |
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
