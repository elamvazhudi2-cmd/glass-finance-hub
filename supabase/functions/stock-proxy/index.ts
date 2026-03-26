import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const USD_TO_INR = 83.47;
const API_KEY = Deno.env.get("ALPHA_VANTAGE_KEY");

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!API_KEY) {
      throw new Error("ALPHA_VANTAGE_KEY is not configured");
    }

    const url = new URL(req.url);
    const symbol = url.searchParams.get("symbol") || "AAPL";

    // Fetch quote from Alpha Vantage
    const avUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`;
    const avRes = await fetch(avUrl);
    const avData = await avJson(avRes);

    // Fetch daily chart data (compact = last 100 days)
    const dailyUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=compact&apikey=${API_KEY}`;
    const dailyRes = await fetch(dailyUrl);
    const dailyData = await avJson(dailyRes);

    const quote = avData["Global Quote"];
    const timeSeries = dailyData["Time Series (Daily)"] || {};

    // Convert to INR
    const priceUSD = parseFloat(quote?.["05. price"] || "0");
    const changeUSD = parseFloat(quote?.["09. change"] || "0");
    const changePct = parseFloat(quote?.["10. change percent"]?.replace("%", "") || "0");
    const priceINR = priceUSD * USD_TO_INR;

    // Build sparkline (last 7 days)
    const sparkline = Object.entries(timeSeries)
      .slice(0, 7)
      .reverse()
      .map(([, v]: [string, unknown]) =>
        Math.round(parseFloat((v as Record<string, string>)["4. close"]) * USD_TO_INR)
      );

    // Build 30-day chart
    const chart = Object.entries(timeSeries)
      .slice(0, 30)
      .reverse()
      .map(([date, v]: [string, unknown]) => ({
        label: date,
        value: Math.round(parseFloat((v as Record<string, string>)["4. close"]) * USD_TO_INR),
      }));

    return new Response(
      JSON.stringify({
        symbol: quote?.["01. symbol"] || symbol,
        priceINR: Math.round(priceINR),
        changeUSD,
        changePct,
        volume: quote?.["06. volume"] || "—",
        sparkline,
        chart,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

async function avJson(res: Response) {
  if (!res.ok) throw new Error(`Alpha Vantage HTTP ${res.status}`);
  return res.json();
}
