// One public-landmark lookup through the real application adapter. No private
// report/location input, raw provider payloads, or credentials enter the report.
import "dotenv/config";
import { SerpApiPlaceContextProvider } from "../apps/api/dist/place.js";

const key = process.env.SERPAPI_API_KEY;
if (!key) {
  console.error("SERPAPI_API_KEY is required; no request sent.");
  process.exit(1);
}
try {
  const accountUrl = new URL("https://serpapi.com/account.json");
  accountUrl.searchParams.set("api_key", key);
  const response = await fetch(accountUrl, { signal: AbortSignal.timeout(10000) });
  const account = await response.json();
  // The free Account API does not consume searches. Fail closed if the account
  // is paid, the balance is unknown, or the free allowance is exhausted.
  if (!response.ok || account.plan_monthly_price !== 0 ||
      typeof account.total_searches_left !== "number" || account.total_searches_left < 1) {
    throw new Error("free_allowance_unverified");
  }
  const start = performance.now();
  const place = await new SerpApiPlaceContextProvider(key, 15000).context(12.9763, 77.5929);
  if (!place) throw new Error("no_verified_nearby_place");
  console.log(JSON.stringify({
    checkedAt: new Date().toISOString(), provider: "SerpApi",
    accountPlan: account.plan_name, monthlyPriceUsd: 0,
    searchesRemainingBefore: account.total_searches_left,
    publicLocation: "Cubbon Park, Bengaluru",
    durationMs: Math.round(performance.now() - start),
    maximumDistanceMeters: 2000, result: place,
  }, null, 2));
} catch {
  // Fetch errors can embed a URL containing the API key; never print them.
  console.error("Live SerpApi check failed; verify free allowance, access, and nearby results.");
  process.exitCode = 1;
}
