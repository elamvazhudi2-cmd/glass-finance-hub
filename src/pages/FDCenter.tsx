import { useState, useCallback } from "react";
import { Building2, Plus } from "lucide-react";
import InteractiveDataChart from "@/components/InteractiveDataChart";

const BANKS = [
  { name: "State Bank of India", rate: 6.80, tenure: "1-3 Yr", minAmt: "₹1,000" },
  { name: "HDFC Bank", rate: 7.10, tenure: "1-5 Yr", minAmt: "₹5,000" },
  { name: "ICICI Bank", rate: 7.00, tenure: "1-5 Yr", minAmt: "₹10,000" },
  { name: "Axis Bank", rate: 7.20, tenure: "7 Days-10 Yr", minAmt: "₹5,000" },
  { name: "Kotak Mahindra", rate: 7.40, tenure: "7 Days-10 Yr", minAmt: "₹5,000" },
  { name: "Bank of Baroda", rate: 6.85, tenure: "7 Days-10 Yr", minAmt: "₹1,000" },
  { name: "Punjab National", rate: 6.75, tenure: "7 Days-10 Yr", minAmt: "₹1,000" },
  { name: "IndusInd Bank", rate: 7.75, tenure: "1-5 Yr", minAmt: "₹10,000" },
];

function formatINR(val: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val);
}

export default function FDCenter() {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(7.10);
  const [tenure, setTenure] = useState(3);
  const [compFreq, setCompFreq] = useState(4);

  const maturityAmt = principal * Math.pow(1 + rate / (100 * compFreq), compFreq * tenure);
  const interest = maturityAmt - principal;

  const CHART_DATA = Array.from({ length: tenure * 4 }, (_, i) => {
    const t = (i + 1) / 4;
    const val = principal * Math.pow(1 + rate / (100 * compFreq), compFreq * t);
    return { label: `Q${i + 1}`, value: Math.round(val) };
  });

  const handleInput = useCallback(
    (setter: (v: number) => void) =>
      (e: React.ChangeEvent<HTMLInputElement>) =>
        setter(Number(e.target.value)),
    []
  );

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="page-title">Fixed Deposit Center</h1>
          <p className="page-subtitle">Compare FD rates and calculate returns</p>
        </div>
        <button className="btn-primary text-sm flex items-center gap-2">
          <Plus size={14} /> Book New FD
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Calculator */}
        <div className="glass-card">
          <h2 className="text-base font-bold mb-5" style={{ color: "hsl(var(--foreground))" }}>
            FD Calculator
          </h2>
          <div className="space-y-6">
            {[
              { label: "Principal Amount", value: principal, min: 1000, max: 10000000, step: 1000, setter: setPrincipal, display: formatINR(principal) },
              { label: "Interest Rate (% p.a.)", value: rate, min: 1, max: 15, step: 0.05, setter: setRate, display: `${rate.toFixed(2)}%` },
              { label: "Tenure (Years)", value: tenure, min: 1, max: 10, step: 1, setter: setTenure, display: `${tenure} yr${tenure > 1 ? "s" : ""}` },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between mb-2">
                  <label className="text-xs font-medium" style={{ color: "hsl(var(--muted-foreground))" }}>
                    {item.label}
                  </label>
                  <span className="text-xs font-bold" style={{ color: "hsl(var(--primary))" }}>
                    {item.display}
                  </span>
                </div>
                <input
                  type="range"
                  className="w-full"
                  min={item.min}
                  max={item.max}
                  step={item.step}
                  value={item.value}
                  onChange={handleInput(item.setter as (v: number) => void)}
                  aria-label={item.label}
                  style={{ accentColor: "hsl(var(--primary))" }}
                />
              </div>
            ))}

            <div>
              <label className="text-xs font-medium mb-2 block" style={{ color: "hsl(var(--muted-foreground))" }}>
                Compounding Frequency
              </label>
              <div className="flex gap-2">
                {[{ l: "Monthly", v: 12 }, { l: "Quarterly", v: 4 }, { l: "Annually", v: 1 }].map((f) => (
                  <button
                    key={f.v}
                    onClick={() => setCompFreq(f.v)}
                    className="flex-1 py-2 rounded-xl text-xs font-medium transition-all"
                    style={{
                      background: compFreq === f.v ? "hsl(var(--primary) / 0.2)" : "hsl(var(--muted))",
                      color: compFreq === f.v ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                      border: compFreq === f.v ? "1px solid hsl(var(--primary) / 0.4)" : "1px solid transparent",
                    }}
                  >
                    {f.l}
                  </button>
                ))}
              </div>
            </div>

            {/* Result */}
            <div
              className="rounded-2xl p-5 space-y-3"
              style={{ background: "hsl(var(--primary) / 0.08)", border: "1px solid hsl(var(--primary) / 0.2)" }}
            >
              <div className="flex justify-between">
                <span className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>Principal</span>
                <span className="text-sm font-semibold" style={{ color: "hsl(var(--foreground))" }}>{formatINR(principal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>Interest Earned</span>
                <span className="text-sm font-semibold" style={{ color: "hsl(var(--gain))" }}>+{formatINR(interest)}</span>
              </div>
              <div
                className="flex justify-between pt-2"
                style={{ borderTop: "1px solid hsl(var(--primary) / 0.2)" }}
              >
                <span className="text-base font-bold" style={{ color: "hsl(var(--foreground))" }}>Maturity Value</span>
                <span className="text-base font-bold" style={{ color: "hsl(var(--primary))" }}>
                  {formatINR(maturityAmt)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Growth chart */}
        <div className="glass-card">
          <InteractiveDataChart
            data={CHART_DATA}
            title="FD Growth Over Time"
            type="area"
            color="hsl(43, 95%, 55%)"
            primaryLabel="FD Value"
            prefix="₹"
            showTimeRanges={false}
            height={300}
          />
          <div className="mt-4 grid grid-cols-2 gap-3">
            {[
              { label: "Effective Yield", value: `${((maturityAmt / principal - 1) * 100).toFixed(2)}%` },
              { label: "Monthly Income", value: formatINR(interest / (tenure * 12)) },
            ].map((s, i) => (
              <div key={i} className="glass-card-sm text-center">
                <p className="text-xl font-bold" style={{ color: "hsl(var(--accent))" }}>{s.value}</p>
                <p className="text-xs mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bank comparison */}
      <div className="glass-card">
        <h2 className="text-base font-bold mb-4" style={{ color: "hsl(var(--foreground))" }}>
          <Building2 size={16} className="inline mr-2" style={{ color: "hsl(var(--primary))" }} />
          FD Rate Comparison
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid hsl(var(--border))" }}>
                {["Bank", "Interest Rate", "Tenure", "Min Amount", "Action"].map((h) => (
                  <th key={h} className="text-left pb-3 text-xs font-semibold" style={{ color: "hsl(var(--muted-foreground))" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {BANKS.map((bank, i) => (
                <tr
                  key={i}
                  className="transition-colors cursor-pointer"
                  style={{ borderBottom: "1px solid hsl(var(--border))" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "hsl(var(--muted) / 0.5)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <td className="py-3 text-sm font-medium" style={{ color: "hsl(var(--foreground))" }}>
                    {bank.name}
                  </td>
                  <td className="py-3">
                    <span className="badge-gain">{bank.rate}% p.a.</span>
                  </td>
                  <td className="py-3 text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
                    {bank.tenure}
                  </td>
                  <td className="py-3 text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
                    {bank.minAmt}
                  </td>
                  <td className="py-3">
                    <button
                      onClick={() => setRate(bank.rate)}
                      className="text-xs px-3 py-1 rounded-lg font-medium transition-all"
                      style={{
                        background: "hsl(var(--primary) / 0.15)",
                        color: "hsl(var(--primary))",
                      }}
                    >
                      Use Rate
                    </button>
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
