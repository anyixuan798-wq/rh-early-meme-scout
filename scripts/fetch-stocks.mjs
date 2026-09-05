// Refresh public/data/stocks.json from api.robinhood.com/rhj/assets.
//
// Runs on a GitHub Actions schedule (server-side, no CORS restrictions).
// The static site reads this snapshot because the Robinhood endpoint sends
// no Access-Control-Allow-Origin headers, so browsers cannot call it
// directly. Mirrors the filtering logic of src/lib/scout/stocks.ts.
import { writeFileSync } from "node:fs";

const CHAIN = 4663;

const res = await fetch("https://api.robinhood.com/rhj/assets", {
  headers: {
    "User-Agent":
      "Mozilla/5.0 (compatible; RH Early Meme Scout snapshot; +https://github.com/anyixuan798-wq/rh-early-meme-scout)",
    Accept: "application/json",
  },
});
if (!res.ok) {
  console.error(`rhj/assets HTTP ${res.status}`);
  process.exit(1);
}
const d = await res.json();
if (!Array.isArray(d?.assets)) {
  console.error("unexpected rhj/assets payload shape");
  process.exit(1);
}

const rows = [];
for (const a of d.assets) {
  const dep = (a.deployments ?? []).find(
    (x) => Number(x.chainId) === CHAIN && x.contractAddress,
  );
  if (!dep?.contractAddress) continue;
  rows.push({
    symbol: a.tokenSymbol ?? "-",
    name: (a.tokenName ?? "").replace(" • Robinhood Token", ""),
    contract: dep.contractAddress,
    logoUrl: a.logoUrl ?? null,
    status: a.status ?? "",
  });
}
rows.sort((a, b) => a.symbol.localeCompare(b.symbol));

const out = {
  updated_at: new Date().toISOString(),
  count: rows.length,
  assets: rows,
};
const target = new URL("../public/data/stocks.json", import.meta.url);
writeFileSync(target, JSON.stringify(out, null, 1) + "\n");
console.log(`stocks.json refreshed: ${rows.length} assets on chain ${CHAIN}`);
