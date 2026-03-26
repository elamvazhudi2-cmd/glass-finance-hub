import { useState, useCallback } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";

type ChartType = "area" | "bar" | "line";
type TimeRange = "1D" | "1W" | "1M" | "3M" | "1Y" | "ALL";

interface DataPoint {
  label: string;
  value: number;
  secondary?: number;
}

interface InteractiveDataChartProps {
  data: DataPoint[];
  title?: string;
  type?: ChartType;
  color?: string;
  secondaryColor?: string;
  secondaryLabel?: string;
  primaryLabel?: string;
  showTimeRanges?: boolean;
  height?: number;
  prefix?: string;
  suffix?: string;
}

function GlassTooltip({
  active,
  payload,
  label,
  prefix = "",
  suffix = "",
  primaryLabel = "Value",
  secondaryLabel = "Secondary",
}: TooltipProps<number, string> & {
  prefix?: string;
  suffix?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div
      className="glass rounded-xl px-4 py-3 shadow-glass text-sm"
      style={{ border: "1px solid hsl(var(--glass-border))" }}
    >
      <p
        className="text-xs mb-2 font-medium"
        style={{ color: "hsl(var(--muted-foreground))" }}
      >
        {label}
      </p>
      {payload.map((p, i) => (
        <p key={i} className="font-bold" style={{ color: p.color }}>
          {i === 0 ? primaryLabel : secondaryLabel}:{" "}
          {prefix}
          {typeof p.value === "number" ? p.value.toLocaleString() : p.value}
          {suffix}
        </p>
      ))}
    </div>
  );
}

const TIME_RANGES: TimeRange[] = ["1D", "1W", "1M", "3M", "1Y", "ALL"];

export default function InteractiveDataChart({
  data,
  title,
  type = "area",
  color = "hsl(199, 89%, 52%)",
  secondaryColor = "hsl(258, 85%, 62%)",
  secondaryLabel = "Secondary",
  primaryLabel = "Value",
  showTimeRanges = true,
  height = 240,
  prefix = "",
  suffix = "",
}: InteractiveDataChartProps) {
  const [activeRange, setActiveRange] = useState<TimeRange>("1M");
  const [chartType, setChartType] = useState<ChartType>(type);

  /* onHover chart tooltips — handled by recharts via custom tooltip component */

  const filterData = useCallback(
    (range: TimeRange): DataPoint[] => {
      const slices: Record<TimeRange, number> = {
        "1D": 24,
        "1W": 7,
        "1M": 30,
        "3M": 90,
        "1Y": 365,
        ALL: data.length,
      };
      const n = slices[range];
      return data.slice(-Math.min(n, data.length));
    },
    [data]
  );

  const displayData = filterData(activeRange);

  const gradientId = `chart-gradient-${Math.random().toString(36).slice(2, 8)}`;

  const renderChart = () => {
    const commonProps = {
      data: displayData,
      margin: { top: 4, right: 4, left: -20, bottom: 0 },
    };

    const axisStyle = {
      tick: { fill: "hsl(215, 20%, 45%)", fontSize: 11 },
      axisLine: false,
      tickLine: false,
    };

    if (chartType === "bar") {
      return (
        <BarChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 25%, 15%)" vertical={false} />
          <XAxis dataKey="label" {...axisStyle} />
          <YAxis {...axisStyle} />
          <Tooltip
            content={
              <GlassTooltip
                prefix={prefix}
                suffix={suffix}
                primaryLabel={primaryLabel}
                secondaryLabel={secondaryLabel}
              />
            }
          />
          <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} />
          {displayData[0]?.secondary !== undefined && (
            <Bar dataKey="secondary" fill={secondaryColor} radius={[4, 4, 0, 0]} />
          )}
        </BarChart>
      );
    }

    if (chartType === "line") {
      return (
        <LineChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 25%, 15%)" vertical={false} />
          <XAxis dataKey="label" {...axisStyle} />
          <YAxis {...axisStyle} />
          <Tooltip
            content={
              <GlassTooltip
                prefix={prefix}
                suffix={suffix}
                primaryLabel={primaryLabel}
                secondaryLabel={secondaryLabel}
              />
            }
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: color }}
          />
          {displayData[0]?.secondary !== undefined && (
            <Line
              type="monotone"
              dataKey="secondary"
              stroke={secondaryColor}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: secondaryColor }}
            />
          )}
        </LineChart>
      );
    }

    // area (default)
    return (
      <AreaChart {...commonProps}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.25} />
            <stop offset="95%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 25%, 15%)" vertical={false} />
        <XAxis dataKey="label" {...axisStyle} />
        <YAxis {...axisStyle} />
        <Tooltip
          content={
            <GlassTooltip
              prefix={prefix}
              suffix={suffix}
              primaryLabel={primaryLabel}
              secondaryLabel={secondaryLabel}
            />
          }
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          fill={`url(#${gradientId})`}
          activeDot={{ r: 5, fill: color, stroke: "hsl(220, 30%, 8%)", strokeWidth: 2 }}
        />
        {displayData[0]?.secondary !== undefined && (
          <Area
            type="monotone"
            dataKey="secondary"
            stroke={secondaryColor}
            strokeWidth={2}
            fill="none"
            activeDot={{ r: 4, fill: secondaryColor }}
          />
        )}
      </AreaChart>
    );
  };

  return (
    <div className="w-full">
      {/* Header */}
      {(title || showTimeRanges) && (
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          {title && (
            <p className="text-sm font-semibold" style={{ color: "hsl(var(--foreground))" }}>
              {title}
            </p>
          )}
          <div className="flex items-center gap-2">
            {/* Chart type selector */}
            <div
              className="flex rounded-lg p-0.5 gap-0.5"
              style={{ background: "hsl(var(--muted))" }}
            >
              {(["area", "line", "bar"] as ChartType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setChartType(t)}
                  className="px-2 py-1 rounded-md text-xs font-medium capitalize transition-all"
                  style={{
                    background:
                      chartType === t ? "hsl(var(--glass-bg))" : "transparent",
                    color:
                      chartType === t
                        ? "hsl(var(--foreground))"
                        : "hsl(var(--muted-foreground))",
                  }}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Time range selector */}
            {showTimeRanges && (
              <div
                className="flex rounded-lg p-0.5 gap-0.5"
                style={{ background: "hsl(var(--muted))" }}
              >
                {TIME_RANGES.map((r) => (
                  <button
                    key={r}
                    onClick={() => setActiveRange(r)}
                    className="px-2.5 py-1 rounded-md text-xs font-medium transition-all"
                    style={{
                      background:
                        activeRange === r
                          ? "hsl(var(--primary) / 0.2)"
                          : "transparent",
                      color:
                        activeRange === r
                          ? "hsl(var(--primary))"
                          : "hsl(var(--muted-foreground))",
                    }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <ResponsiveContainer width="100%" height={height}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
}
