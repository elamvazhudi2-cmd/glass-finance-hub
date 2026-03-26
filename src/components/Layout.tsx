import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, TrendingUp, Bitcoin, Building2, Gem,
  Calculator, Briefcase, Newspaper, Globe, FileText,
  GraduationCap, HeadphonesIcon, User, PiggyBank, Menu, X,
  Bell, Settings, ChevronRight,
} from "lucide-react";
import MarketTicker from "./MarketTicker";

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", path: "/", icon: <LayoutDashboard size={16} /> },
  { label: "Stock Market", path: "/stocks", icon: <TrendingUp size={16} /> },
  { label: "Crypto Explorer", path: "/crypto", icon: <Bitcoin size={16} /> },
  { label: "FD Center", path: "/fd-center", icon: <Building2 size={16} /> },
  { label: "Digital Assets", path: "/nft", icon: <Gem size={16} /> },
  { label: "Calculator", path: "/calculator", icon: <Calculator size={16} /> },
  { label: "Portfolio", path: "/portfolio", icon: <Briefcase size={16} /> },
  { label: "Market News", path: "/news", icon: <Newspaper size={16} />, badge: "NEW" },
  { label: "Global Indices", path: "/indices", icon: <Globe size={16} /> },
  { label: "Tax Planner", path: "/tax", icon: <FileText size={16} /> },
  { label: "Retirement", path: "/retirement", icon: <PiggyBank size={16} /> },
  { label: "Education", path: "/education", icon: <GraduationCap size={16} /> },
  { label: "Support", path: "/support", icon: <HeadphonesIcon size={16} /> },
  { label: "Profile", path: "/profile", icon: <User size={16} /> },
];

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <div className="flex min-h-screen" style={{ background: "hsl(var(--background))" }}>
      {/* ── Sidebar ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-64 -translate-x-full lg:translate-x-0 lg:w-64"
        }`}
        style={{
          background: "hsl(var(--sidebar-background))",
          borderRight: "1px solid hsl(var(--sidebar-border))",
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-3 px-5 py-5"
          style={{ borderBottom: "1px solid hsl(var(--sidebar-border))" }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
            style={{
              background: "var(--gradient-primary)",
              color: "hsl(var(--primary-foreground))",
            }}
          >
            FI
          </div>
          <div>
            <p
              className="text-sm font-bold font-display"
              style={{ color: "hsl(var(--sidebar-foreground))" }}
            >
              FinAnalyst Hub
            </p>
            <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
              Investment Platform
            </p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto lg:hidden p-1 rounded"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                  active ? "nav-item-active" : ""
                }`}
                style={{
                  color: active
                    ? "hsl(var(--primary))"
                    : "hsl(var(--sidebar-foreground))",
                  background: active
                    ? "hsl(199 89% 52% / 0.10)"
                    : "transparent",
                }}
                onMouseEnter={(e) => {
                  if (!active)
                    (e.currentTarget as HTMLElement).style.background =
                      "hsl(var(--sidebar-accent))";
                }}
                onMouseLeave={(e) => {
                  if (!active)
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                }}
              >
                <span
                  className="flex-shrink-0"
                  style={{
                    color: active
                      ? "hsl(var(--primary))"
                      : "hsl(var(--muted-foreground))",
                  }}
                >
                  {item.icon}
                </span>
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span
                    className="text-xs px-1.5 py-0.5 rounded-full font-bold"
                    style={{
                      background: "hsl(199 89% 52% / 0.15)",
                      color: "hsl(var(--primary))",
                    }}
                  >
                    {item.badge}
                  </span>
                )}
                {active && (
                  <ChevronRight
                    size={12}
                    style={{ color: "hsl(var(--primary))" }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div
          className="p-4"
          style={{ borderTop: "1px solid hsl(var(--sidebar-border))" }}
        >
          <Link
            to="/profile"
            className="flex items-center gap-3 p-2 rounded-xl transition-all"
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.background =
                "hsl(var(--sidebar-accent))")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.background = "transparent")
            }
          >
            <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: "var(--gradient-primary)" }}
            >
              AR
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-medium truncate"
                style={{ color: "hsl(var(--sidebar-foreground))" }}
              >
                Ashwin Raaj
              </p>
              <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                Pro Investor
              </p>
            </div>
            <Settings size={14} style={{ color: "hsl(var(--muted-foreground))" }} />
          </Link>
        </div>
      </aside>

      {/* Overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 lg:hidden"
          style={{ background: "hsl(0 0% 0% / 0.5)" }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col lg:ml-64 min-w-0">
        {/* Top bar */}
        <header
          className="sticky top-0 z-20 flex items-center gap-4 px-4 py-3"
          style={{
            background: "hsl(var(--background) / 0.85)",
            backdropFilter: "blur(16px)",
            borderBottom: "1px solid hsl(var(--border))",
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg"
            style={{ background: "hsl(var(--muted))", color: "hsl(var(--foreground))" }}
            aria-label="Open sidebar"
          >
            <Menu size={18} />
          </button>

          <div className="flex-1" />

          {/* Live dot */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-medium" style={{ color: "hsl(var(--gain))" }}>
            <span className="w-2 h-2 rounded-full bg-gain pulse-dot" />
            Markets Live
          </div>

          <button
            className="p-2 rounded-xl relative"
            style={{ background: "hsl(var(--muted))", color: "hsl(var(--foreground))" }}
            aria-label="Notifications"
          >
            <Bell size={16} />
            <span
              className="absolute top-1 right-1 w-2 h-2 rounded-full"
              style={{ background: "hsl(var(--primary))" }}
            />
          </button>
        </header>

        {/* Ticker */}
        <MarketTicker />

        {/* Page content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
