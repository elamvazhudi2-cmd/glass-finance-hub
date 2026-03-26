import { useState } from "react";
import { FileText, Info } from "lucide-react";

const TAX_SLABS_NEW = [
  { range: "Up to ₹3L", rate: "0%", tax: 0 },
  { range: "₹3L – ₹7L", rate: "5%", tax: 5 },
  { range: "₹7L – ₹10L", rate: "10%", tax: 10 },
  { range: "₹10L – ₹12L", rate: "15%", tax: 15 },
  { range: "₹12L – ₹15L", rate: "20%", tax: 20 },
  { range: "Above ₹15L", rate: "30%", tax: 30 },
];

function calcTax(income: number, regime: "new" | "old"): number {
  if (regime === "new") {
    let tax = 0;
    const slabs = [
      { upto: 300000, rate: 0 },
      { upto: 700000, rate: 0.05 },
      { upto: 1000000, rate: 0.10 },
      { upto: 1200000, rate: 0.15 },
      { upto: 1500000, rate: 0.20 },
      { upto: Infinity, rate: 0.30 },
    ];
    let prev = 0;
    for (const slab of slabs) {
      if (income <= prev) break;
      const taxable = Math.min(income, slab.upto) - prev;
      tax += taxable * slab.rate;
      prev = slab.upto;
    }
    return tax;
  } else {
    let tax = 0;
    if (income <= 250000) return 0;
    if (income <= 500000) tax = (income - 250000) * 0.05;
    else if (income <= 1000000) tax = 12500 + (income - 500000) * 0.20;
    else tax = 112500 + (income - 1000000) * 0.30;
    return tax;
  }
}

function fmt(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

export default function TaxPlanner() {
  const [income, setIncome] = useState(1200000);
  const [regime, setRegime] = useState<"new" | "old">("new");
  const [section80c, setSection80c] = useState(150000);
  const [hra, setHra] = useState(60000);
  const [nps, setNps] = useState(50000);

  const deductions = regime === "old" ? section80c + hra + nps : 75000;
  const taxableIncome = Math.max(0, income - deductions);
  const tax = calcTax(taxableIncome, regime);
  const cess = tax * 0.04;
  const totalTax = tax + cess;
  const effectiveRate = income > 0 ? (totalTax / income) * 100 : 0;

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Tax Planner</h1>
        <p className="page-subtitle">FY 2024-25 · Income Tax Estimation & Optimization</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="glass-card">
          <h2 className="text-base font-bold mb-5" style={{ color: "hsl(var(--foreground))" }}>Income & Deductions</h2>

          <div className="flex gap-2 mb-6">
            {(["new", "old"] as const).map((r) => (
              <button key={r} onClick={() => setRegime(r)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all"
                style={{
                  background: regime === r ? "var(--gradient-primary)" : "hsl(var(--muted))",
                  color: regime === r ? "hsl(var(--primary-foreground))" : "hsl(var(--muted-foreground))",
                }}>
                {r} Regime
              </button>
            ))}
          </div>

          <div className="space-y-5">
            {[
              { label: "Gross Annual Income", value: income, setter: setIncome, min: 100000, max: 10000000, step: 50000, display: fmt(income) },
              ...(regime === "old" ? [
                { label: "Section 80C (Max ₹1.5L)", value: section80c, setter: setSection80c, min: 0, max: 150000, step: 5000, display: fmt(section80c) },
                { label: "HRA Exemption", value: hra, setter: setHra, min: 0, max: 500000, step: 5000, display: fmt(hra) },
                { label: "NPS (Sec 80CCD)", value: nps, setter: setNps, min: 0, max: 200000, step: 5000, display: fmt(nps) },
              ] : []),
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between mb-2">
                  <label className="text-xs font-medium" style={{ color: "hsl(var(--muted-foreground))" }}>{item.label}</label>
                  <span className="text-xs font-bold" style={{ color: "hsl(var(--primary))" }}>{item.display}</span>
                </div>
                <input type="range" className="w-full" min={item.min} max={item.max} step={item.step}
                  value={item.value} onChange={(e) => item.setter(Number(e.target.value))}
                  style={{ accentColor: "hsl(var(--primary))" }} />
              </div>
            ))}
          </div>

          {regime === "new" && (
            <div className="mt-4 glass-card-sm flex items-start gap-2">
              <Info size={14} style={{ color: "hsl(var(--primary))", flexShrink: 0, marginTop: 1 }} />
              <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                New Regime offers a standard deduction of ₹75,000 (Budget 2024).
              </p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="glass-card">
            <h2 className="text-base font-bold mb-4" style={{ color: "hsl(var(--foreground))" }}>Tax Summary</h2>
            {[
              { label: "Gross Income", value: fmt(income) },
              { label: "Total Deductions", value: fmt(deductions), color: "hsl(var(--gain))" },
              { label: "Taxable Income", value: fmt(taxableIncome) },
              { label: "Income Tax", value: fmt(tax) },
              { label: "Health & Edu Cess (4%)", value: fmt(cess) },
            ].map((r, i) => (
              <div key={i} className="flex justify-between py-2.5" style={{ borderBottom: "1px solid hsl(var(--border))" }}>
                <span className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>{r.label}</span>
                <span className="text-sm font-semibold" style={{ color: r.color || "hsl(var(--foreground))" }}>{r.value}</span>
              </div>
            ))}
            <div className="flex justify-between pt-4">
              <span className="text-base font-bold" style={{ color: "hsl(var(--foreground))" }}>Total Tax Liability</span>
              <span className="text-base font-bold" style={{ color: "hsl(var(--loss))" }}>{fmt(totalTax)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card text-center">
              <p className="text-2xl font-bold" style={{ color: "hsl(var(--accent))" }}>{effectiveRate.toFixed(2)}%</p>
              <p className="text-xs mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>Effective Tax Rate</p>
            </div>
            <div className="glass-card text-center">
              <p className="text-2xl font-bold" style={{ color: "hsl(var(--gain))" }}>{fmt(income - totalTax)}</p>
              <p className="text-xs mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>In-Hand Income</p>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card">
        <h2 className="text-base font-bold mb-4" style={{ color: "hsl(var(--foreground))" }}>New Tax Regime Slabs (FY 2024-25)</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid hsl(var(--border))" }}>
                {["Income Range", "Tax Rate"].map((h) => (
                  <th key={h} className="text-left pb-3 text-xs font-semibold pr-6" style={{ color: "hsl(var(--muted-foreground))" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TAX_SLABS_NEW.map((s, i) => (
                <tr key={i} style={{ borderBottom: "1px solid hsl(var(--border))" }}>
                  <td className="py-3 text-sm pr-6" style={{ color: "hsl(var(--foreground))" }}>{s.range}</td>
                  <td className="py-3">
                    <span className={s.tax === 0 ? "badge-gain" : s.tax >= 20 ? "badge-loss" : "badge-neutral"}>
                      {s.rate}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
