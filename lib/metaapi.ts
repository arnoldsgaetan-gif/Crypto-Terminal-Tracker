/**
 * Intégration MetaAPI — récupération des trades MT4/MT5
 * Doc : https://metaapi.cloud/docs/client/
 */

export interface MetaTrade {
  id: string;
  symbol: string;
  type: "DEAL_TYPE_BUY" | "DEAL_TYPE_BUY_CANCEL" | "DEAL_TYPE_SELL" | "DEAL_TYPE_SELL_CANCEL";
  volume: number;
  openPrice: number;
  closePrice: number;
  profit: number;
  commission: number;
  swap: number;
  openTime: string;
  closeTime: string;
}

const METAAPI_BASE = "https://metaapi.cloud/api";

function getHeaders(): HeadersInit {
  const token = process.env.METAAPI_TOKEN;
  if (!token) throw new Error("METAAPI_TOKEN manquant dans .env.local");
  return {
    "auth-token": token,
    "Content-Type": "application/json",
  };
}

/**
 * Récupère l'historique des trades pour un compte donné
 */
export async function getMetaTrades(
  accountId: string,
  startTime?: string,
  endTime?: string
): Promise<MetaTrade[]> {
  const params = new URLSearchParams();
  if (startTime) params.set("startTime", startTime);
  if (endTime) params.set("endTime", endTime);

  const url = `${METAAPI_BASE}/users/current/accounts/${accountId}/history-deals/time?${params}`;

  const res = await fetch(url, {
    headers: getHeaders(),
    next: { revalidate: 60 }, // cache 60s — Next.js App Router
  });

  if (!res.ok) {
    throw new Error(`MetaAPI error ${res.status}: ${await res.text()}`);
  }

  const data = await res.json();
  return data.deals ?? [];
}

/**
 * Convertit un MetaTrade en Trade compatible avec tradeMetrics
 */
export function toInternalTrade(deal: MetaTrade) {
  return {
    symbol: deal.symbol,
    result: deal.profit + deal.commission + deal.swap,
    createdAt: new Date(deal.closeTime),
  };
}
