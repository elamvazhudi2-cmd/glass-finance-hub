import { useState, useCallback } from "react";
import { Calculator, TrendingUp, PiggyBank, BarChart2 } from "lucide-react";
import InteractiveDataChart from "@/components/InteractiveDataChart";

type CalcMode = "fd" | "sip" | "lumpsum" | "ppf";

function fmt(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

function useCalc() {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(12);
  const [tenure, setTenure] = useState(10);
  const [monthly, setMonthly] = useState(5000);

  const fdMaturity = principal * Math.pow(1 + rate / 400, 4 * tenure);
  const fdInterest = fdMaturity - principal;

  const sipMonths = tenure * 12;
  const sipR = rate / 1200;
  const sipFuture = monthly * ((Math.pow(1 + sipR, sipMonths) - 1) / sipR) * (1 + sipR);
  const sipInvested = monthly * sipMonths;
  const sipGain = sipFuture - sipInvested;

  const lumpsumFuture = principal * Math.pow(1 + rate / 100, tenure);
  const lumpsumGain = lumpsumFuture - principal;

  const ppfRate = 7.1 / 100;
  const ppfFuture = monthly * 12 * ((Math.pow(1 + ppfRate, tenure) - 1) / ppfRate) * (1 + ppfRate);
  const ppfInvested = monthly * 12 * tenure;
  const ppfGain = ppfFuture - ppfInvested;

  return {
    principal, setPrincipal,
    rate, setRate,
    tenure, setTenure,
    monthly, setMonthly,
    fdMaturity, fdInterest,
    sipFuture, sipInvested, sipGain,
    lumpsumFuture, lumpsumGain,
    ppfFuture, ppfInvested, ppfGain,
  };
}

const MODES: { key: CalcMode; label: string; icon: React.ReactNode }[] = [
  { key: "fd", label: "Fixed Deposit", icon: <BarChart2 size={15} /> },
  { key: "sip", label: "SIP (Mutual Fund)", icon: <TrendingUp size={15} /> },
  { key: "lumpsum", label: "Lumpsum", icon: <PiggyBank size={15} /> },
  { key: "ppf", label: "PPF / EPF", icon: <Calculator size={15} /> },
];

export default function InvestmentCalculator() {
  const [mode, setMode] = useState<CalcMode>("sip");
  const calc = useCalc();

  /* onInput real-time calculator updates */
  const handleInput = useCallback(
    (setter: (v: number) => void) =>
      (e: React.ChangeEvent<HTMLInputElement>) =>
        setter(Number(e.target.value)),
    []
  );

  const chartData = Array.from({ length: calc.tenure }, (_, i) => {
    const t = i + 1;
    let val = 0, invested = 0;
    if (mode === "fd") {
      val = calc.principal * Math.pow(1 + calc.rate / 400, 4 * t);
      invested = calc.principal;
    } else if (mode === "sip") {
      const r = calc.rate / 1200;
      const m = t * 12;
      val = calc.monthly * ((Math.pow(1 + r, m) - 1) / r) * (1 + r);
      invested = calc.monthly * m;
    } else if (mode === "lumpsum") {
      val = calc.principal * Math.pow(1 + calc.rate / 100, t);
      invested = calc.principal;
    } else {
      const r = 7.1 / 100;
      val = calc.monthly * 12 * ((Math.pow(1 + r, t) - 1) / r) * (1 + r);
      invested = calc.monthly * 12 * t;
    }
    return { label: `Yr ${t}`, value: Math.round(val), secondary: Math.round(invested) };
  });

  const maturity = mode === "fd" ? calc.fdMaturity
    : mode === "sip" ? calc.sipFuture
    : mode === "lumpsum" ? calc.lumpsumFuture
    : calc.ppfFuture;

  const gain = mode === "fd" ? calc.fdInterest
    : mode === "sip" ? calc.sipGain
    : mode === "lumpsum" ? calc.lumpsumGain
    : calc.ppfGain;

  const invested = mode === "fd" || mode === "lumpsum"
    ? calc.principal
    : mode === "sip"
    ? calc.sipInvested
    : calc.ppfInvested;

  const returnPct = ((maturity - invested) / invested * 100).toFixed(1);

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Master Investment Calculator</h1>
        <p className="page-subtitle">FD · SIP · Lumpsum · PPF — Live computation with compound interest</p>
      </div>

      {/* Mode tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {MODES.map((m) => (
          <button
            key={m.key}
            onClick={() => setMode(m.key)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: mode === m.key ? "var(--gradient-primary)" : "hsl(var(--muted))",
              color: mode === m.key ? "hsl(var(--primary-foreground))" : "hsl(var(--muted-foreground))",
              boxShadow: mode === m.key ? "0 4px 16px hsl(199 89% 52% / 0.3)" : "none",
            }}
          >
            {m.icon} {m.label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="glass-card">
          <h3 className="text-base font-bold mb-6" style={{ color: "hsl(var(--foreground))" }}>
            Adjust Parameters
          </h3>
          <div className="space-y-7">
            {(mode === "sip" || mode === "ppf") ? (
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-xs font-medium" style={{ color: "hsl(var(--muted-foreground))" }}>
                    Monthly Investment
                  </label>
                  <span className="text-xs font-bold" style={{ color: "hsl(var(--primary))" }}>
                    {fmt(calc.monthly)}
                  </span>
                </div>
                <input type="range" className="w-full" min={500} max={100000} step={500}
                  value={calc.monthly} onChange={handleInput(calc.setMonthly)} aria-label="Monthly investment"
                  style={{ accentColor: "hsl(var(--primary))" }} />
              </div>
            ) : (
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-xs font-medium" style={{ color: "hsl(var(--muted-foreground))" }}>
                    Principal Amount
                  </label>
                  <span className="text-xs font-bold" style={{ color: "hsl(var(--primary))" }}>
                    {fmt(calc.principal)}
                  </span>
                </div>
                <input type="range" className="w-full" min={1000} max={10000000} step={1000}
                  value={calc.principal} onChange={handleInput(calc.setPrincipal)} aria-label="Principal amount"
                  style={{ accentColor: "hsl(var(--primary))" }} />
              </div>
            )}

            {mode !== "ppf" && (
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-xs font-medium" style={{ color: "hsl(var(--muted-foreground))" }}>
                    Expected Return (% p.a.)
                  </label>
                  <span className="text-xs font-bold" style={{ color: "hsl(var(--primary))" }}>
                    {calc.rate}%
                  </span>
                </div>
                <input type="range" className="w-full" min={1} max={30} step={0.5}
                  value={calc.rate} onChange={handleInput(calc.setRate)} aria-label="Interest rate"
                  style={{ accentColor: "hsl(var(--primary))" }} />
              </div>
            )}

            {mode === "ppf" && (
              <div className="glass-card-sm">
                <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                  PPF Fixed Rate: <strong style={{ color: "hsl(var(--accent))" }}>7.1% p.a.</strong> (Government of India, Q1 FY2025)
                </p>
              </div>
            )}

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-xs font-medium" style={{ color: "hsl(var(--muted-foreground))" }}>
                  Time Period
                </label>
                <span className="text-xs font-bold" style={{ color: "hsl(var(--primary))" }}>
                  {calc.tenure} Years
                </span>
              </div>
              <input type="range" className="w-full" min={1} max={40} step={1}
                value={calc.tenure} onChange={handleInput(calc.setTenure)} aria-label="Time period"
                style={{ accentColor: "hsl(var(--primary))" }} />
            </div>

            {/* Summary */}
            <div
              className="rounded-2xl p-5 space-y-3"
              style={{ background: "hsl(var(--primary) / 0.08)", border: "1px solid hsl(var(--primary) / 0.2)" }}
            >
              {[
                { label: "Total Invested", value: fmt(invested), color: "hsl(var(--foreground))" },
                { label: "Wealth Gained", value: `+${fmt(gain)}`, color: "hsl(var(--gain))" },
                { label: "Total Returns", value: `${returnPct}%`, color: "hsl(var(--accent))" },
              ].map((r, i) => (
                <div key={i} className="flex justify-between">
                  <span className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>{r.label}</span>
                  <span className="text-sm font-bold" style={{ color: r.color }}>{r.value}</span>
                </div>
              ))}
              <div
                className="flex justify-between pt-3"
                style={{ borderTop: "1px solid hsl(var(--primary) / 0.2)" }}
              >
                <span className="text-base font-bold" style={{ color: "hsl(var(--foreground))" }}>Maturity Amount</span>
                <span className="text-base font-bold" style={{ color: "hsl(var(--primary))" }}>
                  {fmt(maturity)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="glass-card flex flex-col">
          <InteractiveDataChart
            data={chartData}
            title="Wealth Growth Projection"
            type="area"
            color="hsl(199, 89%, 52%)"
            secondaryColor="hsl(258, 85%, 62%)"
            primaryLabel="Maturity Value"
            secondaryLabel="Amount Invested"
            prefix="₹"
            showTimeRanges={false}
            height={300}
          />
          <div className="mt-4 flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 rounded" style={{ background: "hsl(199,89%,52%)", display: "inline-block" }} />
              <span style={{ color: "hsl(var(--muted-foreground))" }}>Maturity Value</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 rounded" style={{ background: "hsl(258,85%,62%)", display: "inline-block" }} />
              <span style={{ color: "hsl(var(--muted-foreground))" }}>Amount Invested</span>
            </span>
          </div>
        </div>
      </div>

      {/* Formula card */}
      <div className="mt-6 glass-card">
        <h3 className="text-sm font-bold mb-3" style={{ color: "hsl(var(--foreground))" }}>
          Formula Used
        </h3>
        <div
          className="font-mono text-xs rounded-xl p-4 overflow-x-auto"
          style={{ background: "hsl(var(--muted))", color: "hsl(var(--primary))" }}
        >
          {mode === "fd" && "A = P × (1 + r/n)^(n×t)  →  where P=Principal, r=Rate, n=Compounding Freq, t=Time"}
          {mode === "sip" && "FV = P × [(1 + r)^n − 1] / r × (1 + r)  →  where P=Monthly, r=Rate/12, n=Months"}
          {mode === "lumpsum" && "A = P × (1 + r/100)^t  →  where P=Principal, r=Annual Rate, t=Years"}
          {mode === "ppf" && "FV = P × [(1 + r)^n − 1] / r × (1 + r)  →  PPF at fixed rate of 7.1% p.a."}
        </div>
      </div>
    </div>
  );
}
