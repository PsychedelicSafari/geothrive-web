/**
 * GeoThrive Grid API client (server-side only).
 *
 * Talks to the FastAPI service that fronts GeoThrive's own Postgres in South Africa.
 * That database holds the real H3 grid: every hexagon carries 40-odd government and
 * AfriGIS layers plus a weight score derived from them.
 *
 * The API key never reaches the browser. Every call the map makes goes through a route
 * under /api/grid, which is the only place this module is imported.
 *
 * The `sa` datasource is the default on the API side and is read-only, so nothing here
 * can write to Kesh's server even by accident.
 */

const DEFAULT_BASE = 'https://api.psychedelicsafari.guide';

function baseUrl(): string {
  return process.env.GEOTHRIVE_API_BASE ?? DEFAULT_BASE;
}

function requireKey(): string {
  const key = process.env.GEOTHRIVE_API_KEY;
  if (!key) {
    throw new Error(
      'Missing required env var GEOTHRIVE_API_KEY. Copy .env.example to .env.local and fill it in.',
    );
  }
  return key;
}

/** One call to the grid API. Throws with the upstream body so route handlers can pass it on. */
async function call(path: string, params: Record<string, string> = {}): Promise<unknown> {
  const url = new URL(`${baseUrl()}${path}`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const res = await fetch(url, {
    headers: {
      'X-API-Key': requireKey(),
      // Explicit rather than relying on the server default, so a change of default
      // upstream cannot silently repoint this app at the sample grid.
      'X-GeoThrive-Datasource': 'sa',
    },
    // The grid is immutable between loads, so let Next cache identical bboxes briefly.
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`GeoThrive request to ${path} failed: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

/** Every hexagon intersecting a bounding box, as GeoJSON. Capped at 2000 features upstream. */
export async function gridCells(bbox: string): Promise<unknown> {
  return call('/cells', { bbox });
}

/** One hexagon with its full layer stack and score. */
export async function gridCell(h3: string): Promise<unknown> {
  return call(`/cell/${encodeURIComponent(h3)}`);
}

/** The hexagon containing a point. Resolution 6 is what the real grid is built at. */
export async function gridCellAt(lat: number, lng: number, resolution = 6): Promise<unknown> {
  return call('/cell', {
    lat: String(lat),
    lng: String(lng),
    resolution: String(resolution),
  });
}

/** The Grid Snapshot payload for a point: score, percentile, neighbourhood context. */
export async function gridSnapshot(lat: number, lng: number, resolution = 6): Promise<unknown> {
  return call('/snapshot', {
    lat: String(lat),
    lng: String(lng),
    resolution: String(resolution),
  });
}

/** Liveness plus which datasource answered and how many cells it holds. */
export async function gridHealth(): Promise<unknown> {
  return call('/health');
}
