import { Card } from "./Card";

const WATCHLIST = [
  { symbol: "XAU/USD", price: "3 340", change: "+0.45%" },
  { symbol: "BTC/USD", price: "84 320", change: "+2.4%" },
  { symbol: "ETH/USD", price: "1 588", change: "-0.8%" },
  { symbol: "EUR/USD", price: "1.0950", change: "+0.12%" },
  { symbol: "SOL/USD", price: "142", change: "+3.1%" },
];

export function Watchlist() {
  return (
    <Card title="Watchlist">
      {WATCHLIST.map((d) => (
        <div key={d.symbol} className="flex justify-between text-xs py-1.5 border-b border-zinc-800 last:border-0">
          <span className="text-zinc-300 font-mono">{d.symbol}</span>
          <div className="flex gap-3">
            <span className="text-white font-mono">{d.price}</span>
            <span
              className={`font-mono font-bold ${
                d.change.startsWith("-") ? "text-red-400" : "text-emerald-400"
              }`}
            >
              {d.change}
            </span>
          </div>
        </div>
      ))}
    </Card>
  );
}
