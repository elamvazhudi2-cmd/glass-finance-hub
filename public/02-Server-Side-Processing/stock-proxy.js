/* ================================================
   Server-Side Processing: Stock Market API Proxy
   Technology: Deno / Supabase Edge Functions
   Purpose: Securely proxy Alpha Vantage API calls
   ================================================ */

// This runs on the SERVER, not in the browser
// API keys are stored as server environment variables (Deno.env)

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// CORS headers to allow browser requests
var corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, content-type, apikey"
};

// USD to INR conversion rate
var USD_TO_INR = 83.47;

// API key is stored securely on the server
var API_KEY = Deno.env.get("ALPHA_VANTAGE_KEY");

serve(async function(request) {

    // Handle preflight CORS requests
    if (request.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        // Check if API key is configured
        if (!API_KEY) {
            throw new Error("ALPHA_VANTAGE_KEY is not configured on server");
        }

        // Get the stock symbol from the URL query string
        var url = new URL(request.url);
        var symbol = url.searchParams.get("symbol") || "AAPL";

        // Fetch quote from Alpha Vantage (server-to-server call)
        var quoteUrl = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=" + symbol + "&apikey=" + API_KEY;
        var quoteResponse = await fetch(quoteUrl);
        var quoteData = await quoteResponse.json();

        // Fetch daily chart data (last 100 days)
        var dailyUrl = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=" + symbol + "&outputsize=compact&apikey=" + API_KEY;
        var dailyResponse = await fetch(dailyUrl);
        var dailyData = await dailyResponse.json();

        // Extract quote information
        var quote = quoteData["Global Quote"];
        var timeSeries = dailyData["Time Series (Daily)"] || {};

        // Convert price from USD to INR (server-side processing)
        var priceUSD = parseFloat(quote["05. price"] || "0");
        var changePercent = parseFloat(quote["10. change percent"].replace("%", "") || "0");
        var priceINR = Math.round(priceUSD * USD_TO_INR);

        // Build 7-day sparkline data (server-side data transformation)
        var sparkline = [];
        var entries = Object.entries(timeSeries).slice(0, 7).reverse();
        for (var i = 0; i < entries.length; i++) {
            var closePrice = parseFloat(entries[i][1]["4. close"]);
            sparkline.push(Math.round(closePrice * USD_TO_INR));
        }

        // Build 30-day chart data
        var chart = [];
        var chartEntries = Object.entries(timeSeries).slice(0, 30).reverse();
        for (var j = 0; j < chartEntries.length; j++) {
            chart.push({
                label: chartEntries[j][0],
                value: Math.round(parseFloat(chartEntries[j][1]["4. close"]) * USD_TO_INR)
            });
        }

        // Return processed data to the browser
        return new Response(JSON.stringify({
            symbol: symbol,
            priceINR: priceINR,
            changePct: changePercent,
            volume: quote["06. volume"] || "0",
            sparkline: sparkline,
            chart: chart
        }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" }
        });

    } catch (error) {
        // Return error as JSON
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
    }
});
