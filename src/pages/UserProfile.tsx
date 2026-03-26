import { useState } from "react";
import { User, Edit3, Bell, Shield, TrendingUp, Award } from "lucide-react";

const ACHIEVEMENTS = [
  { icon: "🥇", label: "First Investment", earned: true },
  { icon: "📊", label: "Portfolio Pro", earned: true },
  { icon: "🎯", label: "Goal Setter", earned: true },
  { icon: "📚", label: "Market Scholar", earned: false },
  { icon: "💎", label: "Diamond Hands", earned: false },
  { icon: "🚀", label: "10x Returns", earned: false },
];

export default function UserProfile() {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("John Patel");
  const [email, setEmail] = useState("john.patel@example.com");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [notifications, setNotifications] = useState({ price: true, news: true, portfolio: false });

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">User Profile</h1>
        <p className="page-subtitle">Manage your account, preferences & security</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <div className="glass-card text-center">
            <div className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl font-bold"
              style={{ background: "var(--gradient-primary)" }}>JP</div>
            <h2 className="text-lg font-bold" style={{ color: "hsl(var(--foreground))" }}>{name}</h2>
            <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>{email}</p>
            <span className="badge-gain mt-2 inline-flex">✦ Pro Investor</span>
            <div className="grid grid-cols-3 gap-3 mt-4 pt-4" style={{ borderTop: "1px solid hsl(var(--border))" }}>
              {[{ label: "Holdings", value: "24" }, { label: "Watchlist", value: "12" }, { label: "Alerts", value: "7" }].map((s, i) => (
                <div key={i} className="text-center">
                  <p className="text-lg font-bold" style={{ color: "hsl(var(--foreground))" }}>{s.value}</p>
                  <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card">
            <h3 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: "hsl(var(--foreground))" }}>
              <Award size={14} style={{ color: "hsl(var(--accent))" }} /> Achievements
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {ACHIEVEMENTS.map((a, i) => (
                <div key={i} className="text-center p-2 rounded-xl" style={{ opacity: a.earned ? 1 : 0.4, background: "hsl(var(--muted) / 0.4)" }}>
                  <div className="text-xl mb-1">{a.icon}</div>
                  <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{a.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="glass-card">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold flex items-center gap-2" style={{ color: "hsl(var(--foreground))" }}>
                <User size={16} style={{ color: "hsl(var(--primary))" }} /> Personal Information
              </h3>
              <button onClick={() => setEditing((p) => !p)} className="btn-ghost text-sm flex items-center gap-2">
                <Edit3 size={13} /> {editing ? "Cancel" : "Edit"}
              </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { label: "Full Name", value: name, setter: setName },
                { label: "Email Address", value: email, setter: setEmail },
                { label: "Phone Number", value: phone, setter: setPhone },
                { label: "PAN Card", value: "ABCDE1234F", setter: () => {} },
              ].map((f, i) => (
                <div key={i}>
                  <label className="text-xs font-medium block mb-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>{f.label}</label>
                  {editing && f.setter !== (() => {}) ? (
                    <input className="w-full glass rounded-xl px-4 py-2.5 text-sm outline-none"
                      value={f.value} onChange={(e) => f.setter(e.target.value)}
                      style={{ color: "hsl(var(--foreground))", background: "transparent" }} />
                  ) : (
                    <p className="text-sm font-medium px-4 py-2.5 rounded-xl" style={{ background: "hsl(var(--muted) / 0.4)", color: "hsl(var(--foreground))" }}>
                      {f.value}
                    </p>
                  )}
                </div>
              ))}
            </div>
            {editing && (
              <button className="btn-primary mt-4 text-sm" onClick={() => setEditing(false)}>
                Save Changes
              </button>
            )}
          </div>

          <div className="glass-card">
            <h3 className="text-base font-bold mb-4 flex items-center gap-2" style={{ color: "hsl(var(--foreground))" }}>
              <Bell size={16} style={{ color: "hsl(var(--accent))" }} /> Notification Preferences
            </h3>
            {[
              { key: "price", label: "Price Alerts", desc: "Get notified when your stocks hit target prices" },
              { key: "news", label: "Market News", desc: "Breaking financial news and market updates" },
              { key: "portfolio", label: "Portfolio Updates", desc: "Daily/weekly portfolio performance summary" },
            ].map((n) => (
              <div key={n.key} className="flex items-center justify-between py-3" style={{ borderBottom: "1px solid hsl(var(--border))" }}>
                <div>
                  <p className="text-sm font-medium" style={{ color: "hsl(var(--foreground))" }}>{n.label}</p>
                  <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{n.desc}</p>
                </div>
                <button
                  onClick={() => setNotifications((p) => ({ ...p, [n.key]: !p[n.key as keyof typeof p] }))}
                  className="w-11 h-6 rounded-full transition-all relative flex-shrink-0"
                  style={{ background: notifications[n.key as keyof typeof notifications] ? "hsl(var(--primary))" : "hsl(var(--muted))" }}
                  aria-label={`Toggle ${n.label}`}
                >
                  <span className="w-4 h-4 rounded-full absolute top-1 transition-all"
                    style={{ left: notifications[n.key as keyof typeof notifications] ? "calc(100% - 20px)" : "4px", background: "white" }} />
                </button>
              </div>
            ))}
          </div>

          <div className="glass-card">
            <h3 className="text-base font-bold mb-4 flex items-center gap-2" style={{ color: "hsl(var(--foreground))" }}>
              <Shield size={16} style={{ color: "hsl(var(--gain))" }} /> Security
            </h3>
            <div className="space-y-3">
              {[
                { label: "Two-Factor Authentication", status: "Enabled", positive: true },
                { label: "Last Login", status: "Today, 9:42 AM · Mumbai, IN", positive: true },
                { label: "Password Strength", status: "Strong", positive: true },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: "hsl(var(--foreground))" }}>{s.label}</span>
                  <span className={s.positive ? "badge-gain" : "badge-loss"}>{s.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
