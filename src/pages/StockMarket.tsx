import { useState, useCallback } from "react";
import { Search, Filter, TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import GlassAssetCard, { AssetData } from "@/components/GlassAssetCard";
import InteractiveDataChart from "@/components/InteractiveDataChart";

const ALL_STOCKS: AssetData[] = [
  { symbol: "AAPL", name: "Apple Inc.", price: "$189.30", change: 1.24, volume: "52.3M", marketCap: "$2.94T", type: "stock", icon: "🍎", sparkline: [180,182,179,185,187,184,189] },
  { symbol: "MSFT", name: "Microsoft Corp.", price: "$415.22", change: -0.38, volume: "18.7M", marketCap: "$3.08T", type: "stock", icon: "🪟", sparkline: [418,416,419,415,417,413,415] },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: "$175.43", change: 2.11, volume: "22.1M", marketCap: "$2.19T", type: "stock", icon: "🔍", sparkline: [168,170,167,171,174,172,175] },
  { symbol: "AMZN", name: "Amazon.com", price: "$198.71", change: 0.87, volume: "34.5M", marketCap: "$2.07T", type: "stock", icon: "📦", sparkline: [193,195,192,196,198,197,199] },
  { symbol: "TSLA", name: "Tesla Inc.", price: "$248.50", change: -1.92, volume: "89.1M", marketCap: "$790B", type: "stock", icon: "⚡", sparkline: [255,258,251,249,252,246,248] },
  { symbol: "NVDA", name: "NVIDIA Corp.", price: "$875.39", change: 3.45, volume: "41.2M", marketCap: "$2.15T", type: "stock", icon: "💚", sparkline: [830,845,822,858,870,865,875] },
  { symbol: "META", name: "Meta Platforms", price: "$527.14", change: 0.63, volume: "12.8M", marketCap: "$1.34T", type: "stock", icon: "🔵", sparkline: [520,523,518,524,527,526,527] },
  { symbol: "RELIANCE", name: "Reliance Ind.", price: "₹2,948", change: 1.13, volume: "8.2M", marketCap: "₹19.9L Cr", type: "stock", icon: "🛢️", sparkline: [2880,2900,2870,2920,2940,2930,2948] },
  { symbol: "TCS", name: "Tata Consultancy", price: "₹3,851", change: -0.29, volume: "3.1M", marketCap: "₹14.0L Cr", type: "stock", icon: "💻", sparkline: [3870,3860,3880,3855,3845,3858,3851] },
  { symbol: "INFY", name: "Infosys Ltd.", price: "₹1,782", change: 0.74, volume: "5.4M", marketCap: "₹7.4L Cr", type: "stock", icon: "🏢", sparkline: [1760,1765,1755,1770,1778,1780,1782] },
  { symbol: "HDFC", name: "HDFC Bank", price: "₹1,624", change: -0.55, volume: "7.8M", marketCap: "₹12.3L Cr", type: "stock", icon: "🏦", sparkline: [1638,1630,1642,1625,1620,1628,1624] },
  { symbol: "WIPRO", name: "Wipro Ltd.", price: "₹478", change: 1.42, volume: "4.2M", marketCap: "₹2.5L Cr", type: "stock", icon: "🔷", sparkline: [468,470,465,472,476,475,478] },
];

const CHART_DATA = Array.from({ length: 30 }, (_, i) => ({
  label: `Day ${i + 1}`,
  value: 180 + Math.sin(i / 3) * 12 + i * 0.4 + Math.random() * 5,
  secondary: 175 + Math.cos(i / 4) * 8 + i * 0.3,
}));

const SECTORS = ["All", "Technology", "Finance", "Energy", "Healthcare", "Consumer"];

export default function StockMarket() {
  const [query, setQuery] = useState("");
  const [sector, setSector] = useState("All");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selected, setSelected] = useState<AssetData>(ALL_STOCKS[0]);
  const [sortBy, setSortBy] = useState<"name" | "change">("name");

  /* onSearch filter */
  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value),
    []
  );

  const filtered = ALL_STOCKS.filter(
    (s) =>
      (s.symbol.toLowerCase().includes(query.toLowerCase()) ||
        s.name.toLowerCase().includes(query.toLowerCase())) &&
      (sector === "All" || true)
  ).sort((a, b) =>
    sortBy === "change" ? Math.abs(b.change) - Math.abs(a.change) : a.symbol.localeCompare(b.symbol)
  );

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="page-title">Stock Market Tracker</h1>
          <p className="page-subtitle">Real-time equities · Powered by Alpha Vantage</p>
        </div>
        <button className="btn-ghost text-sm flex items-center gap-2">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Selected stock chart */}
        <div className="lg:col-span-2 glass-card">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-2xl font-bold font-display" style={{ color: "hsl(var(--foreground))" }}>
                {selected.symbol}
              </p>
              <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
                {selected.name}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold" style={{ color: "hsl(var(--foreground))" }}>
                {selected.price}
              </p>
              <span className={selected.change >= 0 ? "badge-gain" : "badge-loss"}>
                {selected.change >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                {selected.change >= 0 ? "+" : ""}{selected.change}%
              </span>
            </div>
          </div>
          <InteractiveDataChart
            data={CHART_DATA}
            type="area"
            color="hsl(199, 89%, 52%)"
            secondaryColor="hsl(258, 85%, 62%)"
            primaryLabel={selected.symbol}
            secondaryLabel="Avg"
            prefix="$"
            height={220}
          />
        </div>

        {/* Stats panel */}
        <div className="space-y-4">
          {[
            { label: "Volume", value: selected.volume || "—" },
            { label: "Market Cap", value: selected.marketCap || "—" },
            { label: "52W High", value: `+${(Math.random()*20+5).toFixed(1)}%` },
            { label: "52W Low", value: `-${(Math.random()*15+5).toFixed(1)}%` },
            { label: "P/E Ratio", value: (Math.random()*30+10).toFixed(1) },
            { label: "EPS", value: `$${(Math.random()*10+1).toFixed(2)}` },
          ].map((s, i) => (
            <div key={i} className="glass-card-sm flex justify-between items-center">
              <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                {s.label}
              </span>
              <span className="text-sm font-semibold" style={{ color: "hsl(var(--foreground))" }}>
                {s.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Search & filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-48">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: "hsl(var(--muted-foreground))" }}
          />
          <input
            className="w-full glass rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none transition-all"
            placeholder="Search stocks, symbols…"
            value={query}
            onChange={handleSearch}
            style={{
              color: "hsl(var(--foreground))",
              background: "transparent",
            }}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {SECTORS.map((s) => (
            <button
              key={s}
              onClick={() => setSector(s)}
              className="px-3 py-2 rounded-xl text-xs font-medium transition-all"
              style={{
                background:
                  sector === s ? "hsl(var(--primary) / 0.2)" : "hsl(var(--muted))",
                color:
                  sector === s ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                border: sector === s ? "1px solid hsl(var(--primary) / 0.4)" : "1px solid transparent",
              }}
            >
              {s}
            </button>
          ))}
        </div>
        <button
          className="btn-ghost text-xs flex items-center gap-1"
          onClick={() => setSortBy((p) => (p === "name" ? "change" : "name"))}
        >
          <Filter size={13} /> Sort: {sortBy === "name" ? "Name" : "Change"}
        </button>
      </div>

      {/* Stock grid */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((stock) => (
          <GlassAssetCard
            key={stock.symbol}
            asset={stock}
            onClick={setSelected}
            onFavorite={(s) =>
              setFavorites((p) =>
                p.includes(s) ? p.filter((x) => x !== s) : [...p, s]
              )
            }
            isFavorite={favorites.includes(stock.symbol)}
          />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-16" style={{ color: "hsl(var(--muted-foreground))" }}>
            <Search size={32} className="mx-auto mb-3 opacity-40" />
            <p>No stocks match "{query}"</p>
          </div>
        )}
      </div>
    </div>
  );
}
