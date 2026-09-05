// Browser-side shim for the original TanStack Start server functions.
//
// The original app ran scanning on a Node server via createServerFn; this
// static edition keeps the exact call shapes the UI already uses ({ data: … })
// so the components needed zero changes. Scanning now runs fully in the
// visitor's browser against the same public APIs (Blockscout / DexScreener /
// Robinhood RPC / same-origin stock snapshot).
import { isAddress } from "./format";
import { inspectAddress, quotePrices, runScan, scoreNarrative } from "./scan";
import { fetchStockAssets } from "./stocks";

export async function scanRadar(input?: { data?: { force?: boolean } }) {
  return runScan(Boolean(input?.data?.force));
}

export async function inspectToken(input: { data: { address: string } }) {
  const address = input.data.address.trim();
  if (!isAddress(address)) throw new Error("需要 0x 开头的 40 位合约地址");
  return inspectAddress(address);
}

export async function refreshQuotes(input: { data: { addresses: string[] } }) {
  const addresses = (input.data.addresses ?? []).filter(isAddress).slice(0, 8);
  return quotePrices(addresses);
}

export async function listStocks() {
  return fetchStockAssets();
}

export async function scoreTokenNarrative(input: {
  data: {
    name: string;
    symbol: string;
    narrative: string | null;
    tweetUrl: string | null;
    stockPair: string | null;
  };
}) {
  return scoreNarrative(input.data);
}
