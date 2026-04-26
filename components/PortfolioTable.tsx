"use client";

import { useState } from "react";
import { TrendingUp, TrendingDown, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, formatCurrency, formatPercent } from "@/lib/utils";

type PositionType = "Spot" | "Futures" | "Forex";

interface Position {
  id: string;
  asset: string;
  symbol: string;
  type: PositionType;
  quantity: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
}

const INITIAL_POSITIONS: Position[] = [
  { id: "1", asset: "Bitcoin",  symbol: "BTC/USD", type: "Futures", quantity: 0.45,  entryPrice: 68250, currentPrice: 84320, pnl: 7231.5, pnlPercent: 23.55 },
  { id: "2", asset: "Ethereum", symbol: "ETH/USD", type: "Spot",    quantity: 8.2,   entryPrice: 2450,  currentPrice: 1588,  pnl: -7068.4, pnlPercent: -35.18 },
  { id: "3", asset: "Gold",     symbol: "XAU/USD", type: "Forex",   quantity: 2.5,   entryPrice: 2380,  currentPrice: 3340,  pnl: 2400,   pnlPercent: 40.34 },
  { id: "4", asset: "EUR/USD",  symbol: "EUR/USD", type: "Forex",   quantity: 15000, entryPrice: 1.082, currentPrice: 1.095, pnl: 195,    pnlPercent: 1.2  },
];

const TYPE_BADGE: Record<PositionType, "default" | "warning" | "outline"> = {
  Futures: "warning",
  Spot:    "default",
  Forex:   "outline",
};

interface NewTradeForm {
  symbol: string;
  type: PositionType;
  quantity: string;
  entryPrice: string;
}

export default function PortfolioTable() {
  const [positions, setPositions] = useState<Position[]>(INITIAL_POSITIONS);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<NewTradeForm>({
    symbol: "BTC/USD", type: "Spot", quantity: "", entryPrice: "",
  });

  const totalPnL = positions.reduce((s, p) => s + p.pnl, 0);
  const winCount = positions.filter((p) => p.pnl > 0).length;
  const winrate  = Math.round((winCount / positions.length) * 100);

  function addTrade() {
    if (!form.quantity || !form.entryPrice) return;
    const qty   = parseFloat(form.quantity);
    const entry = parseFloat(form.entryPrice);
    const newPos: Position = {
      id: Date.now().toString(),
      asset:        form.symbol.split("/")[0],
      symbol:       form.symbol,
      type:         form.type,
      quantity:     qty,
      entryPrice:   entry,
      currentPrice: entry,
      pnl:          0,
      pnlPercent:   0,
    };
    setPositions((prev) => [...prev, newPos]);
    setShowForm(false);
    setForm({ symbol: "BTC/USD", type: "Spot", quantity: "", entryPrice: "" });
  }

  function closePosition(id: string) {
    setPositions((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-xl overflow-hidden font-mono">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-950 px-5 py-3 border-b border-zinc-700">
        <div className="flex items-center gap-3">
          <h2 className="text-base text-white tracking-tight">PORTFOLIO LIVE</h2>
          <Badge variant="default">{positions.length} positions</Badge>
        </div>
        <div className="flex items-center gap-5 text-xs">
          <div>
            <span className="text-zinc-500">TOTAL PnL </span>
            <span className={cn("font-bold", totalPnL >= 0 ? "text-emerald-400" : "text-red-400")}>
              {formatCurrency(totalPnL)}
            </span>
          </div>
          <div>
            <span className="text-zinc-500">WINRATE </span>
            <span className={cn("font-bold", winrate >= 60 ? "text-emerald-400" : "text-red-400")}>
              {winrate}%
            </span>
          </div>
          <Button
            size="sm"
            onClick={() => setShowForm((v) => !v)}
            className="bg-emerald-500 hover:bg-emerald-600 gap-1 text-xs"
          >
            <Plus size={13} /> NOUVEAU TRADE
          </Button>
        </div>
      </div>

      {/* Add trade form */}
      {showForm && (
        <div className="bg-zinc-900 border-b border-zinc-700 px-5 py-3 flex flex-wrap gap-3 items-end">
          <div>
            <label className="text-[10px] text-zinc-500 block mb-1">SYMBOLE</label>
            <select
              value={form.symbol}
              onChange={(e) => setForm((f) => ({ ...f, symbol: e.target.value }))}
              className="bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs px-2 py-1.5 rounded focus:outline-none focus:border-emerald-500"
            >
              {["BTC/USD","ETH/USD","XAU/USD","EUR/USD","SOL/USD","BNB/USD"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] text-zinc-500 block mb-1">TYPE</label>
            <select
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as PositionType }))}
              className="bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs px-2 py-1.5 rounded focus:outline-none focus:border-emerald-500"
            >
              <option>Spot</option>
              <option>Futures</option>
              <option>Forex</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] text-zinc-500 block mb-1">QUANTITÉ</label>
            <input
              type="number"
              placeholder="0.00"
              value={form.quantity}
              onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))}
              className="bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs px-2 py-1.5 rounded w-28 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="text-[10px] text-zinc-500 block mb-1">PRIX ENTRÉE</label>
            <input
              type="number"
              placeholder="0.00"
              value={form.entryPrice}
              onChange={(e) => setForm((f) => ({ ...f, entryPrice: e.target.value }))}
              className="bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs px-2 py-1.5 rounded w-28 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <Button size="sm" onClick={addTrade} className="bg-emerald-500 hover:bg-emerald-600">
            Ajouter
          </Button>
          <button onClick={() => setShowForm(false)} className="text-zinc-500 hover:text-zinc-300">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-zinc-950 text-zinc-500 uppercase tracking-wider">
            <tr>
              <th className="px-5 py-2.5 text-left">Actif</th>
              <th className="px-3 py-2.5 text-center">Type</th>
              <th className="px-3 py-2.5 text-right">Qté</th>
              <th className="px-3 py-2.5 text-right">Entrée</th>
              <th className="px-3 py-2.5 text-right">Actuel</th>
              <th className="px-3 py-2.5 text-right">PnL $</th>
              <th className="px-3 py-2.5 text-right">PnL %</th>
              <th className="px-3 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {positions.map((p) => (
              <tr
                key={p.id}
                className="border-t border-zinc-800 hover:bg-zinc-800/50 transition-colors"
              >
                <td className="px-5 py-3 font-bold text-white">{p.symbol}</td>
                <td className="px-3 py-3 text-center">
                  <Badge variant={TYPE_BADGE[p.type]}>{p.type}</Badge>
                </td>
                <td className="px-3 py-3 text-right text-zinc-300">
                  {p.quantity.toLocaleString("fr-FR")}
                </td>
                <td className="px-3 py-3 text-right text-zinc-400">
                  {p.entryPrice.toLocaleString("fr-FR")}
                </td>
                <td className="px-3 py-3 text-right text-white font-semibold">
                  {p.currentPrice.toLocaleString("fr-FR")}
                </td>
                <td className="px-3 py-3 text-right">
                  <span className={cn("flex items-center justify-end gap-1 font-bold", p.pnl >= 0 ? "text-emerald-400" : "text-red-400")}>
                    {p.pnl >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {formatCurrency(p.pnl)}
                  </span>
                </td>
                <td className={cn("px-3 py-3 text-right font-bold", p.pnlPercent >= 0 ? "text-emerald-400" : "text-red-400")}>
                  {formatPercent(p.pnlPercent)}
                </td>
                <td className="px-3 py-3 text-center">
                  <button
                    onClick={() => closePosition(p.id)}
                    className="text-zinc-600 hover:text-red-400 transition-colors"
                    title="Clôturer la position"
                  >
                    <X size={13} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {positions.length === 0 && (
        <div className="text-center py-12 text-zinc-600 text-xs">
          Aucune position ouverte — cliquez sur NOUVEAU TRADE
        </div>
      )}
    </div>
  );
}
