/* ================================================
   React Component: MarketTicker
   Purpose: Scrolling market data ticker bar
   Animation: CSS keyframe ticker-scroll
   ================================================ */

import React from "react";

// Default ticker data
var DEFAULT_ITEMS = [
    { symbol: "AAPL", price: "₹15,800", change: 1.24 },
    { symbol: "MSFT", price: "₹34,652", change: -0.38 },
    { symbol: "GOOGL", price: "₹14,642", change: 2.11 },
    { symbol: "TSLA", price: "₹20,737", change: -1.92 },
    { symbol: "BTC", price: "₹56,27,317", change: 2.34 },
    { symbol: "ETH", price: "₹3,20,718", change: 1.78 },
    { symbol: "NIFTY50", price: "22,531", change: 0.45 },
    { symbol: "SENSEX", price: "74,119", change: 0.52 },
    { symbol: "GOLD", price: "₹2,341/oz", change: 0.21 },
    { symbol: "RELIANCE", price: "₹2,948", change: 1.13 },
    { symbol: "USD/INR", price: "₹83.47", change: -0.08 }
];

function MarketTicker({ items }) {
    var tickerItems = items || DEFAULT_ITEMS;

    // Double the items for seamless infinite scroll
    var doubled = tickerItems.concat(tickerItems);

    return React.createElement("div", {
        style: {
            overflow: "hidden",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.03)"
        }
    },
        React.createElement("div", {
            className: "ticker-content",
            style: { padding: "8px 16px" }
        },
            doubled.map(function(item, i) {
                var changeColor = item.change >= 0 ? "#4ade80" : "#f87171";
                var sign = item.change >= 0 ? "+" : "";
                var arrow = item.change >= 0 ? "▲" : "▼";

                return React.createElement("span", {
                    key: item.symbol + "-" + i,
                    style: {
                        display: "inline-flex", alignItems: "center",
                        gap: "8px", marginRight: "40px", fontSize: "13px"
                    }
                },
                    React.createElement("span", { style: { color: "#64748b", fontFamily: "monospace", fontSize: "11px" } }, item.symbol),
                    React.createElement("span", { style: { fontWeight: 600 } }, item.price),
                    React.createElement("span", { style: { color: changeColor, fontSize: "12px", fontWeight: 600 } },
                        arrow + " " + sign + item.change.toFixed(2) + "%"
                    ),
                    React.createElement("span", { style: { marginLeft: "16px", opacity: 0.2, color: "#64748b" } }, "|")
                );
            })
        )
    );
}

export default MarketTicker;
