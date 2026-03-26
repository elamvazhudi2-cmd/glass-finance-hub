import InteractiveDataChart from "@/components/InteractiveDataChart";
import { Globe, TrendingUp, TrendingDown } from "lucide-react";

const INDICES = [
  { name: "S&P 500", country: "🇺🇸 USA", value: "5,321.41", change: 0.62, ytd: "+8.3%", flag: "positive" },
  { name: "NASDAQ 100", country: "🇺🇸 USA", value: "18,644.60", change: 1.14, ytd: "+12.1%", flag: "positive" },
  { name: "Dow Jones", country: "🇺🇸 USA", value: "39,387.76", change: 0.35, ytd: "+4.7%", flag: "positive" },
  { name: "NIFTY 50", country: "🇮🇳 India", value: "22,531.05", change: 0.45, ytd: "+3.9%", flag: "positive" },
  { name: "BSE SENSEX", country: "🇮🇳 India", value: "74,119.82", change: 0.52, ytd: "+4.2%", flag: "positive" },
  { name: "FTSE 100", country: "🇬🇧 UK", value: "8,317.59", change: -0.21, ytd: "+2.8%", flag: "negative" },
  { name: "DAX", country: "🇩🇪 Germany", value: "18,703.42", change: 0.84, ytd: "+10.4%", flag: "positive" },
  { name: "CAC 40", country: "🇫🇷 France", value: "8,261.53", change: -0.34, ytd: "+5.8%", flag: "negative" },
  { name: "Nikkei 225", country: "🇯🇵 Japan", value: "38,405.66", change: 1.20, ytd: "+16.8%", flag: "positive" },
  { name: "Hang Seng", country: "🇭🇰 HK", value: "18,472.19", change: -0.73, ytd: "+7.2%", flag: "negative" },
  { name: "Shanghai Comp.", country: "🇨🇳 China", value: "3,152.83", change: 0.21, ytd: "+2.1%", flag: "positive" },
  { name: "ASX 200", country: "🇦🇺 Australia", value: "7,818.90", change: 0.48, ytd: "+3.4%", flag: "positive" },
];

const CHART_DATA = Array.from({ length: 30 }, (_, i) => ({
  label: `Day ${i + 1}`,
  value: 5000 + Math.sin(i / 5) * 150 + i * 10 + Math.random() * 50,
  secondary: 18000 + Math.cos(i / 4) * 300 + i * 25,
}));

const FOREX = [
  { pair: "USD/INR", rate: "83.47", change: -0.08 },
  { pair: "EUR/USD", rate: "1.0842", change: 0.12 },
  { pair: "GBP/USD", rate: "1.2721", change: 0.05 },
  { pair: "USD/JPY", rate: "154.72", change: 0.34 },
  { pair: "BTC/USD", rate: "67,420", change: 2.34 },
  { pair: "GOLD/USD", rate: "2,341", change: 0.21 },
];

export default function GlobalIndices() {
  return (
    <div className="page-container animate-fade-in">
      <div className="page-header flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: "hsl(199 89% 52% / 0.15)" }}>
            <Globe size={20} style={{ color: "hsl(var(--primary))" }} />
          </div>
          <div>
            <h1 className="page-title">Global Indices</h1>
            <p className="page-subtitle">World markets at a glance · Live quotes</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium" style={{ color: "hsl(var(--gain))" }}>
          <span className="w-2 h-2 rounded-full bg-gain pulse-dot" />
          Markets Open
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Markets Up", value: `${INDICES.filter((i) => i.change > 0).length}/${INDICES.length}`, icon: "🟢" },
          { label: "Avg Change", value: `+${(INDICES.reduce((s, i) => s + i.change, 0) / INDICES.length).toFixed(2)}%`, icon: "📊" },
          { label: "Highest Gainer", value: "Nikkei 225", icon: "🥇" },
          { label: "Market Sentiment", value: "Bullish", icon: "🐂" },
        ].map((s, i) => (
          <div key={i} className="glass-card-sm text-center">
            <div className="text-2xl mb-1">{s.icon}</div>
            <p className="text-base font-bold" style={{ color: "hsl(var(--foreground))" }}>{s.value}</p>
            <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Chart */}
        <div className="lg:col-span-2 glass-card">
          <InteractiveDataChart
            data={CHART_DATA}
            title="S&P 500 vs NASDAQ — 30 Days"
            type="area"
            color="hsl(199, 89%, 52%)"
            secondaryColor="hsl(43, 95%, 55%)"
            primaryLabel="S&P 500"
            secondaryLabel="NASDAQ"
            height={240}
          />
        </div>

        {/* Forex */}
        <div className="glass-card">
          <h3 className="text-sm font-bold mb-4" style={{ color: "hsl(var(--foreground))" }}>
            Forex & Commodities
          </h3>
          <div className="space-y-3">
            {FOREX.map((f, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm font-medium" style={{ color: "hsl(var(--foreground))" }}>
                  {f.pair}
                </span>
                <div className="text-right">
                  <p className="text-sm font-bold" style={{ color: "hsl(var(--foreground))" }}>{f.rate}</p>
                  <span className={f.change >= 0 ? "badge-gain" : "badge-loss"}>
                    {f.change >= 0 ? "+" : ""}{f.change.toFixed(2)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Indices table */}
      <div className="glass-card">
        <h3 className="text-sm font-bold mb-5" style={{ color: "hsl(var(--foreground))" }}>
          Global Market Overview
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {INDICES.map((idx, i) => (
            <div
              key={i}
              className="glass-hover rounded-xl p-4 cursor-pointer"
              style={{
                background: "hsl(var(--muted) / 0.4)",
                border: `1px solid hsl(var(--border))`,
              }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-bold" style={{ color: "hsl(var(--foreground))" }}>
                    {idx.name}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>
                    {idx.country}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-base font-bold" style={{ color: "hsl(var(--foreground))" }}>
                    {idx.value}
                  </p>
                  <div className="flex items-center gap-1 justify-end mt-0.5">
                    {idx.change >= 0 ? (
                      <TrendingUp size={11} style={{ color: "hsl(var(--gain))" }} />
                    ) : (
                      <TrendingDown size={11} style={{ color: "hsl(var(--loss))" }} />
                    )}
                    <span
                      className="text-xs font-bold"
                      style={{ color: idx.change >= 0 ? "hsl(var(--gain))" : "hsl(var(--loss))" }}
                    >
                      {idx.change >= 0 ? "+" : ""}{idx.change.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>YTD Return</span>
                <span
                  className="text-xs font-semibold"
                  style={{ color: idx.ytd.startsWith("+") ? "hsl(var(--gain))" : "hsl(var(--loss))" }}
                >
                  {idx.ytd}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
