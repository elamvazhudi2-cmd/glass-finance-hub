import { useState } from "react";
import { TrendingUp, TrendingDown, DollarSign, BarChart2, PieChart, Activity, ArrowUpRight } from "lucide-react";
import GlassAssetCard, { AssetData } from "@/components/GlassAssetCard";
import InteractiveDataChart from "@/components/InteractiveDataChart";
import { Link } from "react-router-dom";

const TOP_ASSETS: AssetData[] = [
  { symbol: "AAPL", name: "Apple Inc.", price: "₹15,800", change: 1.24, volume: "52.3M", marketCap: "₹2,45,46,180 Cr", type: "stock", icon: "🍎", sparkline: [15030,15197,14947,15447,15614,15364,15800] },
  { symbol: "TSLA", name: "Tesla Inc.", price: "₹20,737", change: -1.92, volume: "89.1M", marketCap: "₹65,941 Cr", type: "stock", icon: "⚡", sparkline: [21293,21543,20960,20793,21044,20544,20737] },
  { symbol: "BTC", name: "Bitcoin", price: "₹56,27,317", change: 2.34, volume: "₹2,34,716 Cr", marketCap: "₹1,11,01,110 Cr", type: "crypto", icon: "₿", sparkline: [53583,54317,53235,55250,56570,55827,56273] },
  { symbol: "ETH", name: "Ethereum", price: "₹3,20,718", change: 1.78, volume: "₹1,03,545 Cr", marketCap: "₹38,471 Cr", type: "crypto", icon: "Ξ", sparkline: [30479,30895,30228,31558,32151,31818,32072] },
];

const PORTFOLIO_DATA = [
  { label: "Jan", value: 82000, secondary: 75000 },
  { label: "Feb", value: 87500, secondary: 78000 },
  { label: "Mar", value: 84200, secondary: 80000 },
  { label: "Apr", value: 91000, secondary: 83500 },
  { label: "May", value: 95400, secondary: 87000 },
  { label: "Jun", value: 99800, secondary: 90200 },
  { label: "Jul", value: 103200, secondary: 93800 },
  { label: "Aug", value: 108700, secondary: 97100 },
  { label: "Sep", value: 105300, secondary: 99400 },
  { label: "Oct", value: 112400, secondary: 102800 },
  { label: "Nov", value: 118900, secondary: 107600 },
  { label: "Dec", value: 124580, secondary: 112000 },
];

const STAT_CARDS = [
  { label: "Portfolio Value", value: "₹1,03,97,213", change: "+12.4%", positive: true, icon: DollarSign, color: "hsl(var(--primary))" },
  { label: "Total Gain/Loss", value: "+₹11,55,001", change: "This Month", positive: true, icon: TrendingUp, color: "hsl(var(--gain))" },
  { label: "Active Positions", value: "24", change: "8 Sectors", positive: true, icon: BarChart2, color: "hsl(var(--accent))" },
  { label: "Risk Score", value: "Moderate", change: "6.2/10", positive: true, icon: Activity, color: "hsl(var(--secondary))" },
];

const RECENT_ACTIVITY = [
  { action: "Bought", symbol: "NVDA", qty: "10 shares", amount: "+₹7,30,773", time: "2h ago", positive: true },
  { action: "Sold", symbol: "META", qty: "5 shares", amount: "-₹2,19,944", time: "5h ago", positive: false },
  { action: "Dividend", symbol: "AAPL", qty: "Q4 Payout", amount: "+₹11,852", time: "1d ago", positive: true },
  { action: "Bought", symbol: "BTC", qty: "0.05 BTC", amount: "+₹2,81,299", time: "2d ago", positive: true },
];

export default function Dashboard() {
  const [favorites, setFavorites] = useState<string[]>(["AAPL", "BTC"]);
  const [selectedAsset, setSelectedAsset] = useState<AssetData | null>(null);

  const toggleFavorite = (symbol: string) => {
    setFavorites((prev) =>
      prev.includes(symbol) ? prev.filter((s) => s !== symbol) : [...prev, symbol]
    );
  };

  const handleAssetClick = (asset: AssetData) => {
    setSelectedAsset(asset);
  };

  return (
    <div className="page-container animate-fade-in">
      {/* Header */}
      <div className="page-header flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="page-title">Good Morning, Ashwin 👋</h1>
          <p className="page-subtitle">Your portfolio is performing +12.4% this year</p>
        </div>
        <div className="flex gap-3">
          <Link to="/calculator" className="btn-ghost text-sm">
            <Calculator size={14} className="inline mr-1.5" />
            Calculator
          </Link>
          <Link to="/portfolio" className="btn-primary text-sm">
            <PieChart size={14} className="inline mr-1.5" />
            View Portfolio
          </Link>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STAT_CARDS.map((stat, i) => (
          <div
            key={i}
            className="glass-card glass-hover"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: `${stat.color}20` }}
              >
                <stat.icon size={16} style={{ color: stat.color }} />
              </div>
              <span className={stat.positive ? "badge-gain" : "badge-loss"}>
                {stat.change}
              </span>
            </div>
            <p className="text-xl font-bold font-display" style={{ color: "hsl(var(--foreground))" }}>
              {stat.value}
            </p>
            <p className="text-xs mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Portfolio chart — 2/3 width */}
        <div className="lg:col-span-2 glass-card">
          <InteractiveDataChart
            data={PORTFOLIO_DATA}
            title="Portfolio Performance"
            type="area"
            color="hsl(199, 89%, 52%)"
            secondaryColor="hsl(258, 85%, 62%)"
            primaryLabel="Portfolio"
            secondaryLabel="Benchmark"
            prefix="$"
            height={260}
          />
        </div>

        {/* Recent activity */}
        <div className="glass-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm" style={{ color: "hsl(var(--foreground))" }}>
              Recent Activity
            </h3>
            <Link
              to="/portfolio"
              className="text-xs font-medium flex items-center gap-1"
              style={{ color: "hsl(var(--primary))" }}
            >
              View all <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="space-y-3">
            {RECENT_ACTIVITY.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-2.5 rounded-xl transition-all cursor-pointer"
                style={{ background: "hsl(var(--muted) / 0.5)" }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.background =
                    "hsl(var(--muted))")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.background =
                    "hsl(var(--muted) / 0.5)")
                }
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                  style={{
                    background: item.positive
                      ? "hsl(158 64% 52% / 0.15)"
                      : "hsl(0 85% 60% / 0.15)",
                    color: item.positive
                      ? "hsl(var(--gain))"
                      : "hsl(var(--loss))",
                  }}
                >
                  {item.action === "Dividend" ? "💰" : item.positive ? "↑" : "↓"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate" style={{ color: "hsl(var(--foreground))" }}>
                    {item.action} {item.symbol}
                  </p>
                  <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                    {item.qty} · {item.time}
                  </p>
                </div>
                <span
                  className="text-xs font-bold"
                  style={{
                    color: item.positive ? "hsl(var(--gain))" : "hsl(var(--loss))",
                  }}
                >
                  {item.amount}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top assets */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold font-display" style={{ color: "hsl(var(--foreground))" }}>
            Watchlist
          </h2>
          <Link
            to="/stocks"
            className="text-xs font-medium flex items-center gap-1"
            style={{ color: "hsl(var(--primary))" }}
          >
            Explore all <ArrowUpRight size={12} />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {TOP_ASSETS.map((asset) => (
            <GlassAssetCard
              key={asset.symbol}
              asset={asset}
              onClick={handleAssetClick}
              onFavorite={toggleFavorite}
              isFavorite={favorites.includes(asset.symbol)}
            />
          ))}
        </div>
        {selectedAsset && (
          <div className="mt-4 glass-card animate-fade-in-up">
            <p className="text-sm font-semibold mb-1" style={{ color: "hsl(var(--primary))" }}>
              Selected: {selectedAsset.name} ({selectedAsset.symbol})
            </p>
            <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
              Current Price: {selectedAsset.price} ·{" "}
              <span
                style={{
                  color:
                    selectedAsset.change >= 0
                      ? "hsl(var(--gain))"
                      : "hsl(var(--loss))",
                }}
              >
                {selectedAsset.change >= 0 ? "+" : ""}
                {selectedAsset.change}%
              </span>
            </p>
          </div>
        )}
      </div>

      {/* Quick links */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: "Run Investment Calculator", path: "/calculator", icon: "🧮", desc: "FD, SIP, Lumpsum returns" },
          { label: "View Tax Planner", path: "/tax", icon: "📋", desc: "Optimize your tax outgo" },
          { label: "Retirement Estimator", path: "/retirement", icon: "🏖️", desc: "Plan your future today" },
        ].map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="glass glass-hover rounded-2xl p-5 flex items-center gap-4"
          >
            <span className="text-3xl">{item.icon}</span>
            <div>
              <p className="text-sm font-semibold" style={{ color: "hsl(var(--foreground))" }}>
                {item.label}
              </p>
              <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                {item.desc}
              </p>
            </div>
            <ArrowUpRight size={16} className="ml-auto" style={{ color: "hsl(var(--muted-foreground))" }} />
          </Link>
        ))}
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Calculator({ size, className }: { size: number; className?: string }) {
  return <span className={className} style={{ fontSize: size }}>🧮</span>;
}
