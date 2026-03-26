import { TrendingUp, TrendingDown, Star, MoreHorizontal } from "lucide-react";
import { useState } from "react";

export interface AssetData {
  symbol: string;
  name: string;
  price: string;
  change: number;
  volume?: string;
  marketCap?: string;
  icon?: string;
  type?: "stock" | "crypto" | "index" | "commodity";
  sparkline?: number[];
}

interface GlassAssetCardProps {
  asset: AssetData;
  onClick?: (asset: AssetData) => void;
  onFavorite?: (symbol: string) => void;
  variant?: "default" | "compact" | "featured";
  isFavorite?: boolean;
}

function MiniSparkline({ data, positive }: { data: number[]; positive: boolean }) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 80;
  const h = 32;
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      <polyline
        points={pts}
        stroke={positive ? "hsl(158, 64%, 52%)" : "hsl(0, 85%, 60%)"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity={0.8}
      />
    </svg>
  );
}

const TYPE_ICONS: Record<string, string> = {
  stock: "📈",
  crypto: "🪙",
  index: "📊",
  commodity: "🏅",
};

export default function GlassAssetCard({
  asset,
  onClick,
  onFavorite,
  variant = "default",
  isFavorite = false,
}: GlassAssetCardProps) {
  const [hovered, setHovered] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const positive = asset.change >= 0;

  /* onHover tooltip handler */
  const handleMouseEnter = () => {
    setHovered(true);
    setTooltipVisible(true);
  };
  const handleMouseLeave = () => {
    setHovered(false);
    setTooltipVisible(false);
  };

  /* onClick asset switching */
  const handleClick = () => {
    if (onClick) onClick(asset);
  };

  if (variant === "compact") {
    return (
      <div
        className="glass glass-hover rounded-xl p-3 cursor-pointer relative"
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        role="button"
        tabIndex={0}
        aria-label={`${asset.name} at ${asset.price}`}
        onKeyDown={(e) => e.key === "Enter" && handleClick()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">{asset.icon || TYPE_ICONS[asset.type || "stock"]}</span>
            <div>
              <p className="text-xs font-bold" style={{ color: "hsl(var(--foreground))" }}>
                {asset.symbol}
              </p>
              <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                {asset.name.length > 14 ? asset.name.slice(0, 14) + "…" : asset.name}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold" style={{ color: "hsl(var(--foreground))" }}>
              {asset.price}
            </p>
            <span className={positive ? "badge-gain" : "badge-loss"}>
              {positive ? "+" : ""}
              {asset.change.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`glass glass-hover rounded-2xl p-5 cursor-pointer relative overflow-hidden transition-all duration-300 ${
        hovered ? "shadow-glass-lg" : ""
      }`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="button"
      tabIndex={0}
      aria-label={`${asset.name} asset card`}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
    >
      {/* Background glow on hover */}
      <div
        className="absolute inset-0 rounded-2xl transition-opacity duration-300 pointer-events-none"
        style={{
          opacity: hovered ? 0.08 : 0,
          background: positive
            ? "radial-gradient(ellipse at 80% 0%, hsl(158 64% 52%), transparent)"
            : "radial-gradient(ellipse at 80% 0%, hsl(0 85% 60%), transparent)",
        }}
      />

      <div className="relative z-10">
        {/* Top row */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{ background: "hsl(var(--muted))" }}
            >
              {asset.icon || TYPE_ICONS[asset.type || "stock"]}
            </div>
            <div>
              <p className="font-bold text-sm" style={{ color: "hsl(var(--foreground))" }}>
                {asset.symbol}
              </p>
              <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                {asset.name}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFavorite?.(asset.symbol);
              }}
              className="p-1 rounded-lg transition-colors"
              style={{ color: isFavorite ? "hsl(var(--accent))" : "hsl(var(--muted-foreground))" }}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Star size={14} fill={isFavorite ? "currentColor" : "none"} />
            </button>
            <button
              className="p-1 rounded-lg"
              style={{ color: "hsl(var(--muted-foreground))" }}
              aria-label="More options"
            >
              <MoreHorizontal size={14} />
            </button>
          </div>
        </div>

        {/* Price row */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-2xl font-bold" style={{ color: "hsl(var(--foreground))" }}>
              {asset.price}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className={positive ? "badge-gain" : "badge-loss"}>
                {positive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                {positive ? "+" : ""}
                {asset.change.toFixed(2)}%
              </span>
              {asset.volume && (
                <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                  Vol: {asset.volume}
                </span>
              )}
            </div>
          </div>

          {/* Sparkline */}
          {asset.sparkline && (
            <MiniSparkline data={asset.sparkline} positive={positive} />
          )}
        </div>

        {/* Market cap */}
        {asset.marketCap && (
          <div
            className="mt-3 pt-3 text-xs"
            style={{
              borderTop: "1px solid hsl(var(--glass-border))",
              color: "hsl(var(--muted-foreground))",
            }}
          >
            Mkt Cap: <span className="font-medium" style={{ color: "hsl(var(--foreground))" }}>{asset.marketCap}</span>
          </div>
        )}

        {/* Hover tooltip */}
        {tooltipVisible && asset.volume && (
          <div
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 glass rounded-xl px-3 py-2 text-xs z-20 pointer-events-none whitespace-nowrap animate-fade-in"
          >
            <p className="font-semibold" style={{ color: "hsl(var(--primary))" }}>
              {asset.name}
            </p>
            <p style={{ color: "hsl(var(--muted-foreground))" }}>
              24h Volume: {asset.volume}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
