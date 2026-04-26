"use client";

import { useState } from "react";
import { TrendingUp, TrendingDown, Filter } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export interface JournalTrade {
  id: string;
  symbol: string;
  type: "LONG" | "SHORT";
  result: number;
  rr: number;
  createdAt: Date | string;
  note?: string;
}

const DEMO_TRADES: JournalTrade[] = [
  { id: "1", symbol: "XAU/USD", type: "LONG",  result:  340,  rr: 2.3, createdAt: new Date(Date.now() - 1 * 86400_000), note: "Breakout H4 confirmé" },
  { id: "2", symbol: "BTC/USD", type: "SHORT", result: -120,  rr: 0.8, createdAt: new Date(Date.now() - 2 * 86400_000) },
  { id: "3", symbol: "EUR/USD", type: "LONG",  result:  195,  rr: 1.9, createdAt: new Date(Date.now() - 3 * 86400_000), note: "Support daily" },
  { id: "4", symbol: "ETH/USD", type: "LONG",  result:  820,  rr: 3.1, createdAt: new Date(Date.now() - 4 * 86400_000) },
  { id: "5", symbol: "SOL/USD", type: "SHORT", result: -75,   rr: 0.5, createdAt: new Date(Date.now() - 5 * 86400_000) },
  { id: "6", symbol: "XAU/USD", type: "LONG",  result:  510,  rr: 2.8, createdAt: new Date(Date.now() - 6 * 86400_000), note: "NFP reaction" },
];

interface JournalProps {
  trades?: JournalTrade[];
}

export default function Journal({ trades = DEMO_TRADES }: JournalProps) {
  const [filter, setFilter] = useState<"ALL" | "WIN" | "LOSS">("ALL");

  const filtered = trades.filter((t) => {
    if (filter === "WIN")  return t.result > 0;
    if (filter === "LOSS") return t.result <= 0;
    return true;
  });

  const wins   = trades.filter((t) => t.result > 0).length;
  const losses = trades.filter((t) => t.result <= 0).length;
  const totalPnL = trades.reduce((s, t) => s + t.result, 0);

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-xl overflow-hidden font-mono">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-950 px-5 py-3 border-b border-zinc-700">
        <h2 className="text-sm text-white tracking-tight">JOURNAL DE TRADING</h2>
        <div className="flex items-center gap-4 text-xs">
          <span className="text-emerald-400 font-bold">{wins}W</span>
          <span className="text-red-400 font-bold">{losses}L</span>
          <span className={cn("font-bold", totalPnL >= 0 ? "text-emerald-400" : "text-red-400")}>
            {formatCurrency(totalPnL)}
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 px-5 py-2 border-b border-zinc-800">
        <Filter size={11} className="text-zinc-500" />
        {(["ALL", "WIN", "LOSS"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "text-[10px] px-2 py-0.5 rounded font-mono transition-colors",
              filter === f
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Trades */}
      <div className="divide-y divide-zinc-800">
        {filtered.map((t) => (
          <div key={t.id} className="flex items-center justify-between px-5 py-2.5 hover:bg-zinc-800/40 transition-colors">
            <div className="flex items-center gap-3">
              {t.result > 0
                ? <TrendingUp size={13} className="text-emerald-400 shrink-0" />
                : <TrendingDown size={13} className="text-red-400 shrink-0" />
              }
              <span className="text-white text-xs font-bold w-20">{t.symbol}</span>
              <Badge variant={t.type === "LONG" ? "default" : "destructive"} className="text-[9px]">
                {t.type}
              </Badge>
              {t.note && (
                <span className="text-zinc-500 text-[10px] hidden sm:block">{t.note}</span>
              )}
            </div>
            <div className="flex items-center gap-4 text-xs shrink-0">
              <span className="text-zinc-500">
                RR <span className="text-zinc-300">{t.rr.toFixed(1)}</span>
              </span>
              <span className={cn("font-bold w-20 text-right", t.result > 0 ? "text-emerald-400" : "text-red-400")}>
                {t.result > 0 ? "+" : ""}{formatCurrency(t.result)}
              </span>
              <span className="text-zinc-600 text-[10px] w-16 text-right">
                {new Date(t.createdAt).toLocaleDateString("fr-FR")}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-10 text-zinc-600 text-xs">
          Aucun trade — {filter !== "ALL" ? `essaie le filtre ALL` : "commence à trader"}
        </div>
      )}
    </div>
  );
}
