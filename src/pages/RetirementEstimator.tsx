import { useState } from "react";
import InteractiveDataChart from "@/components/InteractiveDataChart";

function fmt(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

export default function RetirementEstimator() {
  const [currentAge, setCurrentAge] = useState(30);
  const [retireAge, setRetireAge] = useState(60);
  const [lifeExpect, setLifeExpect] = useState(85);
  const [monthly, setMonthly] = useState(50000);
  const [inflation, setInflation] = useState(6);
  const [returns, setReturns] = useState(12);
  const [corpus, setCorpus] = useState(1000000);

  const years = retireAge - currentAge;
  const r = returns / 1200;
  const n = years * 12;
  const futureMonthlyNeed = monthly * Math.pow(1 + inflation / 100, years);
  const corpusNeeded = futureMonthlyNeed * 12 / ((returns - inflation) / 100);
  const sipNeeded = corpusNeeded * r / (Math.pow(1 + r, n) - 1);
  const currentCorpusFuture = corpus * Math.pow(1 + returns / 100, years);
  const additionalNeeded = Math.max(0, corpusNeeded - currentCorpusFuture);
  const postRetireYears = lifeExpect - retireAge;

  const chartData = Array.from({ length: years }, (_, i) => {
    const t = i + 1;
    const val = corpus * Math.pow(1 + returns / 100, t) + monthly * 12 * ((Math.pow(1 + returns / 100, t) - 1) / (returns / 100));
    return { label: `Age ${currentAge + t}`, value: Math.round(val) };
  });

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Retirement Estimator</h1>
        <p className="page-subtitle">Plan your financial freedom — estimate corpus & SIP needed</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="glass-card">
          <h2 className="text-base font-bold mb-5" style={{ color: "hsl(var(--foreground))" }}>Your Details</h2>
          <div className="space-y-6">
            {[
              { label: "Current Age", value: currentAge, min: 18, max: 60, step: 1, setter: setCurrentAge, display: `${currentAge} yrs` },
              { label: "Retirement Age", value: retireAge, min: 40, max: 75, step: 1, setter: setRetireAge, display: `${retireAge} yrs` },
              { label: "Life Expectancy", value: lifeExpect, min: 60, max: 100, step: 1, setter: setLifeExpect, display: `${lifeExpect} yrs` },
              { label: "Monthly Expenses (Today)", value: monthly, min: 10000, max: 500000, step: 5000, setter: setMonthly, display: fmt(monthly) },
              { label: "Expected Inflation", value: inflation, min: 3, max: 12, step: 0.5, setter: setInflation, display: `${inflation}%` },
              { label: "Expected Returns", value: returns, min: 6, max: 20, step: 0.5, setter: setReturns, display: `${returns}%` },
              { label: "Current Savings", value: corpus, min: 0, max: 10000000, step: 50000, setter: setCorpus, display: fmt(corpus) },
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
        </div>

        <div className="space-y-4">
          {[
            { label: "Corpus Needed at Retirement", value: fmt(corpusNeeded), icon: "🎯", color: "hsl(var(--primary))" },
            { label: "Monthly SIP Required", value: fmt(sipNeeded), icon: "📅", color: "hsl(var(--accent))" },
            { label: "Retirement Expenses (Monthly)", value: fmt(futureMonthlyNeed), icon: "🏖️", color: "hsl(var(--gain))" },
            { label: "Post-Retirement Duration", value: `${postRetireYears} years`, icon: "⏳", color: "hsl(var(--secondary))" },
          ].map((s, i) => (
            <div key={i} className="glass-card flex items-center gap-4">
              <span className="text-3xl">{s.icon}</span>
              <div>
                <p className="text-xl font-bold" style={{ color: s.color }}>{s.value}</p>
                <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{s.label}</p>
              </div>
            </div>
          ))}
          {additionalNeeded > 0 && (
            <div className="glass-card" style={{ border: "1px solid hsl(var(--accent) / 0.3)" }}>
              <p className="text-xs font-semibold mb-1" style={{ color: "hsl(var(--accent))" }}>⚠️ Savings Gap</p>
              <p className="text-lg font-bold" style={{ color: "hsl(var(--loss))" }}>{fmt(additionalNeeded)}</p>
              <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>Additional corpus to be built</p>
            </div>
          )}
        </div>
      </div>

      <div className="glass-card">
        <InteractiveDataChart data={chartData} title="Retirement Corpus Growth" type="area"
          color="hsl(43, 95%, 55%)" primaryLabel="Corpus Value" prefix="₹" showTimeRanges={false} height={260} />
      </div>
    </div>
  );
}
