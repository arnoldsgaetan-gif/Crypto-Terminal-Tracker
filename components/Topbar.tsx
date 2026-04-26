"use client";

import { UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";

const ASSETS = [
  { symbol: "BTC", price: 84320,  change: +2.4  },
  { symbol: "ETH", price: 1588,   change: -0.8  },
  { symbol: "XAU", price: 3340,   change: +0.45 },
  { symbol: "SOL", price: 142,    change: +3.1  },
  { symbol: "BNB", price: 598,    change: +1.2  },
  { symbol: "EUR", price: 1.095,  change: +0.12 },
];

function PriceTile({ symbol, price, change }: typeof ASSETS[0]) {
  return (
    <div className="flex items-center gap-2 px-4 border-r border-zinc-800 text-xs font-mono">
      <span className="text-zinc-500">{symbol}</span>
      <span className="text-zinc-200 font-semibold">
        {price.toLocaleString("fr-FR")}
      </span>
      <span className={change >= 0 ? "text-emerald-400" : "text-red-400"}>
        {change >= 0 ? "+" : ""}{change}%
      </span>
    </div>
  );
}

export default function Topbar() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () =>
      setTime(new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="h-11 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between shrink-0">
      {/* Prices */}
      <div className="flex items-center h-full overflow-x-auto">
        {ASSETS.map((a) => (
          <PriceTile key={a.symbol} {...a} />
        ))}
      </div>

      {/* Right */}
      <div className="flex items-center gap-4 px-4">
        <span className="text-[10px] text-zinc-500 font-mono tabular-nums">
          {time} UTC+1
        </span>
        <UserButton afterSignOutUrl="/" />
      </div>
    </header>
  );
}
