import { useState } from "react";
import { GraduationCap, ChevronDown, ChevronUp, BookOpen, PlayCircle } from "lucide-react";

const MODULES = [
  {
    id: 1, title: "Investing Fundamentals", icon: "📚", lessons: 8, duration: "2h 30m",
    topics: ["What is Investing?", "Risk vs Return", "Asset Classes", "Diversification", "Power of Compounding", "Time Value of Money", "Setting Financial Goals", "Building a Portfolio"],
  },
  {
    id: 2, title: "Stock Market Basics", icon: "📈", lessons: 10, duration: "3h 15m",
    topics: ["How Stock Markets Work", "Types of Stocks", "Reading a Stock Chart", "Fundamental Analysis", "Technical Analysis Intro", "P/E Ratio & Valuation", "IPOs Explained", "How to Place Orders", "Circuit Filters", "Market Indices"],
  },
  {
    id: 3, title: "Mutual Funds Deep Dive", icon: "🏦", lessons: 7, duration: "2h",
    topics: ["Types of Mutual Funds", "SIP vs Lumpsum", "NAV & AUM", "Expense Ratio", "ELSS Tax Saving", "Direct vs Regular Plans", "How to Redeem"],
  },
  {
    id: 4, title: "Crypto & Web3", icon: "🪙", lessons: 6, duration: "1h 45m",
    topics: ["Blockchain Basics", "How Bitcoin Works", "DeFi Explained", "NFTs & Digital Assets", "Wallets & Security", "Tax on Crypto in India"],
  },
  {
    id: 5, title: "Tax Planning & Saving", icon: "📋", lessons: 5, duration: "1h 20m",
    topics: ["Income Tax Slabs", "Section 80C Investments", "Capital Gains Tax", "HRA & Deductions", "Filing ITR"],
  },
  {
    id: 6, title: "Retirement Planning", icon: "🏖️", lessons: 6, duration: "1h 50m",
    topics: ["EPF & PPF", "NPS Explained", "Annuity Plans", "Retirement Corpus Calculation", "Inflation & Retirement", "Senior Citizen Schemes"],
  },
];

const GLOSSARY = [
  { term: "NAV", def: "Net Asset Value — per unit price of a mutual fund" },
  { term: "SIP", def: "Systematic Investment Plan — fixed periodic investment" },
  { term: "P/E Ratio", def: "Price-to-Earnings — stock valuation metric" },
  { term: "CAGR", def: "Compound Annual Growth Rate — annualized return" },
  { term: "FII", def: "Foreign Institutional Investor — overseas institutional buyers" },
  { term: "DII", def: "Domestic Institutional Investor — Indian funds/LIC etc." },
];

export default function EducationalHub() {
  const [expanded, setExpanded] = useState<number | null>(1);

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "hsl(258 85% 62% / 0.15)" }}>
            <GraduationCap size={20} style={{ color: "hsl(var(--secondary))" }} />
          </div>
          <div>
            <h1 className="page-title">Educational Hub</h1>
            <p className="page-subtitle">Learn investing from basics to advanced strategies</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[{ label: "Modules", value: `${MODULES.length}` }, { label: "Total Lessons", value: "42" }, { label: "Hours of Content", value: "12+" }, { label: "Learners", value: "18K+" }].map((s, i) => (
          <div key={i} className="glass-card-sm text-center">
            <p className="text-2xl font-bold gradient-text">{s.value}</p>
            <p className="text-xs mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {MODULES.map((mod) => (
            <div key={mod.id} className="glass rounded-2xl overflow-hidden">
              <button
                className="w-full flex items-center gap-4 p-5 text-left"
                onClick={() => setExpanded(expanded === mod.id ? null : mod.id)}
              >
                <span className="text-2xl">{mod.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-bold" style={{ color: "hsl(var(--foreground))" }}>{mod.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>
                    {mod.lessons} lessons · {mod.duration}
                  </p>
                </div>
                <button className="btn-primary text-xs px-4 py-1.5 mr-3" onClick={(e) => e.stopPropagation()}>
                  Start
                </button>
                {expanded === mod.id ? <ChevronUp size={16} style={{ color: "hsl(var(--muted-foreground))" }} /> : <ChevronDown size={16} style={{ color: "hsl(var(--muted-foreground))" }} />}
              </button>
              {expanded === mod.id && (
                <div className="px-5 pb-5" style={{ borderTop: "1px solid hsl(var(--border))" }}>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {mod.topics.map((topic, i) => (
                      <div key={i} className="flex items-center gap-2 py-2 px-3 rounded-xl cursor-pointer transition-all"
                        style={{ background: "hsl(var(--muted) / 0.5)" }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "hsl(var(--primary) / 0.1)")}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "hsl(var(--muted) / 0.5)")}
                      >
                        <PlayCircle size={13} style={{ color: "hsl(var(--primary))", flexShrink: 0 }} />
                        <span className="text-xs" style={{ color: "hsl(var(--foreground))" }}>{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="glass-card">
            <h3 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: "hsl(var(--foreground))" }}>
              <BookOpen size={15} style={{ color: "hsl(var(--accent))" }} /> Finance Glossary
            </h3>
            <div className="space-y-3">
              {GLOSSARY.map((g, i) => (
                <div key={i} className="pb-3" style={{ borderBottom: i < GLOSSARY.length - 1 ? "1px solid hsl(var(--border))" : "none" }}>
                  <p className="text-xs font-bold" style={{ color: "hsl(var(--primary))" }}>{g.term}</p>
                  <p className="text-xs mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>{g.def}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="glass-card" style={{ background: "hsl(var(--primary) / 0.08)", border: "1px solid hsl(var(--primary) / 0.2)" }}>
            <p className="text-sm font-bold mb-1" style={{ color: "hsl(var(--foreground))" }}>💡 Tip of the Day</p>
            <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
              The Rule of 72: Divide 72 by your annual return rate to find out how many years it takes to double your money.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
