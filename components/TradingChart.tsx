"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

// SSR disabled — TradingView requires window
const TradingViewWidget = dynamic(
  () => import("react-tradingview-widget"),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

function ChartSkeleton() {
  return (
    <div className="h-full w-full flex items-center justify-center bg-[#11161c]">
      <div className="text-zinc-600 text-xs font-mono animate-pulse">
        Chargement du chart...
      </div>
    </div>
  );
}

const SYMBOLS = [
  "FX:XAUUSD",
  "BINANCE:BTCUSDT",
  "BINANCE:ETHUSDT",
  "FX:EURUSD",
  "NASDAQ:NDX",
];

export default function TradingChart() {
  const [symbol, setSymbol] = useState("FX:XAUUSD");
  const [interval, setInterval] = useState("15");

  return (
    <div className="flex flex-col h-96 bg-[#11161c] rounded-xl border border-[#1f2630] overflow-hidden">
      {/* Controls */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-[#1f2630] shrink-0">
        <select
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className="bg-zinc-900 text-zinc-300 text-xs font-mono px-2 py-1 rounded border border-zinc-700 focus:outline-none focus:border-emerald-500"
        >
          {SYMBOLS.map((s) => (
            <option key={s} value={s}>{s.split(":")[1]}</option>
          ))}
        </select>

        {["1", "5", "15", "60", "240", "D"].map((tf) => (
          <button
            key={tf}
            onClick={() => setInterval(tf)}
            className={`text-[10px] font-mono px-2 py-1 rounded transition-colors ${
              interval === tf
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {tf}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="flex-1">
        <TradingViewWidget
          symbol={symbol}
          theme="dark"
          interval={interval}
          autosize
          hide_top_toolbar={false}
          hide_legend={false}
          allow_symbol_change={false}
        />
      </div>
    </div>
  );
}
