/**
 * The tier ladder, ported from the Python service so the licence rule survives the move.
 *
 * Raw AfriGIS and raw government layers cannot be redistributed, only GeoThrive's derived
 * output can. Every attribute row carries a `min_tier`, and the read path filters on it in
 * SQL before the row reaches JavaScript. That is the whole enforcement mechanism, and it only
 * works if it stays in the WHERE clause. Fetching a restricted row in order to drop it later
 * puts licensed data in a Vercel function's memory and, on a bad day, in a log line.
 *
 * This app has no per-caller identity. The Python service resolved a tier from an API key;
 * here the whole deployment runs at one tier, set by GEOTHRIVE_TIER. It defaults to `basic`,
 * which is what the key this app used to present actually resolved to, so the default is the
 * status quo rather than a guess. Defaulting to the most restrictive tier is also the only
 * safe direction to be wrong in.
 */

const BASIC = 'basic';
const STANDARD = 'standard';
const ENTERPRISE = 'enterprise';

/** Ascending. A caller sees every row whose min_tier rank is at or below their own. */
const TIER_RANK: Record<string, number> = { [BASIC]: 0, [STANDARD]: 1, [ENTERPRISE]: 2 };

/** Numeric rank for a tier name. Unknown names sort as the most restrictive, not the least. */
function rank(tier: string): number {
  return TIER_RANK[tier] ?? Math.max(...Object.values(TIER_RANK));
}

/** Every tier name a caller at `tier` is allowed to read. Becomes an IN clause. */
export function visibleTiers(tier: string): string[] {
  const ceiling = rank(tier);
  return Object.keys(TIER_RANK).filter((name) => TIER_RANK[name] <= ceiling);
}

/** The tier this deployment reads at. */
export function currentTier(): string {
  const configured = (process.env.GEOTHRIVE_TIER ?? '').trim().toLowerCase();
  return configured in TIER_RANK ? configured : BASIC;
}
