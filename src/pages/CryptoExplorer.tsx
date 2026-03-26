import { useState } from "react";
import { Search, Bitcoin, TrendingUp, TrendingDown } from "lucide-react";
import GlassAssetCard, { AssetData } from "@/components/GlassAssetCard";
import InteractiveDataChart from "@/components/InteractiveDataChart";

const USD_TO_INR = 83.47;
const inr = (usd: number) => `₹${Math.round(usd * USD_TO_INR).toLocaleString("en-IN")}`;

const CRYPTOS: AssetData[] = [
  { symbol: "BTC", name: "Bitcoin", price: inr(67420), change: 2.34, volume: "₹2,34,716 Cr", marketCap: "₹1,11,01,110 Cr", type: "crypto", icon: "₿", sparkline: [5357574,5432249,5322486,5524514,5658066,5582513,5627317] },
  { symbol: "ETH", name: "Ethereum", price: inr(3842), change: 1.78, volume: "₹1,03,545 Cr", marketCap: "₹38,471 Cr", type: "crypto", icon: "Ξ", sparkline: [304645,308890,302155,315491,321409,318165,320740] },
  { symbol: "SOL", name: "Solana", price: inr(182.50), change: 4.12, volume: "₹31,719 Cr", marketCap: "₹6,761 Cr", type: "crypto", icon: "◎", sparkline: [14023,14357,13776,14607,15026,14940,15233] },
  { symbol: "BNB", name: "BNB Chain", price: inr(612.30), change: -0.84, volume: "₹15,859 Cr", marketCap: "₹7,429 Cr", type: "crypto", icon: "🔶", sparkline: [51752,51585,51919,51334,50900,51251,51118] },
  { symbol: "ADA", name: "Cardano", price: inr(0.624), change: 3.21, volume: "₹7,446 Cr", marketCap: "₹1,836 Cr", type: "crypto", icon: "🔵", sparkline: [49,50,48,51,52,52,52] },
  { symbol: "AVAX", name: "Avalanche", price: inr(42.18), change: -1.45, volume: "₹4,274 Cr", marketCap: "₹1,419 Cr", type: "crypto", icon: "🔺", sparkline: [3630,3596,3655,3548,3490,3530,3520] },
  { symbol: "MATIC", name: "Polygon", price: inr(0.994), change: 2.67, volume: "₹3,322 Cr", marketCap: "₹818 Cr", type: "crypto", icon: "🟣", sparkline: [80,81,79,82,83,83,83] },
  { symbol: "DOT", name: "Polkadot", price: inr(9.87), change: 1.34, volume: "₹2,362 Cr", marketCap: "₹1,085 Cr", type: "crypto", icon: "⚪", sparkline: [801,810,797,814,820,822,824] },
];

const BTC_CHART = Array.from({ length: 30 }, (_, i) => ({
  label: `Day ${i + 1}`,
  value: Math.round((60000 + Math.sin(i / 4) * 4000 + i * 200 + Math.random() * 1000) * USD_TO_INR),
}));

const MARKET_STATS = [
  { label: "Total Mkt Cap", value: "₹2,17,85,670 Cr", change: "+1.8%", positive: true },
  { label: "24h Volume", value: "₹8,21,346 Cr", change: "+5.2%", positive: true },
  { label: "BTC Dominance", value: "51.2%", change: "-0.3%", positive: false },
  { label: "Fear & Greed", value: "72 — Greed", change: "Bullish", positive: true },
];

export default function CryptoExplorer() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<AssetData>(CRYPTOS[0]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [filter, setFilter] = useState<"all" | "gainers" | "losers">("all");

  const filtered = CRYPTOS.filter(
    (c) =>
      (c.symbol.toLowerCase().includes(query.toLowerCase()) ||
        c.name.toLowerCase().includes(query.toLowerCase())) &&
      (filter === "all" ||
        (filter === "gainers" && c.change > 0) ||
        (filter === "losers" && c.change < 0))
  );

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{ background: "hsl(43 95% 55% / 0.15)" }}
          >
            <Bitcoin size={20} style={{ color: "hsl(var(--accent))" }} />
          </div>
          <div>
            <h1 className="page-title">Crypto Explorer</h1>
            <p className="page-subtitle">Live prices · Powered by CoinGecko API</p>
          </div>
        </div>
      </div>

      {/* Market stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {MARKET_STATS.map((s, i) => (
          <div key={i} className="glass-card-sm">
            <p className="text-xs mb-1" style={{ color: "hsl(var(--muted-foreground))" }}>
              {s.label}
            </p>
            <p className="text-lg font-bold" style={{ color: "hsl(var(--foreground))" }}>
              {s.value}
            </p>
            <span className={s.positive ? "badge-gain" : "badge-loss"}>
              {s.change}
            </span>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 glass-card">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-2xl font-bold font-display flex items-center gap-2" style={{ color: "hsl(var(--foreground))" }}>
                <span>{selected.icon}</span> {selected.symbol}
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
            data={BTC_CHART}
            type="area"
            color="hsl(43, 95%, 55%)"
            primaryLabel={selected.symbol}
            prefix="$"
            height={220}
          />
        </div>

        <div className="space-y-3">
          <div className="glass-card-sm">
            <p className="text-xs font-semibold mb-3" style={{ color: "hsl(var(--muted-foreground))" }}>
              COIN DETAILS
            </p>
            {[
              { label: "24h Volume", value: selected.volume },
              { label: "Market Cap", value: selected.marketCap },
              { label: "Circulating Supply", value: "19.7M BTC" },
              { label: "All-Time High", value: `₹${(73737 * 83.47).toLocaleString("en-IN")}` },
              { label: "All-Time Low", value: `₹${(67.81 * 83.47).toFixed(2)}` },
            ].map((d, i) => (
              <div key={i} className="flex justify-between py-2" style={{ borderBottom: "1px solid hsl(var(--border))" }}>
                <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                  {d.label}
                </span>
                <span className="text-xs font-semibold" style={{ color: "hsl(var(--foreground))" }}>
                  {d.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search & filter */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "hsl(var(--muted-foreground))" }} />
          <input
            className="w-full glass rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none"
            placeholder="Search coins…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ color: "hsl(var(--foreground))", background: "transparent" }}
          />
        </div>
        {(["all", "gainers", "losers"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-4 py-2 rounded-xl text-xs font-medium capitalize transition-all"
            style={{
              background: filter === f ? "hsl(var(--primary) / 0.2)" : "hsl(var(--muted))",
              color: filter === f ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
              border: filter === f ? "1px solid hsl(var(--primary) / 0.4)" : "1px solid transparent",
            }}
          >
            {f === "all" ? "🌐 All" : f === "gainers" ? "📈 Gainers" : "📉 Losers"}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {filtered.map((coin) => (
          <GlassAssetCard
            key={coin.symbol}
            asset={coin}
            onClick={setSelected}
            onFavorite={(s) => setFavorites((p) => p.includes(s) ? p.filter((x) => x !== s) : [...p, s])}
            isFavorite={favorites.includes(coin.symbol)}
          />
        ))}
      </div>
    </div>
  );
}
