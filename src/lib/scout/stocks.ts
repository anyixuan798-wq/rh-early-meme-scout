import { ZERO } from "./constants";
import { fetchJson } from "./http";
import type { StockAsset } from "./types";

let cache: { at: number; rows: StockAsset[] } | null = null;

export async function fetchStockAssets(): Promise<StockAsset[]> {
  if (cache && Date.now() - cache.at < 10 * 60_000) return cache.rows;
  try {
    // Static snapshot shipped with the site (public/data/stocks.json) and
    // refreshed by the GitHub Actions cron. api.robinhood.com/rhj/assets
    // sends no CORS headers, so browsers cannot call it directly — the
    // snapshot is fetched server-side (Actions runner) instead.
    const d = await fetchJson<{ updated_at?: string; assets?: StockAsset[] }>(
      `${import.meta.env.BASE_URL}data/stocks.json`,
      { timeoutMs: 10_000 },
    );
    const rows: StockAsset[] = Array.isArray(d.assets) ? d.assets : [];
    cache = { at: Date.now(), rows };
    return rows;
  } catch {
    return cache?.rows ?? [];
  }
}

export function matchStock(
  pairToken: string | null,
  stocks: StockAsset[],
): StockAsset | null {
  if (!pairToken) return null;
  const p = pairToken.toLowerCase();
  if (p === ZERO.toLowerCase()) return null;
  return stocks.find((s) => s.contract.toLowerCase() === p) ?? null;
}
