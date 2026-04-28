"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const SYMBOLS = [
  { label: "XAU/USD", value: "FX:XAUUSD" },
  { label: "BTC/USD", value: "BINANCE:BTCUSDT" },
  { label: "ETH/USD", value: "BINANCE:ETHUSDT" },
  { label: "EUR/USD", value: "FX:EURUSD" },
  { label: "SOL/USD", value: "BINANCE:SOLUSDT" },
  { label: "NASDAQ",  value: "NASDAQ:NDX" },
];

const TIMEFRAMES = ["1", "5", "15", "60", "240", "D"];

export default function TradingChart() {
  const containerRef            = useRef<HTMLDivElement>(null);
  const [symbol, setSymbol]     = useState(SYMBOLS[0].value);
  const [interval, setInterval] = useState("15");

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.innerHTML = "";

    const script = document.createElement("script");
    script.src   = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize:          true,
      symbol,
      interval,
      timezone:          "Europe/Paris",
      theme:             "dark",
      style:             "1",
      locale:            "fr",
      backgroundColor:   "#0f1117",
      hide_top_toolbar:  false,
      save_image:        false,
    });
    container.appendChild(script);

    return () => { container.innerHTML = ""; };
  }, [symbol, interval]);

  return (
    <div className="flex flex-col h-96 bg-[#0f1117] rounded-xl border border-[#1f2630] overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-[#1f2630] shrink-0 flex-wrap">
        <select
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className="bg-zinc-900 text-zinc-300 text-xs font-mono px-2 py-1 rounded border border-zinc-700 focus:outline-none focus:border-emerald-500"
        >
          {SYMBOLS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        <div className="flex gap-1">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf}
              onClick={() => setInterval(tf)}
              className={cn(
                "text-[10px] font-mono px-2 py-1 rounded transition-colors",
                interval === tf
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "text-zinc-600 hover:text-zinc-300"
              )}
            >
              {tf === "60" ? "1H" : tf === "240" ? "4H" : tf === "D" ? "1D" : `${tf}M`}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1" ref={containerRef} />
    </div>
  );
}
