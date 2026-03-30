/* ================================================
   API Integration: Stock Market Data
   Endpoint: Alpha Vantage via Supabase Edge Function
   Method: Fetches live stock prices in INR
   ================================================ */

// Supabase project configuration (public keys only)
var SUPABASE_URL = "https://yqbfjeljjsdtisvcayzq.supabase.co";
var SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."; // truncated for security

// List of stock symbols to fetch
var STOCK_SYMBOLS = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "NVDA", "META"];

// Metadata for each stock
var STOCK_META = {
    AAPL: { name: "Apple Inc.", icon: "🍎" },
    MSFT: { name: "Microsoft Corp.", icon: "🪟" },
    GOOGL: { name: "Alphabet Inc.", icon: "🔍" },
    AMZN: { name: "Amazon.com", icon: "📦" },
    TSLA: { name: "Tesla Inc.", icon: "⚡" },
    NVDA: { name: "NVIDIA Corp.", icon: "💚" },
    META: { name: "Meta Platforms", icon: "🔵" }
};

/**
 * Fetches live stock price for a single symbol
 * Calls the server-side proxy (stock-proxy edge function)
 * to avoid exposing the API key in the browser
 */
async function fetchStockPrice(symbol) {
    try {
        // Call our server-side proxy instead of Alpha Vantage directly
        var url = SUPABASE_URL + "/functions/v1/stock-proxy?symbol=" + symbol;

        var response = await fetch(url, {
            method: "GET",
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

        // Data is already processed by server (converted to INR)
        return {
            symbol: data.symbol,
            name: STOCK_META[symbol].name,
            icon: STOCK_META[symbol].icon,
            priceINR: data.priceINR,
            changePct: data.changePct,
            volume: data.volume,
            sparkline: data.sparkline,
            chart: data.chart
        };

    } catch (error) {
        console.error("Error fetching " + symbol + ":", error.message);
        return null;
    }
}

/**
 * Fetches all stocks in parallel
 * Uses Promise.allSettled to handle individual failures
 * Limited to 5 requests per minute (Alpha Vantage free tier)
 */
async function fetchAllStocks() {
    console.log("Fetching live stock data...");

    // Limit to 5 symbols to respect API rate limits
    var symbolsToFetch = STOCK_SYMBOLS.slice(0, 5);

    // Fetch all in parallel using Promise.allSettled
    var results = await Promise.allSettled(
        symbolsToFetch.map(function(symbol) {
            return fetchStockPrice(symbol);
        })
    );

    // Filter successful results
    var stocks = [];
    for (var i = 0; i < results.length; i++) {
        if (results[i].status === "fulfilled" && results[i].value !== null) {
            stocks.push(results[i].value);
        }
    }

    console.log("Fetched " + stocks.length + " stocks successfully");
    return stocks;
}

/**
 * Auto-refresh stock data every 60 seconds
 * Uses setInterval for periodic polling
 */
function startAutoRefresh(callback) {
    // Fetch immediately
    fetchAllStocks().then(callback);

    // Then refresh every 60 seconds
    var intervalId = setInterval(function() {
        fetchAllStocks().then(callback);
    }, 60000);

    // Return interval ID for cleanup
    return intervalId;
}

// Export functions
// export { fetchStockPrice, fetchAllStocks, startAutoRefresh };
