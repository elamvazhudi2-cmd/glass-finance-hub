import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Plus, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import InteractiveDataChart from "@/components/InteractiveDataChart";

interface Holding {
  id: number;
  symbol: string;
  name: string;
  qty: number;
  avgPrice: number;
  cmp: number;
  type: "stock" | "crypto" | "fd" | "mf";
}

const INITIAL: Holding[] = [
  { id: 1, symbol: "AAPL", name: "Apple Inc.", qty: 15, avgPrice: 155, cmp: 189.30, type: "stock" },
  { id: 2, symbol: "NVDA", name: "NVIDIA Corp.", qty: 8, avgPrice: 650, cmp: 875.39, type: "stock" },
  { id: 3, symbol: "BTC", name: "Bitcoin", qty: 0.12, avgPrice: 52000, cmp: 67420, type: "crypto" },
  { id: 4, symbol: "ETH", name: "Ethereum", qty: 2.5, avgPrice: 2800, cmp: 3842, type: "crypto" },
  { id: 5, symbol: "RELIANCE", name: "Reliance Ind.", qty: 30, avgPrice: 2650, cmp: 2948, type: "stock" },
  { id: 6, symbol: "HDFC Flexi", name: "HDFC Flexi Cap", qty: 500, avgPrice: 48, cmp: 64.2, type: "mf" },
];

const PIE_COLORS = [
  "hsl(199, 89%, 52%)",
  "hsl(258, 85%, 62%)",
  "hsl(43, 95%, 55%)",
  "hsl(158, 64%, 52%)",
  "hsl(0, 85%, 60%)",
  "hsl(30, 90%, 60%)",
];

const PERF_DATA = Array.from({ length: 12 }, (_, i) => ({
  label: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],
  value: 82000 + i * 3600 + Math.sin(i / 2) * 4000,
  secondary: 82000 + i * 1800,
}));

export default function PortfolioManager() {
  const [holdings, setHoldings] = useState<Holding[]>(INITIAL);

  const totalValue = holdings.reduce((s, h) => s + h.qty * h.cmp, 0);
  const totalCost = holdings.reduce((s, h) => s + h.qty * h.avgPrice, 0);
  const totalGain = totalValue - totalCost;
  const totalPct = (totalGain / totalCost) * 100;

  const pieData = holdings.map((h) => ({
    name: h.symbol,
    value: Math.round(h.qty * h.cmp),
  }));

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(n);

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="page-title">Portfolio Manager</h1>
          <p className="page-subtitle">Track, analyze and optimize your investments</p>
        </div>
        <button className="btn-primary text-sm flex items-center gap-2">
          <Plus size={14} /> Add Holding
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Portfolio Value", value: fmt(totalValue), icon: "💼", positive: true },
          { label: "Total Invested", value: fmt(totalCost), icon: "💰", positive: true },
          { label: "Total P&L", value: `${totalGain >= 0 ? "+" : ""}${fmt(totalGain)}`, icon: totalGain >= 0 ? "📈" : "📉", positive: totalGain >= 0 },
          { label: "Overall Return", value: `${totalPct.toFixed(2)}%`, icon: "📊", positive: totalPct >= 0 },
        ].map((s, i) => (
          <div key={i} className="glass-card">
            <div className="text-2xl mb-2">{s.icon}</div>
            <p className="text-xl font-bold" style={{ color: s.positive ? "hsl(var(--foreground))" : "hsl(var(--loss))" }}>
              {s.value}
            </p>
            <p className="text-xs mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Pie chart */}
        <div className="glass-card">
          <h3 className="text-sm font-bold mb-4" style={{ color: "hsl(var(--foreground))" }}>
            Asset Allocation
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v: number) => [fmt(v), "Value"]}
                contentStyle={{
                  background: "hsl(220 25% 10%)",
                  border: "1px solid hsl(215 25% 20%)",
                  borderRadius: "12px",
                  color: "hsl(210 40% 95%)",
                }}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(v) => <span style={{ color: "hsl(215 20% 65%)", fontSize: 11 }}>{v}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Performance chart */}
        <div className="lg:col-span-2 glass-card">
          <InteractiveDataChart
            data={PERF_DATA}
            title="12-Month Performance"
            type="area"
            color="hsl(199, 89%, 52%)"
            secondaryColor="hsl(258, 85%, 62%)"
            primaryLabel="Portfolio"
            secondaryLabel="Benchmark"
            prefix="$"
            showTimeRanges={false}
            height={220}
          />
        </div>
      </div>

      {/* Holdings table */}
      <div className="glass-card">
        <h3 className="text-sm font-bold mb-4" style={{ color: "hsl(var(--foreground))" }}>
          Holdings
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid hsl(var(--border))" }}>
                {["Symbol", "Name", "Qty", "Avg Price", "CMP", "Current Value", "P&L", "Return %", ""].map((h) => (
                  <th key={h} className="text-left pb-3 text-xs font-semibold pr-4" style={{ color: "hsl(var(--muted-foreground))" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {holdings.map((h) => {
                const val = h.qty * h.cmp;
                const cost = h.qty * h.avgPrice;
                const pl = val - cost;
                const pct = (pl / cost) * 100;
                return (
                  <tr
                    key={h.id}
                    className="cursor-pointer transition-colors"
                    style={{ borderBottom: "1px solid hsl(var(--border))" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "hsl(var(--muted) / 0.5)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <td className="py-3 pr-4">
                      <span className="text-xs font-bold px-2 py-1 rounded-lg" style={{ background: "hsl(var(--primary) / 0.15)", color: "hsl(var(--primary))" }}>
                        {h.symbol}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-sm" style={{ color: "hsl(var(--foreground))" }}>{h.name}</td>
                    <td className="py-3 pr-4 text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>{h.qty}</td>
                    <td className="py-3 pr-4 text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>${h.avgPrice.toLocaleString()}</td>
                    <td className="py-3 pr-4 text-sm font-semibold" style={{ color: "hsl(var(--foreground))" }}>${h.cmp.toLocaleString()}</td>
                    <td className="py-3 pr-4 text-sm font-semibold" style={{ color: "hsl(var(--foreground))" }}>{fmt(val)}</td>
                    <td className="py-3 pr-4">
                      <span style={{ color: pl >= 0 ? "hsl(var(--gain))" : "hsl(var(--loss))" }} className="text-sm font-semibold flex items-center gap-1">
                        {pl >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {pl >= 0 ? "+" : ""}{fmt(pl)}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className={pct >= 0 ? "badge-gain" : "badge-loss"}>
                        {pct >= 0 ? "+" : ""}{pct.toFixed(2)}%
                      </span>
                    </td>
                    <td className="py-3">
                      <button
                        onClick={() => setHoldings((p) => p.filter((x) => x.id !== h.id))}
                        className="p-1.5 rounded-lg transition-colors"
                        style={{ color: "hsl(var(--muted-foreground))" }}
                        aria-label="Remove holding"
                        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "hsl(var(--loss))")}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "hsl(var(--muted-foreground))")}
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
