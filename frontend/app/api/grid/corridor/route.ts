import { NextResponse } from 'next/server';
import { gridCellAt } from '@/lib/geothrive';

// The profile along a route. Kesh's most-repeated ask, in his words: "my safari starts at
// point A, it ends at point B and I'm going across ... give me the information along the way".
//
//   GET /api/grid/corridor?from=18.42,-33.92&to=31.56,-23.31
//
// Samples evenly along the great circle between the two points, resolves the hexagon under
// each sample, and returns them in travel order with duplicates collapsed. Sampling beats
// asking PostGIS for a corridor intersect because it needs no new endpoint upstream and the
// sample step is already finer than a resolution 6 hexagon is wide.

/** Resolution 6 hexagons are ~7 km across, so ~5 km steps cannot skip one. */
const STEP_KM = 5;
const MAX_SAMPLES = 60;
const EARTH_RADIUS_KM = 6371;

const toRad = (deg: number): number => (deg * Math.PI) / 180;
const toDeg = (rad: number): number => (rad * 180) / Math.PI;

function haversineKm(a: [number, number], b: [number, number]): number {
  const [lng1, lat1] = a;
  const [lng2, lat2] = b;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

/** Great-circle interpolation. Straight lat/lng lerp drifts badly over a country this wide. */
function interpolate(a: [number, number], b: [number, number], t: number): [number, number] {
  const [lng1, lat1] = a.map(toRad) as [number, number];
  const [lng2, lat2] = b.map(toRad) as [number, number];
  const d = haversineKm(a, b) / EARTH_RADIUS_KM;
  if (d === 0) return a;

  const A = Math.sin((1 - t) * d) / Math.sin(d);
  const B = Math.sin(t * d) / Math.sin(d);
  const x = A * Math.cos(lat1) * Math.cos(lng1) + B * Math.cos(lat2) * Math.cos(lng2);
  const y = A * Math.cos(lat1) * Math.sin(lng1) + B * Math.cos(lat2) * Math.sin(lng2);
  const z = A * Math.sin(lat1) + B * Math.sin(lat2);
  return [toDeg(Math.atan2(y, x)), toDeg(Math.atan2(z, Math.hypot(x, y)))];
}

function parsePoint(raw: string | null, name: string): [number, number] {
  if (!raw) throw new Error(`Missing required ?${name} parameter, expected "lng,lat"`);
  const parts = raw.split(',').map(Number);
  if (parts.length !== 2 || parts.some(Number.isNaN)) {
    throw new Error(`?${name} must be "lng,lat"`);
  }
  return [parts[0], parts[1]];
}

type CellLike = {
  h3: string;
  region: string | null;
  centroid: [number, number];
  scores?: unknown[];
};

export async function GET(request: Request): Promise<NextResponse> {
  const params = new URL(request.url).searchParams;

  let from: [number, number];
  let to: [number, number];
  try {
    from = parsePoint(params.get('from'), 'from');
    to = parsePoint(params.get('to'), 'to');
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }

  const distanceKm = haversineKm(from, to);
  const samples = Math.max(2, Math.min(MAX_SAMPLES, Math.ceil(distanceKm / STEP_KM)));
  const points = Array.from({ length: samples }, (_, i) =>
    interpolate(from, to, i / (samples - 1)),
  );

  // Concurrent, but the whole route is one upstream burst so keep it modest.
  const results = await Promise.allSettled(
    points.map(([lng, lat]) => gridCellAt(lat, lng) as Promise<CellLike>),
  );

  const seen = new Set<string>();
  const legs: Array<{
    h3: string;
    region: string | null;
    centroid: [number, number];
    score: number | null;
    tag: string | null;
    atKm: number;
  }> = [];

  results.forEach((result, index) => {
    if (result.status !== 'fulfilled') return;
    const cell = result.value;
    if (!cell?.h3 || seen.has(cell.h3)) return;
    seen.add(cell.h3);

    const first = (cell.scores?.[0] ?? null) as {
      score?: number;
      components?: { tag?: string };
    } | null;
    legs.push({
      h3: cell.h3,
      region: cell.region ?? null,
      centroid: cell.centroid,
      score: first?.score ?? null,
      tag: first?.components?.tag ?? null,
      atKm: Math.round((distanceKm * index) / (samples - 1)),
    });
  });

  const scored = legs.map((l) => l.score).filter((s): s is number => s !== null);

  return NextResponse.json({
    from,
    to,
    distanceKm: Math.round(distanceKm),
    sampled: samples,
    missed: results.filter((r) => r.status === 'rejected').length,
    cells: legs,
    meanScore: scored.length ? scored.reduce((a, b) => a + b, 0) / scored.length : null,
    bestCell: legs.reduce<(typeof legs)[number] | null>(
      (best, l) => (l.score !== null && (!best || l.score > (best.score ?? -1)) ? l : best),
      null,
    ),
  });
}
