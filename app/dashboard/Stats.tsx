import { Card } from "./Card";

interface StatsProps {
  winrate?: number;
  avgRR?: number;
  drawdown?: number;
}

export function Stats({ winrate = 64, avgRR = 2.1, drawdown = -5 }: StatsProps) {
  return (
    <Card title="Performance">
      <div className="text-xs space-y-2">
        <div className="flex justify-between">
          <span className="text-zinc-400">Winrate 7j</span>
          <span className={winrate >= 50 ? "text-emerald-400 font-bold" : "text-red-400 font-bold"}>
            {winrate}%
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-400">RR moyen</span>
          <span className="text-white font-bold">{avgRR}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-400">Drawdown</span>
          <span className={drawdown < 0 ? "text-red-400 font-bold" : "text-emerald-400 font-bold"}>
            {drawdown > 0 ? "+" : ""}{drawdown}%
          </span>
        </div>
      </div>
    </Card>
  );
}
