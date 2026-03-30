/* ==============================================
   Navigation & Shared Functionality
   Author: Ashwin Raaj
   ============================================== */

// Navigation items - maps page names to their files
var navItems = [
    { label: "Dashboard", file: "index.html", icon: "📊" },
    { label: "Stock Market", file: "stocks.html", icon: "📈" },
    { label: "Crypto Explorer", file: "crypto.html", icon: "₿" },
    { label: "FD Center", file: "fd-center.html", icon: "🏦" },
    { label: "Digital Assets", file: "nft.html", icon: "💎" },
    { label: "Calculator", file: "calculator.html", icon: "🧮" },
    { label: "Portfolio", file: "portfolio.html", icon: "💼" },
    { label: "Market News", file: "news.html", icon: "📰" },
    { label: "Global Indices", file: "indices.html", icon: "🌐" },
    { label: "Tax Planner", file: "tax.html", icon: "📋" },
    { label: "Retirement", file: "retirement.html", icon: "🏖️" },
    { label: "Education", file: "education.html", icon: "🎓" },
    { label: "Support", file: "support.html", icon: "🎧" },
    { label: "Profile", file: "profile.html", icon: "👤" }
];

// Ticker data for the market ticker bar
var tickerData = [
    { symbol: "AAPL", price: "₹15,800", change: 1.24 },
    { symbol: "TSLA", price: "₹20,737", change: -1.92 },
    { symbol: "BTC", price: "₹56,27,317", change: 2.34 },
    { symbol: "ETH", price: "₹3,20,718", change: 1.78 },
    { symbol: "NIFTY50", price: "22,531", change: 0.45 },
    { symbol: "SENSEX", price: "74,119", change: 0.52 },
    { symbol: "GOLD", price: "₹2,341/oz", change: 0.21 },
    { symbol: "RELIANCE", price: "₹2,948", change: 1.13 },
    { symbol: "TCS", price: "₹3,851", change: -0.29 }
];

// Build the sidebar navigation
function buildSidebar() {
    var currentPage = window.location.pathname.split("/").pop() || "index.html";
    var navContainer = document.getElementById("sidebar-nav");
    if (!navContainer) return;

    var html = "";
    for (var i = 0; i < navItems.length; i++) {
        var item = navItems[i];
        var isActive = (currentPage === item.file) ? " active" : "";
        html += '<a href="' + item.file + '" class="nav-item' + isActive + '">';
        html += '  <span class="icon">' + item.icon + '</span>';
        html += '  <span>' + item.label + '</span>';
        html += '</a>';
    }
    navContainer.innerHTML = html;
}

// Build the ticker bar
function buildTicker() {
    var tickerContainer = document.getElementById("ticker-content");
    if (!tickerContainer) return;

    var html = "";
    // Double the items for seamless scrolling
    var allItems = tickerData.concat(tickerData);
    for (var i = 0; i < allItems.length; i++) {
        var item = allItems[i];
        var changeClass = item.change >= 0 ? "up" : "down";
        var changeSign = item.change >= 0 ? "+" : "";
        html += '<span class="ticker-item">';
        html += '  <span class="symbol">' + item.symbol + '</span>';
        html += '  <span class="price">' + item.price + '</span>';
        html += '  <span class="change ' + changeClass + '">';
        html += '    ' + changeSign + item.change.toFixed(2) + '%';
        html += '  </span>';
        html += '  <span style="margin-left:16px;opacity:0.2;color:#64748b">|</span>';
        html += '</span>';
    }
    tickerContainer.innerHTML = html;
}

// Mobile menu toggle
function toggleSidebar() {
    var sidebar = document.querySelector(".sidebar");
    if (sidebar) {
        sidebar.classList.toggle("open");
    }
}

// Format number to Indian Rupees
function formatINR(num) {
    return "₹" + new Intl.NumberFormat("en-IN", {
        maximumFractionDigits: 0
    }).format(num);
}

// Initialize when page loads
window.addEventListener("DOMContentLoaded", function() {
    buildSidebar();
    buildTicker();
});
