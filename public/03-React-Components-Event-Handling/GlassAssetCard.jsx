/* ================================================
   React Component: GlassAssetCard
   Event Handlers: onClick (asset switching),
                   onHover (tooltip display)
   ================================================ */

import React, { useState } from "react";

// Asset data structure
function GlassAssetCard({ asset, onClick, onFavorite, isFavorite }) {
    // State for hover tooltip
    var [hovered, setHovered] = useState(false);
    var [tooltipVisible, setTooltipVisible] = useState(false);

    var positive = asset.change >= 0;

    // onHover event handler - shows tooltip with volume info
    function handleMouseEnter() {
        setHovered(true);
        setTooltipVisible(true);
    }

    function handleMouseLeave() {
        setHovered(false);
        setTooltipVisible(false);
    }

    // onClick event handler - switches selected asset
    function handleClick() {
        if (onClick) {
            onClick(asset);
        }
    }

    // Mini sparkline SVG component
    function renderSparkline() {
        if (!asset.sparkline || asset.sparkline.length < 2) return null;

        var min = Math.min.apply(null, asset.sparkline);
        var max = Math.max.apply(null, asset.sparkline);
        var range = max - min || 1;
        var w = 80, h = 32;

        var points = asset.sparkline.map(function(v, i) {
            var x = (i / (asset.sparkline.length - 1)) * w;
            var y = h - ((v - min) / range) * h;
            return x + "," + y;
        }).join(" ");

        var color = positive ? "#4ade80" : "#f87171";

        return React.createElement("svg", { width: w, height: h },
            React.createElement("polyline", {
                points: points,
                stroke: color,
                strokeWidth: "1.5",
                fill: "none",
                opacity: 0.8
            })
        );
    }

    return React.createElement("div", {
        className: "glass-card",
        style: { cursor: "pointer", position: "relative" },
        onClick: handleClick,
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave
    },
        // Icon and name
        React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" } },
            React.createElement("span", { style: { fontSize: "28px" } }, asset.icon),
            React.createElement("div", null,
                React.createElement("p", { style: { fontWeight: 700 } }, asset.symbol),
                React.createElement("p", { style: { color: "var(--text-muted)", fontSize: "12px" } }, asset.name)
            ),
            // Favorite button (onClick handler)
            React.createElement("button", {
                style: { marginLeft: "auto", color: isFavorite ? "var(--gold)" : "var(--text-muted)", background: "none", border: "none", cursor: "pointer", fontSize: "16px" },
                onClick: function(e) { e.stopPropagation(); if (onFavorite) onFavorite(asset.symbol); }
            }, isFavorite ? "★" : "☆")
        ),

        // Price
        React.createElement("p", { style: { fontSize: "22px", fontWeight: 700, marginBottom: "8px" } }, asset.price),

        // Change badge and sparkline
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-end" } },
            React.createElement("span", {
                className: positive ? "badge-gain" : "badge-loss"
            }, (positive ? "+" : "") + asset.change.toFixed(2) + "%"),
            renderSparkline()
        ),

        // onHover tooltip
        tooltipVisible && asset.volume ? React.createElement("div", {
            style: {
                position: "absolute", bottom: "100%", left: "50%", transform: "translateX(-50%)",
                background: "var(--glass-bg)", backdropFilter: "blur(16px)",
                border: "1px solid var(--glass-border)", borderRadius: "12px",
                padding: "8px 12px", fontSize: "12px", whiteSpace: "nowrap", zIndex: 20,
                marginBottom: "8px"
            }
        },
            React.createElement("p", { style: { fontWeight: 600, color: "var(--accent)" } }, asset.name),
            React.createElement("p", { style: { color: "var(--text-muted)" } }, "24h Volume: " + asset.volume)
        ) : null
    );
}

export default GlassAssetCard;
