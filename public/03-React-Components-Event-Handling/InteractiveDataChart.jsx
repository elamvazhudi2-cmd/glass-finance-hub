/* ================================================
   React Component: InteractiveDataChart
   Event Handlers: onHover (chart tooltips via Recharts)
   Library: Recharts (React charting library)
   ================================================ */

import React, { useState } from "react";
import {
    AreaChart, Area, BarChart, Bar, LineChart, Line,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

// Custom glass-style tooltip component
function GlassTooltip({ active, payload, label, prefix, primaryLabel }) {
    if (!active || !payload || !payload.length) return null;

    // This renders on hover over chart data points
    return React.createElement("div", {
        style: {
            background: "rgba(255,255,255,0.05)", backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px",
            padding: "12px 16px", fontSize: "13px"
        }
    },
        React.createElement("p", { style: { color: "var(--text-muted)", marginBottom: "4px", fontSize: "12px" } }, label),
        payload.map(function(p, i) {
            return React.createElement("p", { key: i, style: { fontWeight: 700, color: p.color } },
                (i === 0 ? primaryLabel : "Secondary") + ": " + prefix + p.value.toLocaleString()
            );
        })
    );
}

function InteractiveDataChart({ data, title, type, color, secondaryColor, primaryLabel, prefix, height }) {
    // State for chart type switching (onClick handler)
    var [chartType, setChartType] = useState(type || "area");

    // Render different chart types based on user selection
    function renderChart() {
        var axisStyle = { tick: { fill: "#475569", fontSize: 11 }, axisLine: false, tickLine: false };

        if (chartType === "bar") {
            return React.createElement(BarChart, { data: data },
                React.createElement(CartesianGrid, { strokeDasharray: "3 3", stroke: "#1e293b", vertical: false }),
                React.createElement(XAxis, { dataKey: "label", ...axisStyle }),
                React.createElement(YAxis, axisStyle),
                React.createElement(Tooltip, { content: React.createElement(GlassTooltip, { prefix: prefix, primaryLabel: primaryLabel }) }),
                React.createElement(Bar, { dataKey: "value", fill: color, radius: [4,4,0,0] })
            );
        }

        if (chartType === "line") {
            return React.createElement(LineChart, { data: data },
                React.createElement(CartesianGrid, { strokeDasharray: "3 3", stroke: "#1e293b", vertical: false }),
                React.createElement(XAxis, { dataKey: "label", ...axisStyle }),
                React.createElement(YAxis, axisStyle),
                React.createElement(Tooltip, { content: React.createElement(GlassTooltip, { prefix: prefix, primaryLabel: primaryLabel }) }),
                React.createElement(Line, { type: "monotone", dataKey: "value", stroke: color, strokeWidth: 2, dot: false })
            );
        }

        // Default: Area chart
        return React.createElement(AreaChart, { data: data },
            React.createElement(CartesianGrid, { strokeDasharray: "3 3", stroke: "#1e293b", vertical: false }),
            React.createElement(XAxis, { dataKey: "label", ...axisStyle }),
            React.createElement(YAxis, axisStyle),
            React.createElement(Tooltip, { content: React.createElement(GlassTooltip, { prefix: prefix, primaryLabel: primaryLabel }) }),
            React.createElement(Area, { type: "monotone", dataKey: "value", stroke: color, fill: color, fillOpacity: 0.1, strokeWidth: 2 })
        );
    }

    return React.createElement("div", null,
        // Header with chart type toggle (onClick handlers)
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" } },
            title ? React.createElement("p", { style: { fontWeight: 600, fontSize: "14px" } }, title) : null,
            React.createElement("div", { style: { display: "flex", gap: "4px", background: "var(--bg-card)", borderRadius: "8px", padding: "2px" } },
                ["area", "line", "bar"].map(function(t) {
                    return React.createElement("button", {
                        key: t,
                        onClick: function() { setChartType(t); },
                        style: {
                            padding: "4px 8px", borderRadius: "6px", fontSize: "12px",
                            background: chartType === t ? "var(--glass-bg)" : "transparent",
                            color: chartType === t ? "var(--text-primary)" : "var(--text-muted)",
                            border: "none", cursor: "pointer", textTransform: "capitalize"
                        }
                    }, t);
                })
            )
        ),
        // Chart container
        React.createElement(ResponsiveContainer, { width: "100%", height: height || 240 },
            renderChart()
        )
    );
}

export default InteractiveDataChart;
