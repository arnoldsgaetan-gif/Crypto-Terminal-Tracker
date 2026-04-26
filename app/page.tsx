export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-mono mb-4 tracking-tighter">
          CRYPTO<span className="text-emerald-400">TERMINAL</span>
        </h1>
        <p className="text-xl text-zinc-400 mb-8 font-mono">
          Ton terminal trading privé — BTC · ETH · FOREX · XAU
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/sign-up"
            className="bg-emerald-500 hover:bg-emerald-600 transition-colors px-8 py-4 rounded font-mono text-white"
          >
            COMMENCER GRATUITEMENT
          </a>
          <a
            href="/sign-in"
            className="border border-zinc-700 hover:border-zinc-500 transition-colors px-8 py-4 rounded font-mono text-zinc-300"
          >
            SE CONNECTER
          </a>
        </div>
      </div>
    </div>
  );
}
