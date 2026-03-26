import { useState } from "react";
import { HeadphonesIcon, Send, MessageCircle, Phone, Mail, CheckCircle } from "lucide-react";

const FAQS = [
  { q: "How do I add a new holding to my portfolio?", a: "Navigate to Portfolio Manager → click 'Add Holding' → enter symbol, quantity, and average price." },
  { q: "Is the crypto data real-time?", a: "Crypto prices are fetched from CoinGecko API with ~60 second refresh intervals. Connect your API key in Settings for live data." },
  { q: "How is my tax liability calculated?", a: "We use official CBDT tax slabs for FY 2024-25. The calculation is an estimate — please consult a CA for filing." },
  { q: "Can I export my portfolio data?", a: "Yes! Go to Portfolio Manager → click the Export button in the top right to download a CSV/PDF report." },
];

export default function Support() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);

  /* onSubmit investment lead form */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSubmitted(true);
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "hsl(199 89% 52% / 0.15)" }}>
            <HeadphonesIcon size={20} style={{ color: "hsl(var(--primary))" }} />
          </div>
          <div>
            <h1 className="page-title">Support & Contact</h1>
            <p className="page-subtitle">We're here to help · Avg response time: 2 hours</p>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {[
          { icon: <MessageCircle size={18} />, label: "Live Chat", value: "Available 9am–9pm IST", color: "hsl(var(--primary))" },
          { icon: <Phone size={18} />, label: "Phone Support", value: "+91 1800-123-4567", color: "hsl(var(--gain))" },
          { icon: <Mail size={18} />, label: "Email Support", value: "support@finanalyst.io", color: "hsl(var(--accent))" },
        ].map((c, i) => (
          <div key={i} className="glass-card flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${c.color}20`, color: c.color }}>{c.icon}</div>
            <div>
              <p className="text-sm font-bold" style={{ color: "hsl(var(--foreground))" }}>{c.label}</p>
              <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{c.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card">
          <h2 className="text-base font-bold mb-5" style={{ color: "hsl(var(--foreground))" }}>Send a Message</h2>
          {submitted ? (
            <div className="text-center py-10">
              <CheckCircle size={48} className="mx-auto mb-3" style={{ color: "hsl(var(--gain))" }} />
              <p className="font-bold" style={{ color: "hsl(var(--foreground))" }}>Message Sent!</p>
              <p className="text-sm mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>We'll get back to you within 2 hours.</p>
              <button onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                className="btn-ghost text-sm mt-4">Send Another</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { key: "name", label: "Full Name", type: "text", placeholder: "John Patel" },
                { key: "email", label: "Email Address", type: "email", placeholder: "john@example.com" },
                { key: "subject", label: "Subject", type: "text", placeholder: "Portfolio sync issue..." },
              ].map((f) => (
                <div key={f.key}>
                  <label className="text-xs font-medium block mb-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>{f.label}</label>
                  <input
                    type={f.type} placeholder={f.placeholder}
                    value={form[f.key as keyof typeof form]}
                    onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full glass rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
                    style={{ color: "hsl(var(--foreground))", background: "transparent" }}
                    required={f.key !== "subject"}
                  />
                </div>
              ))}
              <div>
                <label className="text-xs font-medium block mb-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>Message</label>
                <textarea rows={4} placeholder="Describe your issue or question…"
                  value={form.message}
                  onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                  className="w-full glass rounded-xl px-4 py-2.5 text-sm outline-none resize-none transition-all"
                  style={{ color: "hsl(var(--foreground))", background: "transparent" }}
                  required
                />
              </div>
              <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                <Send size={14} /> Send Message
              </button>
            </form>
          )}
        </div>

        <div className="glass-card">
          <h2 className="text-base font-bold mb-5" style={{ color: "hsl(var(--foreground))" }}>Frequently Asked Questions</h2>
          <div className="space-y-2">
            {FAQS.map((faq, i) => (
              <div key={i} className="rounded-xl overflow-hidden" style={{ background: "hsl(var(--muted) / 0.4)" }}>
                <button className="w-full text-left px-4 py-3 flex items-center justify-between gap-3"
                  onClick={() => setExpanded(expanded === i ? null : i)}>
                  <span className="text-sm font-medium" style={{ color: "hsl(var(--foreground))" }}>{faq.q}</span>
                  <span className="text-lg flex-shrink-0" style={{ color: "hsl(var(--primary))" }}>{expanded === i ? "−" : "+"}</span>
                </button>
                {expanded === i && (
                  <div className="px-4 pb-3 text-sm" style={{ color: "hsl(var(--muted-foreground))", borderTop: "1px solid hsl(var(--border))" }}>
                    <p className="pt-3">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
