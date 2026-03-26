import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const API_KEY = Deno.env.get("COINGECKO_API_KEY");

// Map our symbols to CoinGecko IDs
const COIN_IDS: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  SOL: "solana",
  BNB: "binancecoin",
  ADA: "cardano",
  AVAX: "avalanche-2",
  MATIC: "matic-network",
  DOT: "polkadot",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ids = Object.values(COIN_IDS).join(",");

    // CoinGecko: prices in INR with 24h change
    const baseUrl = "https://api.coingecko.com/api/v3";
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (API_KEY) headers["x-cg-demo-api-key"] = API_KEY;

    const pricesRes = await fetch(
      `${baseUrl}/coins/markets?vs_currency=inr&ids=${ids}&order=market_cap_desc&per_page=50&page=1&sparkline=true&price_change_percentage=24h`,
      { headers }
    );

    if (!pricesRes.ok) {
      throw new Error(`CoinGecko HTTP ${pricesRes.status}: ${await pricesRes.text()}`);
    }

    const coins = await pricesRes.json();

    const result = coins.map((c: CoinGeckoCoin) => {
      const symbol = Object.entries(COIN_IDS).find(([, id]) => id === c.id)?.[0] || c.symbol.toUpperCase();
      return {
        symbol,
        name: c.name,
        price: Math.round(c.current_price),
        change: parseFloat((c.price_change_percentage_24h ?? 0).toFixed(2)),
        marketCap: formatINR(c.market_cap),
        volume: formatINR(c.total_volume),
        sparkline: (c.sparkline_in_7d?.price ?? [])
          .filter((_: number, i: number) => i % 24 === 0)
          .map((p: number) => Math.round(p)),
      };
    });

    // Global market stats
    const globalRes = await fetch(`${baseUrl}/global`, { headers });
    const globalData = globalRes.ok ? await globalRes.json() : null;
    const globalStats = globalData?.data
      ? {
          totalMarketCapINR: formatINR(globalData.data.total_market_cap?.inr ?? 0),
          totalVolumeINR: formatINR(globalData.data.total_volume?.inr ?? 0),
          btcDominance: globalData.data.market_cap_percentage?.btc?.toFixed(1) + "%",
        }
      : null;

    return new Response(
      JSON.stringify({ coins: result, globalStats }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function formatINR(n: number): string {
  if (n >= 1e12) return `₹${(n / 1e12).toFixed(2)}L Cr`;
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(2)} Cr`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(2)} L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

interface CoinGeckoCoin {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number | null;
  market_cap: number;
  total_volume: number;
  sparkline_in_7d?: { price: number[] };
}
