"use client";

import { useEffect, useState } from "react";

const ASSETS = [
  { symbol: "BTC/USD",  price: 84320, change: +2.4  },
  { symbol: "ETH/USD",  price: 1588,  change: -0.8  },
  { symbol: "XAU/USD",  price: 3340,  change: +0.45 },
  { symbol: "SOL/USD",  price: 142,   change: +3.1  },
  { symbol: "BNB/USD",  price: 598,   change: +1.2  },
  { symbol: "EUR/USD",  price: 1.095, change: +0.12 },
  { symbol: "GBP/USD",  price: 1.271, change: -0.23 },
  { symbol: "USOIL",    price: 82.4,  change: -0.6  },
  { symbol: "NASDAQ",   price: 17840, change: +0.9  },
  { symbol: "SP500",    price: 5280,  change: +0.55 },
];

// Double the array so the marquee loops seamlessly
const ITEMS = [...ASSETS, ...ASSETS];

export default function Ticker() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="w-full bg-black border-b border-zinc-800 overflow-hidden py-1.5 mb-4">
      <div className="flex animate-marquee whitespace-nowrap">
        {ITEMS.map((a, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-2 px-5 text-[11px] font-mono border-r border-zinc-800 last:border-0"
          >
            <span className="text-zinc-500">{a.symbol}</span>
            <span className="text-white font-semibold">
              {a.price.toLocaleString("fr-FR")}
            </span>
            <span className={a.change >= 0 ? "text-emerald-400" : "text-red-400"}>
              {a.change >= 0 ? "▲" : "▼"} {Math.abs(a.change)}%
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
