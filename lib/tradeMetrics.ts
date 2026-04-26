export interface Trade {
  createdAt: Date | string;
  result: number;       // P&L en USD
  symbol: string;
  rr?: number;          // Risk/Reward réalisé
}

/**
 * Winrate sur les 7 derniers jours (arrondi à l'entier)
 */
export function calculateWinrate(trades: Trade[]): number {
  if (!trades || trades.length === 0) return 0;

  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const last7 = trades.filter(
    (t) => new Date(t.createdAt).getTime() >= sevenDaysAgo
  );

  if (last7.length === 0) return 0;

  const wins = last7.filter((t) => t.result > 0).length;
  return Math.round((wins / last7.length) * 100);
}

/**
 * Risk/Reward moyen sur tous les trades fournis
 */
export function calculateAvgRR(trades: Trade[]): number {
  const tradesWithRR = trades.filter((t) => t.rr !== undefined);
  if (tradesWithRR.length === 0) return 0;

  const sum = tradesWithRR.reduce((acc, t) => acc + (t.rr ?? 0), 0);
  return Math.round((sum / tradesWithRR.length) * 100) / 100;
}

/**
 * Drawdown maximum en pourcentage depuis le peak du capital
 */
export function calculateMaxDrawdown(
  trades: Trade[],
  initialCapital: number
): number {
  if (!trades || trades.length === 0) return 0;

  let peak = initialCapital;
  let capital = initialCapital;
  let maxDrawdown = 0;

  for (const trade of trades) {
    capital += trade.result;
    if (capital > peak) peak = capital;

    const drawdown = ((peak - capital) / peak) * 100;
    if (drawdown > maxDrawdown) maxDrawdown = drawdown;
  }

  return Math.round(maxDrawdown * 100) / 100;
}

/**
 * P&L total
 */
export function calculateTotalPnL(trades: Trade[]): number {
  return trades.reduce((sum, t) => sum + t.result, 0);
}

/**
 * Stats globales en un seul appel
 */
export function getFullStats(trades: Trade[], initialCapital = 10000) {
  return {
    winrate: calculateWinrate(trades),
    avgRR: calculateAvgRR(trades),
    maxDrawdown: calculateMaxDrawdown(trades, initialCapital),
    totalPnL: calculateTotalPnL(trades),
    totalTrades: trades.length,
    wins: trades.filter((t) => t.result > 0).length,
    losses: trades.filter((t) => t.result <= 0).length,
  };
}
