import PortfolioTable from "@/components/PortfolioTable";
import Ticker from "@/components/Ticker";

export default function PortfolioPage() {
  return (
    <div className="space-y-4">
      <Ticker />
      <h1 className="text-lg font-mono tracking-tight text-white">
        PORTFOLIO <span className="text-emerald-400">LIVE</span>
      </h1>
      <PortfolioTable />
    </div>
  );
}
