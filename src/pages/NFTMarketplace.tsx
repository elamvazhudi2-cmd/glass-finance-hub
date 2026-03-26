import { useState } from "react";
import { Gem, Heart, ExternalLink, Search } from "lucide-react";

const NFTS = [
  { id: 1, name: "CryptoPunk #3100", collection: "CryptoPunks", price: "96.25 ETH", usd: "$369,600", creator: "Larva Labs", img: "🤖", rarity: "Legendary", liked: false, category: "Art" },
  { id: 2, name: "Bored Ape #7090", collection: "BAYC", price: "82.00 ETH", usd: "$314,900", creator: "Yuga Labs", img: "🦍", rarity: "Rare", liked: true, category: "PFP" },
  { id: 3, name: "Azuki #1012", collection: "Azuki", price: "18.5 ETH", usd: "$71,055", creator: "Chiru Labs", img: "🌸", rarity: "Uncommon", liked: false, category: "Art" },
  { id: 4, name: "Pudgy Penguin #6458", collection: "Pudgy Penguins", price: "12.8 ETH", usd: "$49,152", creator: "Nolan", img: "🐧", rarity: "Common", liked: false, category: "PFP" },
  { id: 5, name: "DeGod #2136", collection: "DeGods", price: "22.4 ETH", usd: "$86,016", creator: "DeGods", img: "👁️", rarity: "Rare", liked: true, category: "Art" },
  { id: 6, name: "World of Women #394", collection: "WoW", price: "8.75 ETH", usd: "$33,600", creator: "Yam Karkai", img: "🎨", rarity: "Uncommon", liked: false, category: "Art" },
  { id: 7, name: "Doodle #6914", collection: "Doodles", price: "5.60 ETH", usd: "$21,504", creator: "Evan Keast", img: "🌈", rarity: "Common", liked: false, category: "Art" },
  { id: 8, name: "Clone X #17043", collection: "Clone X", price: "14.2 ETH", usd: "$54,528", creator: "RTFKT", img: "🤖", rarity: "Rare", liked: false, category: "Metaverse" },
];

const CATEGORIES = ["All", "Art", "PFP", "Metaverse", "Gaming"];
const RARITY_COLORS: Record<string, string> = {
  Legendary: "hsl(43, 95%, 55%)",
  Rare: "hsl(199, 89%, 52%)",
  Uncommon: "hsl(258, 85%, 62%)",
  Common: "hsl(215, 20%, 55%)",
};

export default function NFTMarketplace() {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [likes, setLikes] = useState<Record<number, boolean>>(
    Object.fromEntries(NFTS.map((n) => [n.id, n.liked]))
  );
  const [sortBy, setSortBy] = useState<"price" | "name">("price");

  const filtered = NFTS.filter(
    (n) =>
      (category === "All" || n.category === category) &&
      (n.name.toLowerCase().includes(query.toLowerCase()) ||
        n.collection.toLowerCase().includes(query.toLowerCase()))
  );

  const STATS = [
    { label: "Total Volume", value: "$842M", icon: "💎" },
    { label: "Collections", value: "14,280", icon: "🗂️" },
    { label: "Traders (24h)", value: "48,312", icon: "👤" },
    { label: "Avg Price", value: "2.4 ETH", icon: "📈" },
  ];

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: "hsl(258 85% 62% / 0.15)" }}>
            <Gem size={20} style={{ color: "hsl(var(--secondary))" }} />
          </div>
          <div>
            <h1 className="page-title">Digital Ornamentals</h1>
            <p className="page-subtitle">NFTs & Digital Asset Marketplace</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STATS.map((s, i) => (
          <div key={i} className="glass-card-sm text-center">
            <div className="text-2xl mb-1">{s.icon}</div>
            <p className="text-lg font-bold" style={{ color: "hsl(var(--foreground))" }}>{s.value}</p>
            <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "hsl(var(--muted-foreground))" }} />
          <input
            className="w-full glass rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none"
            placeholder="Search NFTs, collections…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ color: "hsl(var(--foreground))", background: "transparent" }}
          />
        </div>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className="px-4 py-2 rounded-xl text-xs font-medium transition-all"
            style={{
              background: category === c ? "hsl(var(--secondary) / 0.2)" : "hsl(var(--muted))",
              color: category === c ? "hsl(var(--secondary))" : "hsl(var(--muted-foreground))",
              border: category === c ? "1px solid hsl(var(--secondary) / 0.4)" : "1px solid transparent",
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* NFT grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map((nft) => (
          <div
            key={nft.id}
            className="glass glass-hover rounded-2xl overflow-hidden group"
          >
            {/* NFT image placeholder */}
            <div
              className="h-52 flex items-center justify-center text-7xl relative"
              style={{
                background: `linear-gradient(135deg, hsl(${(nft.id * 50) % 360} 60% 15%), hsl(${(nft.id * 80) % 360} 70% 10%))`,
              }}
            >
              <span className="group-hover:scale-110 transition-transform duration-300">
                {nft.img}
              </span>
              <button
                onClick={() => setLikes((p) => ({ ...p, [nft.id]: !p[nft.id] }))}
                className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all"
                style={{
                  background: "hsl(0 0% 0% / 0.4)",
                  backdropFilter: "blur(8px)",
                }}
                aria-label="Like NFT"
              >
                <Heart
                  size={14}
                  fill={likes[nft.id] ? "hsl(0, 85%, 60%)" : "none"}
                  style={{ color: likes[nft.id] ? "hsl(0, 85%, 60%)" : "white" }}
                />
              </button>
              <div
                className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-xs font-bold"
                style={{
                  background: "hsl(0 0% 0% / 0.5)",
                  backdropFilter: "blur(8px)",
                  color: RARITY_COLORS[nft.rarity],
                }}
              >
                ✦ {nft.rarity}
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-start justify-between mb-1">
                <div>
                  <p className="text-sm font-bold truncate" style={{ color: "hsl(var(--foreground))" }}>
                    {nft.name}
                  </p>
                  <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                    {nft.collection}
                  </p>
                </div>
                <ExternalLink size={13} style={{ color: "hsl(var(--muted-foreground))", flexShrink: 0 }} />
              </div>
              <div className="flex items-center justify-between mt-3">
                <div>
                  <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>Price</p>
                  <p className="text-sm font-bold" style={{ color: "hsl(var(--foreground))" }}>
                    {nft.price}
                  </p>
                  <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{nft.usd}</p>
                </div>
                <button
                  className="px-4 py-2 rounded-xl text-xs font-bold transition-all"
                  style={{
                    background: "var(--gradient-primary)",
                    color: "hsl(var(--primary-foreground))",
                  }}
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
