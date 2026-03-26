import { useState } from "react";
import { Newspaper, Clock, ExternalLink, Bookmark, TrendingUp, Search } from "lucide-react";

const NEWS = [
  { id: 1, title: "Fed Signals Rate Cuts in 2025 as Inflation Cools", category: "Macro", time: "2h ago", source: "Reuters", summary: "Federal Reserve officials indicated readiness to begin cutting interest rates as inflation shows sustained decline toward the 2% target.", impact: "positive", tags: ["Fed", "Rates", "Inflation"] },
  { id: 2, title: "NVIDIA Surpasses $2T Market Cap Milestone", category: "Tech", time: "4h ago", source: "Bloomberg", summary: "NVIDIA becomes only the third company in history to surpass the $2 trillion market cap, driven by AI chip demand.", impact: "positive", tags: ["NVDA", "AI", "Semiconductors"] },
  { id: 3, title: "Bitcoin ETF Sees Record $1.2B Inflow in Single Day", category: "Crypto", time: "5h ago", source: "CoinDesk", summary: "Spot Bitcoin ETFs collectively saw their highest single-day inflow since launch, signaling growing institutional adoption.", impact: "positive", tags: ["BTC", "ETF", "Institutional"] },
  { id: 4, title: "Sensex Surges 800 Points; Nifty Breaches 22,500", category: "India", time: "6h ago", source: "ET Markets", summary: "Indian equity markets rallied sharply led by banking and IT stocks after strong FII buying and positive global cues.", impact: "positive", tags: ["NIFTY", "SENSEX", "FII"] },
  { id: 5, title: "Oil Prices Slide as OPEC+ Signals Output Increase", category: "Commodities", time: "8h ago", source: "CNBC", summary: "Crude oil fell 2.3% after reports that OPEC+ is considering increasing production quotas at the upcoming June meeting.", impact: "negative", tags: ["Oil", "OPEC", "Commodities"] },
  { id: 6, title: "RBI Holds Rates at 6.5%; Maintains Withdrawal Stance", category: "India", time: "1d ago", source: "LiveMint", summary: "The Reserve Bank of India maintained its repo rate at 6.5% for the seventh consecutive time while keeping its policy stance on withdrawal of accommodation.", impact: "neutral", tags: ["RBI", "Policy", "India"] },
  { id: 7, title: "Apple Unveils M4 MacBook Pro with AI-Focused Features", category: "Tech", time: "1d ago", source: "TechCrunch", summary: "Apple announced the new MacBook Pro lineup powered by M4 chips, featuring significant AI processing improvements via the Neural Engine.", impact: "positive", tags: ["AAPL", "AI", "Product"] },
  { id: 8, title: "Reliance Industries Q4 Results Beat Estimates", category: "India", time: "2d ago", source: "BSE", summary: "Reliance Industries reported Q4 net profit of ₹18,951 crore, a 7.3% YoY increase, beating analyst estimates on strong Jio and Retail performance.", impact: "positive", tags: ["RELIANCE", "Earnings", "Q4"] },
];

const CATEGORIES = ["All", "Macro", "Tech", "Crypto", "India", "Commodities"];
const IMPACT_STYLES = {
  positive: { bg: "hsl(158 64% 52% / 0.1)", color: "hsl(var(--gain))", border: "hsl(158 64% 52% / 0.3)", dot: "hsl(var(--gain))" },
  negative: { bg: "hsl(0 85% 60% / 0.1)", color: "hsl(var(--loss))", border: "hsl(0 85% 60% / 0.3)", dot: "hsl(var(--loss))" },
  neutral: { bg: "hsl(215 20% 55% / 0.1)", color: "hsl(var(--muted-foreground))", border: "hsl(215 20% 55% / 0.3)", dot: "hsl(var(--muted-foreground))" },
};

export default function MarketNews() {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [bookmarks, setBookmarks] = useState<number[]>([]);

  const filtered = NEWS.filter(
    (n) =>
      (category === "All" || n.category === category) &&
      (n.title.toLowerCase().includes(query.toLowerCase()) ||
        n.summary.toLowerCase().includes(query.toLowerCase()))
  );

  const toggleBookmark = (id: number) => {
    setBookmarks((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: "hsl(43 95% 55% / 0.15)" }}>
            <Newspaper size={20} style={{ color: "hsl(var(--accent))" }} />
          </div>
          <div>
            <h1 className="page-title">Market News & Insights</h1>
            <p className="page-subtitle">Curated financial news with market impact analysis</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium" style={{ color: "hsl(var(--gain))" }}>
          <span className="w-2 h-2 rounded-full bg-gain pulse-dot" />
          Live Updates
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "hsl(var(--muted-foreground))" }} />
        <input
          className="w-full glass rounded-xl pl-11 pr-4 py-3 text-sm outline-none"
          placeholder="Search news, topics, companies…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ color: "hsl(var(--foreground))", background: "transparent" }}
        />
      </div>

      {/* Category filters */}
      <div className="flex gap-2 flex-wrap mb-6">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className="px-4 py-2 rounded-xl text-xs font-medium transition-all"
            style={{
              background: category === c ? "hsl(var(--accent) / 0.2)" : "hsl(var(--muted))",
              color: category === c ? "hsl(var(--accent))" : "hsl(var(--muted-foreground))",
              border: category === c ? "1px solid hsl(var(--accent) / 0.4)" : "1px solid transparent",
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* News grid */}
      <div className="grid lg:grid-cols-2 gap-5">
        {filtered.map((item) => {
          const style = IMPACT_STYLES[item.impact as keyof typeof IMPACT_STYLES];
          return (
            <article
              key={item.id}
              className="glass glass-hover rounded-2xl p-5 cursor-pointer group"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-semibold"
                    style={{ background: style.bg, color: style.color, border: `1px solid ${style.border}` }}
                  >
                    <span className="inline-block w-1.5 h-1.5 rounded-full mr-1 align-middle" style={{ background: style.dot }} />
                    {item.category}
                  </span>
                  <span className="text-xs flex items-center gap-1" style={{ color: "hsl(var(--muted-foreground))" }}>
                    <Clock size={11} /> {item.time}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleBookmark(item.id); }}
                    className="p-1.5 rounded-lg transition-colors"
                    aria-label="Bookmark article"
                    style={{ color: bookmarks.includes(item.id) ? "hsl(var(--accent))" : "hsl(var(--muted-foreground))" }}
                  >
                    <Bookmark size={14} fill={bookmarks.includes(item.id) ? "currentColor" : "none"} />
                  </button>
                  <ExternalLink size={14} style={{ color: "hsl(var(--muted-foreground))" }} />
                </div>
              </div>

              <h3
                className="text-base font-bold mb-2 group-hover:text-primary transition-colors leading-snug"
                style={{ color: "hsl(var(--foreground))" }}
              >
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed mb-3" style={{ color: "hsl(var(--muted-foreground))" }}>
                {item.summary}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex gap-1.5 flex-wrap">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 rounded-lg font-medium"
                      style={{ background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <span className="text-xs font-medium flex items-center gap-1" style={{ color: "hsl(var(--primary))" }}>
                  {item.source} <TrendingUp size={11} />
                </span>
              </div>
            </article>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16" style={{ color: "hsl(var(--muted-foreground))" }}>
          <Newspaper size={36} className="mx-auto mb-3 opacity-30" />
          <p>No news matching your criteria</p>
        </div>
      )}
    </div>
  );
}
