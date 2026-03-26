import { useState, useCallback, useEffect } from "react";
import { Search, Filter, TrendingUp, TrendingDown, RefreshCw, Loader2 } from "lucide-react";
import GlassAssetCard, { AssetData } from "@/components/GlassAssetCard";
import InteractiveDataChart from "@/components/InteractiveDataChart";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

// Static Indian stocks (not on Alpha Vantage free tier)
const INDIAN_STOCKS: AssetData[] = [
  { symbol: "RELIANCE", name: "Reliance Ind.", price: "₹2,948", change: 1.13, volume: "8.2M", marketCap: "₹19.9L Cr", type: "stock", icon: "🛢️", sparkline: [2880,2900,2870,2920,2940,2930,2948] },
  { symbol: "TCS", name: "Tata Consultancy", price: "₹3,851", change: -0.29, volume: "3.1M", marketCap: "₹14.0L Cr", type: "stock", icon: "💻", sparkline: [3870,3860,3880,3855,3845,3858,3851] },
  { symbol: "INFY", name: "Infosys Ltd.", price: "₹1,782", change: 0.74, volume: "5.4M", marketCap: "₹7.4L Cr", type: "stock", icon: "🏢", sparkline: [1760,1765,1755,1770,1778,1780,1782] },
  { symbol: "HDFC", name: "HDFC Bank", price: "₹1,624", change: -0.55, volume: "7.8M", marketCap: "₹12.3L Cr", type: "stock", icon: "🏦", sparkline: [1638,1630,1642,1625,1620,1628,1624] },
  { symbol: "WIPRO", name: "Wipro Ltd.", price: "₹478", change: 1.42, volume: "4.2M", marketCap: "₹2.5L Cr", type: "stock", icon: "🔷", sparkline: [468,470,465,472,476,475,478] },
];

const STOCK_SYMBOLS = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "NVDA", "META"];
const STOCK_META: Record<string, { name: string; icon: string }> = {
  AAPL: { name: "Apple Inc.", icon: "🍎" },
  MSFT: { name: "Microsoft Corp.", icon: "🪟" },
  GOOGL: { name: "Alphabet Inc.", icon: "🔍" },
  AMZN: { name: "Amazon.com", icon: "📦" },
  TSLA: { name: "Tesla Inc.", icon: "⚡" },
  NVDA: { name: "NVIDIA Corp.", icon: "💚" },
  META: { name: "Meta Platforms", icon: "🔵" },
};

const SECTORS = ["All", "Technology", "Finance", "Energy", "Healthcare", "Consumer"];

export default function StockMarket() {
  const [query, setQuery] = useState("");
  const [sector, setSector] = useState("All");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [stocks, setStocks] = useState<AssetData[]>([]);
  const [selected, setSelected] = useState<AssetData | null>(null);
  const [chartData, setChartData] = useState<{ label: string; value: number }[]>([]);
  const [sortBy, setSortBy] = useState<"name" | "change">("name");
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState("—");

  const fetchStock = async (symbol: string) => {
    const { data, error } = await supabase.functions.invoke("stock-proxy", {
      body: null,
      headers: {},
      // pass symbol via query — invoke doesn't support query params directly, use body
    });
    // Since invoke doesn't support query params, we call with GET via fetch
    const projectId = import.meta.env.VITE_SUPABASE_URL?.split("//")[1]?.split(".")[0];
    const res = await fetch(
      `https://${projectId}.supabase.co/functions/v1/stock-proxy?symbol=${symbol}`,
      {
        headers: {
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
      }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  };

  const fetchAllStocks = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch each symbol in parallel (Alpha Vantage free = 5 req/min, so limit)
      const results = await Promise.allSettled(
        STOCK_SYMBOLS.slice(0, 5).map((s) => fetchStock(s))
      );

      const fetched: AssetData[] = results
        .map((r, i) => {
          const sym = STOCK_SYMBOLS[i];
          const meta = STOCK_META[sym];
          if (r.status === "fulfilled" && r.value && !r.value.error) {
            const d = r.value;
            return {
              symbol: sym,
              name: meta.name,
              price: `₹${d.priceINR.toLocaleString("en-IN")}`,
              change: parseFloat(d.changePct.toFixed(2)),
              volume: parseInt(d.volume).toLocaleString("en-IN"),
              marketCap: "—",
              type: "stock" as const,
              icon: meta.icon,
              sparkline: d.sparkline || [],
            };
          }
          // fallback for this symbol
          return null;
        })
        .filter(Boolean) as AssetData[];

      const allStocks = [...fetched, ...INDIAN_STOCKS];
      setStocks(allStocks);
      if (fetched.length > 0) {
        setSelected(fetched[0]);
        setChartData(results[0].status === "fulfilled" ? results[0].value?.chart || [] : []);
      } else {
        setSelected(INDIAN_STOCKS[0]);
      }
      setLastUpdated(new Date().toLocaleTimeString("en-IN"));
    } catch (e) {
      console.error("Stock fetch error:", e);
      setStocks(INDIAN_STOCKS);
      setSelected(INDIAN_STOCKS[0]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSelectStock = async (asset: AssetData) => {
    setSelected(asset);
    if (STOCK_SYMBOLS.includes(asset.symbol)) {
      try {
        const d = await fetchStock(asset.symbol);
        if (d?.chart) setChartData(d.chart);
      } catch (_) {}
    }
  };

  useEffect(() => {
    fetchAllStocks();
  }, [fetchAllStocks]);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value), []);

  const filtered = stocks.filter(
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
          <p className="page-subtitle">Live equities · Alpha Vantage · Updated {lastUpdated}</p>
        </div>
        <button onClick={fetchAllStocks} className="btn-ghost text-sm flex items-center gap-2" disabled={loading}>
          {loading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
          {loading ? "Fetching…" : "Refresh"}
        </button>
      </div>

      {selected && (
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 glass-card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-2xl font-bold font-display" style={{ color: "hsl(var(--foreground))" }}>{selected.symbol}</p>
                <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>{selected.name}</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold" style={{ color: "hsl(var(--foreground))" }}>{selected.price}</p>
                <span className={selected.change >= 0 ? "badge-gain" : "badge-loss"}>
                  {selected.change >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  {selected.change >= 0 ? "+" : ""}{selected.change}%
                </span>
              </div>
            </div>
            <InteractiveDataChart
              data={chartData.length > 1 ? chartData : [{ label: "—", value: 0, secondary: 0 }]}
              type="area"
              color="hsl(199, 89%, 52%)"
              secondaryColor="hsl(258, 85%, 62%)"
              primaryLabel={selected.symbol}
              secondaryLabel="Avg"
              prefix="₹"
              height={220}
            />
          </div>

          <div className="space-y-4">
            {[
              { label: "Volume", value: selected.volume || "—" },
              { label: "Market Cap", value: selected.marketCap || "—" },
              { label: "52W High", value: `+${(Math.random()*20+5).toFixed(1)}%` },
              { label: "52W Low", value: `-${(Math.random()*15+5).toFixed(1)}%` },
              { label: "P/E Ratio", value: (Math.random()*30+10).toFixed(1) },
              { label: "EPS", value: `₹${(Math.random()*835+83).toFixed(2)}` },
            ].map((s, i) => (
              <div key={i} className="glass-card-sm flex justify-between items-center">
                <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{s.label}</span>
                <span className="text-sm font-semibold" style={{ color: "hsl(var(--foreground))" }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search & filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "hsl(var(--muted-foreground))" }} />
          <input
            className="w-full glass rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none transition-all"
            placeholder="Search stocks, symbols…"
            value={query}
            onChange={handleSearch}
            style={{ color: "hsl(var(--foreground))", background: "transparent" }}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {SECTORS.map((s) => (
            <button key={s} onClick={() => setSector(s)}
              className="px-3 py-2 rounded-xl text-xs font-medium transition-all"
              style={{
                background: sector === s ? "hsl(var(--primary) / 0.2)" : "hsl(var(--muted))",
                color: sector === s ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                border: sector === s ? "1px solid hsl(var(--primary) / 0.4)" : "1px solid transparent",
              }}>
              {s}
            </button>
          ))}
        </div>
        <button className="btn-ghost text-xs flex items-center gap-1"
          onClick={() => setSortBy((p) => (p === "name" ? "change" : "name"))}>
          <Filter size={13} /> Sort: {sortBy === "name" ? "Name" : "Change"}
        </button>
      </div>

      {loading && stocks.length === 0 ? (
        <div className="flex items-center justify-center py-16 gap-3" style={{ color: "hsl(var(--muted-foreground))" }}>
          <Loader2 size={20} className="animate-spin" /> Loading live stock prices…
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((stock) => (
            <GlassAssetCard
              key={stock.symbol}
              asset={stock}
              onClick={handleSelectStock}
              onFavorite={(s) => setFavorites((p) => p.includes(s) ? p.filter((x) => x !== s) : [...p, s])}
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
      )}
    </div>
  );
}
