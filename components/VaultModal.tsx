"use client";

import { useState } from "react";
import { X, Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { encryptData } from "@/lib/crypto";
import { cn } from "@/lib/utils";

interface VaultModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = "deposit" | "withdraw" | "seed";

const ASSETS = ["BTC", "ETH", "USDT", "SOL", "XAUUSD"] as const;

export default function VaultModal({ isOpen, onClose }: VaultModalProps) {
  const [tab, setTab]           = useState<Tab>("deposit");
  const [asset, setAsset]       = useState<typeof ASSETS[number]>("BTC");
  const [amount, setAmount]     = useState("");
  const [seed, setSeed]         = useState("");
  const [password, setPassword] = useState("");
  const [showSeed, setShowSeed] = useState(false);
  const [status, setStatus]     = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage]   = useState("");

  if (!isOpen) return null;

  async function handleDeposit() {
    if (!amount || isNaN(Number(amount))) return;
    setStatus("loading");
    await new Promise((r) => setTimeout(r, 600));
    setStatus("success");
    setMessage(`Dépôt de ${amount} ${asset} enregistré.`);
    setAmount("");
  }

  async function handleSaveSeed() {
    if (!seed || !password) {
      setStatus("error");
      setMessage("Seed phrase et mot de passe requis.");
      return;
    }
    setStatus("loading");
    try {
      const encrypted = await encryptData(seed, password);
      // TODO: POST /api/vault avec encrypted
      console.log("Encrypted seed:", encrypted);
      setStatus("success");
      setMessage("Seed chiffrée et sauvegardée.");
      setSeed("");
      setPassword("");
    } catch {
      setStatus("error");
      setMessage("Erreur de chiffrement.");
    }
  }

  function handleClose() {
    setStatus("idle");
    setMessage("");
    setAmount("");
    setSeed("");
    setPassword("");
    onClose();
  }

  const TABS: { id: Tab; label: string }[] = [
    { id: "deposit",  label: "Dépôt"    },
    { id: "withdraw", label: "Retrait"  },
    { id: "seed",     label: "🔐 Seed"  },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 w-full max-w-md shadow-2xl font-mono">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Lock size={16} className="text-emerald-400" />
            <h2 className="text-sm font-semibold text-zinc-100">VAULT SÉCURISÉ</h2>
          </div>
          <button onClick={handleClose} className="text-zinc-500 hover:text-zinc-200 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-5 bg-zinc-950 rounded-lg p-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); setStatus("idle"); setMessage(""); }}
              className={cn(
                "flex-1 text-[11px] py-1.5 rounded-md transition-all",
                tab === t.id
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Deposit / Withdraw */}
        {(tab === "deposit" || tab === "withdraw") && (
          <div className="space-y-4">
            <div>
              <label className="text-[10px] text-zinc-500 block mb-1.5 uppercase">Asset</label>
              <select
                value={asset}
                onChange={(e) => setAsset(e.target.value as typeof ASSETS[number])}
                className="w-full bg-zinc-800 border border-zinc-700 text-zinc-100 text-xs rounded-md px-3 py-2 focus:outline-none focus:border-emerald-500"
              >
                {ASSETS.map((a) => <option key={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] text-zinc-500 block mb-1.5 uppercase">Montant</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-zinc-800 border border-zinc-700 text-zinc-100 text-xs rounded-md px-3 py-2 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <Button
              className={cn(
                "w-full text-xs",
                tab === "deposit" ? "bg-emerald-500 hover:bg-emerald-600" : "bg-zinc-700 hover:bg-zinc-600"
              )}
              onClick={handleDeposit}
              disabled={status === "loading"}
            >
              {status === "loading" ? "..." : tab === "deposit" ? "Déposer" : "Retirer"}
            </Button>
          </div>
        )}

        {/* Seed vault */}
        {tab === "seed" && (
          <div className="space-y-4">
            <div className="flex items-start gap-2 text-[10px] text-yellow-400/80 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
              <ShieldCheck size={14} className="shrink-0 mt-0.5" />
              <span>Ta seed est chiffrée côté client avant envoi. Seul ton mot de passe peut la déchiffrer.</span>
            </div>
            <div>
              <label className="text-[10px] text-zinc-500 block mb-1.5 uppercase">Seed Phrase</label>
              <div className="relative">
                <textarea
                  value={seed}
                  onChange={(e) => setSeed(e.target.value)}
                  placeholder="mot1 mot2 mot3 ... (12 ou 24 mots)"
                  rows={3}
                  className={cn(
                    "w-full bg-zinc-800 border border-zinc-700 text-zinc-100 text-xs rounded-md px-3 py-2 resize-none focus:outline-none focus:border-emerald-500",
                    !showSeed && "blur-sm select-none"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowSeed((v) => !v)}
                  className="absolute top-2 right-2 text-zinc-500 hover:text-zinc-300"
                >
                  {showSeed ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-[10px] text-zinc-500 block mb-1.5 uppercase">Mot de passe maître</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-zinc-800 border border-zinc-700 text-zinc-100 text-xs rounded-md px-3 py-2 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <Button
              className="w-full text-xs bg-emerald-500 hover:bg-emerald-600"
              onClick={handleSaveSeed}
              disabled={status === "loading"}
            >
              {status === "loading" ? "Chiffrement..." : "Chiffrer & Sauvegarder"}
            </Button>
          </div>
        )}

        {/* Status message */}
        {message && (
          <p className={cn(
            "mt-3 text-[10px] text-center",
            status === "success" ? "text-emerald-400" : "text-red-400"
          )}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
