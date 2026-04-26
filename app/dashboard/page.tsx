"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import Ticker from "@/components/Ticker";
import PortfolioTable from "@/components/PortfolioTable";
import VaultModal from "@/components/VaultModal";
import { Button } from "@/components/ui/button";
import { Stats } from "./Stats";
import { Watchlist } from "./Watchlist";
import TradingChart from "@/components/TradingChart";

export default function Dashboard() {
  const { user } = useUser();
  const [showVault, setShowVault] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-mono">
      <Ticker />

      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b border-zinc-800 pb-4">
        <h1 className="text-2xl tracking-tight">
          CRYPTO <span className="text-emerald-400">TERMINAL</span>
        </h1>
        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-400">
            {user?.firstName ?? "Trader"}
          </span>
          <Button
            onClick={() => setShowVault(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-xs"
          >
            VAULT SÉCURISÉ
          </Button>
          <Button variant="outline" size="sm">
            Déconnexion
          </Button>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-12 gap-4">
        {/* Portfolio — 8 colonnes */}
        <div className="col-span-12 lg:col-span-8 space-y-4">
          <PortfolioTable />
        </div>

        {/* Sidebar right — 4 colonnes */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <Stats />
          <Watchlist />
          <TradingChart />
        </div>
      </div>

      <VaultModal isOpen={showVault} onClose={() => setShowVault(false)} />
    </div>
  );
}
