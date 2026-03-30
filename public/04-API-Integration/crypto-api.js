/* ================================================
   API Integration: Cryptocurrency Market Data
   Endpoint: CoinGecko via Supabase Edge Function
   Method: Fetches live crypto prices in INR
   ================================================ */

var SUPABASE_URL = "https://yqbfjeljjsdtisvcayzq.supabase.co";
var SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."; // truncated

/**
 * Fetches all crypto prices from the server-side proxy
 * The proxy handles:
 *   1. API key management (kept secret on server)
 *   2. USD to INR conversion
 *   3. Data formatting and sparkline processing
 */
async function fetchCryptoPrices() {
    try {
        // Call the crypto-proxy edge function
        var response = await fetch(SUPABASE_URL + "/functions/v1/crypto-proxy", {
            method: "POST",
            headers: {
                "apikey": SUPABASE_ANON_KEY,
                "Authorization": "Bearer " + SUPABASE_ANON_KEY,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("HTTP " + response.status);
        }

        var data = await response.json();

        // Data structure returned from server:
        // {
        //   coins: [{ symbol, name, price, change, volume, marketCap, sparkline }],
        //   globalStats: { totalMarketCapINR, totalVolumeINR, btcDominance }
        // }

        return data;

    } catch (error) {
        console.error("Crypto API error:", error.message);

        // Return fallback data if API fails
        return {
            coins: [
                { symbol: "BTC", name: "Bitcoin", price: 5627317, change: 2.34 },
                { symbol: "ETH", name: "Ethereum", price: 320718, change: 1.78 },
                { symbol: "SOL", name: "Solana", price: 15233, change: 4.12 }
            ],
            globalStats: {
                totalMarketCapINR: "₹2,17,85,670 Cr",
                totalVolumeINR: "₹8,21,346 Cr",
                btcDominance: "51.2%"
            }
        };
    }
}

/**
 * Formats a crypto price for display
 * Uses Indian number formatting (en-IN locale)
 */
function formatCryptoPrice(price) {
    return "₹" + new Intl.NumberFormat("en-IN").format(price);
}

/**
 * Renders crypto data into the page
 * Called after API response is received
 */
function renderCryptoData(data) {
    var container = document.getElementById("crypto-grid");
    if (!container || !data.coins) return;

    var html = "";
    for (var i = 0; i < data.coins.length; i++) {
        var coin = data.coins[i];
        var badgeClass = coin.change >= 0 ? "badge-gain" : "badge-loss";
        var sign = coin.change >= 0 ? "+" : "";

        html += "<div class=\"glass-card\">";
        html += "  <p style=\"font-weight:700\">" + coin.symbol + "</p>";
        html += "  <p style=\"color:var(--text-muted);font-size:12px\">" + coin.name + "</p>";
        html += "  <p style=\"font-size:20px;font-weight:700;margin:8px 0\">" + formatCryptoPrice(coin.price) + "</p>";
        html += "  <span class=\"" + badgeClass + "\">" + sign + coin.change.toFixed(2) + "%</span>";
        html += "</div>";
    }
    container.innerHTML = html;
}

/**
 * Initialize: fetch data and set up auto-refresh
 */
function initCryptoExplorer() {
    // Fetch immediately
    fetchCryptoPrices().then(renderCryptoData);

    // Auto-refresh every 60 seconds
    setInterval(function() {
        fetchCryptoPrices().then(renderCryptoData);
    }, 60000);
}

// Run when page loads
// window.addEventListener("DOMContentLoaded", initCryptoExplorer);
