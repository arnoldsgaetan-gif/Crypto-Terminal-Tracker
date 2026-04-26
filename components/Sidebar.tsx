"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  LineChart,
  BookOpen,
  Wallet,
  TrendingUp,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard",  href: "/dashboard",            icon: LayoutDashboard },
  { label: "Portfolio",  href: "/dashboard/portfolio",  icon: Wallet },
  { label: "Trading",    href: "/dashboard/trading",    icon: TrendingUp },
  { label: "Journal",    href: "/dashboard/journal",    icon: BookOpen },
  { label: "Analyse",    href: "/dashboard/analytics",  icon: LineChart },
  { label: "Paramètres", href: "/dashboard/settings",   icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 h-screen bg-zinc-950 border-r border-zinc-800 flex flex-col px-3 py-5 shrink-0">
      {/* Logo */}
      <div className="mb-8 px-2">
        <h1 className="text-lg font-bold font-mono tracking-tighter text-white">
          CRYPTO<span className="text-emerald-400">.</span>
        </h1>
        <p className="text-[10px] text-zinc-500 mt-0.5 font-mono">TERMINAL v1.0</p>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 flex-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all font-mono",
                active
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900"
              )}
            >
              <Icon size={15} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-zinc-800 pt-3 mt-3">
        <div className="flex items-center gap-2 px-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] text-zinc-500 font-mono">MARCHÉ OUVERT</span>
        </div>
      </div>
    </aside>
  );
}
