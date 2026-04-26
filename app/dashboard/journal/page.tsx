import Journal from "@/components/Journal";
import Ticker from "@/components/Ticker";

export default function JournalPage() {
  return (
    <div className="space-y-4">
      <Ticker />
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-lg font-mono tracking-tight text-white">
          JOURNAL <span className="text-emerald-400">DE TRADING</span>
        </h1>
      </div>
      <Journal />
    </div>
  );
}
