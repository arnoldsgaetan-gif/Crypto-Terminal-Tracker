import TradingChart from "@/components/TradingChart";
import { Stats } from "../Stats";
import { Watchlist } from "../Watchlist";

export default function TradingPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-lg font-mono tracking-tight text-white">
        TRADING <span className="text-emerald-400">VIEW</span>
      </h1>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-8">
          <div className="h-[600px]">
            <TradingChart />
          </div>
        </div>
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <Stats />
          <Watchlist />
        </div>
      </div>
    </div>
  );
}
