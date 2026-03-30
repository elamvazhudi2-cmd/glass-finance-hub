/* ================================================
   Server-Side Processing: Crypto Market API Proxy
   Technology: Deno / Supabase Edge Functions
   Purpose: Securely proxy CoinGecko API calls
   ================================================ */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

var corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, content-type, apikey"
};

var USD_TO_INR = 83.47;
var API_KEY = Deno.env.get("COINGECKO_API_KEY");

// Coin IDs used by CoinGecko API
var COINS = ["bitcoin", "ethereum", "solana", "binancecoin", "cardano", "avalanche-2", "matic-network", "polkadot"];

// Symbol mapping for display
var SYMBOL_MAP = {
    bitcoin: "BTC", ethereum: "ETH", solana: "SOL",
    binancecoin: "BNB", cardano: "ADA", "avalanche-2": "AVAX",
    "matic-network": "MATIC", polkadot: "DOT"
};

serve(async function(request) {
    if (request.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        // Build CoinGecko API URL
        var apiUrl = "https://api.coingecko.com/api/v3/coins/markets";
        apiUrl += "?vs_currency=usd&ids=" + COINS.join(",");
        apiUrl += "&sparkline=true&price_change_percentage=24h";

        // Set up headers with API key
        var headers = { accept: "application/json" };
        if (API_KEY) {
            headers["x-cg-demo-api-key"] = API_KEY;
        }

        // Fetch from CoinGecko (server-to-server)
        var response = await fetch(apiUrl, { headers: headers });
        var data = await response.json();

        // Process each coin - convert to INR on server
        var coins = [];
        for (var i = 0; i < data.length; i++) {
            var coin = data[i];
            var priceINR = Math.round(coin.current_price * USD_TO_INR);
            var change = parseFloat((coin.price_change_percentage_24h || 0).toFixed(2));

            // Process sparkline data
            var sparkline = [];
            if (coin.sparkline_in_7d && coin.sparkline_in_7d.price) {
                var prices = coin.sparkline_in_7d.price;
                var step = Math.floor(prices.length / 7);
                for (var j = 0; j < 7; j++) {
                    sparkline.push(Math.round(prices[j * step] * USD_TO_INR));
                }
            }

            coins.push({
                symbol: SYMBOL_MAP[coin.id] || coin.symbol.toUpperCase(),
                name: coin.name,
                price: priceINR,
                change: change,
                volume: formatCrores(coin.total_volume * USD_TO_INR),
                marketCap: formatCrores(coin.market_cap * USD_TO_INR),
                sparkline: sparkline
            });
        }

        // Fetch global market stats
        var globalRes = await fetch("https://api.coingecko.com/api/v3/global", { headers: headers });
        var globalData = await globalRes.json();
        var gd = globalData.data;

        var globalStats = {
            totalMarketCapINR: formatCrores(gd.total_market_cap.usd * USD_TO_INR),
            totalVolumeINR: formatCrores(gd.total_volume.usd * USD_TO_INR),
            btcDominance: gd.market_cap_percentage.btc.toFixed(1) + "%"
        };

        return new Response(JSON.stringify({ coins: coins, globalStats: globalStats }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" }
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
    }
});

// Helper: Format large numbers as Crores (Indian numbering)
function formatCrores(value) {
    var crores = value / 10000000;
    if (crores >= 100) {
        return "₹" + Math.round(crores).toLocaleString("en-IN") + " Cr";
    }
    return "₹" + crores.toFixed(1) + " Cr";
}
