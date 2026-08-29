/**
 * The GeoThrive grid, read straight from Postgres (server-side only).
 *
 * This used to be an HTTP client. Every call went to a FastAPI service on Railway, which held
 * a connection pool open against the grid database and handed back JSON. That service was a
 * proxy, and the hop cost a cold start, a second set of credentials, and a second thing to
 * keep alive. The grid now lives in Supabase, which a Vercel function can reach directly, so
 * the queries moved here and the proxy went away.
 *
 * The module boundary did not move. Every export below returns exactly the shape the FastAPI
 * route returned, because the route handlers under app/api/grid and the components that call
 * them were written against those payloads. Field names stay snake_case for the same reason,
 * they are wire format rather than TypeScript convention.
 *
 * Two rules carried over from the Python and still hold.
 *
 * 1. Tier filtering happens in SQL, never in JavaScript. `visibleTiers()` becomes an IN clause
 *    on cell_attributes.min_tier, so a restricted layer is not fetched and then discarded, it
 *    is never read. The withheld count is a separate aggregate for the same reason.
 *
 * 2. Geometry crosses the boundary as GeoJSON produced by PostGIS, not reassembled here. One
 *    serialiser, and it is the one that knows the SRID.
 *
 * The connection is read-only twice over, on the server. The `substrate_ro` role holds SELECT
 * and nothing else, and carries `default_transaction_read_only = on` as a role default. Both
 * are server-side, so neither depends on this file remembering anything.
 */

import { latLngToCell, gridDisk } from 'h3-js';
import { type SQL, sql } from 'drizzle-orm';

import { db } from './db/client';
import { currentTier, visibleTiers } from './tiers';

/**
 * Cap on /cells. A bbox over the whole country would otherwise try to serialise all 32,683
 * hexagons into one response. The `count` field lets a client see it was capped.
 */
const MAX_BBOX_FEATURES = 2000;

interface Attribute {
  layer_key: string;
  value: unknown;
  source: string | null;
  license_class: string;
  min_tier: string;
  fetched_at: string;
}

interface Score {
  model_key: string;
  score: number;
  components: unknown;
  computed_at: string;
}

export interface Cell {
  h3: string;
  resolution: number;
  region: string | null;
  centroid: [number, number];
  boundary: [number, number][];
  attributes: Attribute[];
  withheld: number;
  scores: Score[];
  tier: string;
}

interface Feature {
  type: 'Feature';
  geometry: unknown;
  properties: {
    h3: string;
    resolution: number;
    region: string | null;
    score: number | null;
    model_key: string | null;
  };
}

export interface FeatureCollection {
  type: 'FeatureCollection';
  features: Feature[];
  count: number;
}

export interface Snapshot {
  h3: string;
  region: string | null;
  centroid: [number, number];
  score: number | null;
  model_key: string | null;
  neighbour_count: number;
  neighbour_mean_score: number | null;
  percentile: number | null;
  attributes: Attribute[];
  withheld: number;
  tier: string;
}

export interface Health {
  status: string;
  datasource: string;
  datasources: {
    name: string;
    location: string;
    read_only: boolean;
    configured: boolean;
    description: string;
  }[];
  database: boolean;
  postgis: string | null;
  cells: number;
  auth: string;
}

/**
 * Thrown when a hexagon is not in the grid.
 *
 * The route handlers map an error containing "404" onto a 404 response, which is how they
 * behaved when the message was an upstream HTTP status. Keeping that substring in the message
 * means the handlers did not have to change.
 */
class NotInGrid extends Error {
  constructor(index: string) {
    super(`404: cell ${index} is not in the grid`);
    this.name = 'NotInGrid';
  }
}

/**
 * A list of values as a comma-separated set of bound parameters, for an IN clause.
 *
 * Not `= ANY($1::text[])`. postgres.js binds a JavaScript array as a Postgres array of an
 * inferred element type, and casting that parameter inside the statement fails at bind time
 * rather than at parse time, so the error arrives as an opaque "failed query" with no hint of
 * which parameter was wrong. One placeholder per value is plainer and lets Postgres infer each
 * type from the column it is compared against.
 */
function list(values: readonly (string | number)[]): SQL {
  return sql.join(
    values.map((value) => sql`${value}`),
    sql`, `,
  );
}

/** postgres.js returns numeric columns as strings so precision survives. Parse at the edge. */
function num(value: unknown): number {
  return typeof value === 'number' ? value : Number(value);
}

/**
 * A timestamptz as an ISO 8601 string, whatever the driver handed back.
 *
 * postgres.js parses some timestamp columns into Date and leaves others as the raw Postgres
 * text, which is space-separated and offset-suffixed rather than ISO. These payloads have
 * always carried ISO strings, so both shapes are normalised rather than leaking a format that
 * depends on how a type happened to be inferred.
 *
 * The text branch is rewritten rather than round-tripped through Date on purpose. Postgres
 * stores microseconds and a JavaScript Date holds milliseconds, so parsing and reformatting
 * silently truncates the last three digits of every timestamp.
 */
function iso(value: unknown): string {
  if (value instanceof Date) return value.toISOString();
  return String(value)
    .replace(' ', 'T')
    .replace(/\+00(:00)?$/, 'Z');
}

interface CellRow {
  resolution: number;
  region: string | null;
  centroid: [number, number];
  boundary: [number, number][];
}

/**
 * A cell's own row: shape and metadata together, or null if it is not in the grid.
 *
 * Geometry and metadata are fetched in one statement rather than two because the round trip is
 * the expensive part. The database is in Frankfurt and the function asking is not, so a query
 * split in half costs roughly twice as much wall clock as it saves in bytes.
 */
async function cellRow(index: string): Promise<CellRow | null> {
  const rows = await db().execute<{
    resolution: number;
    region: string | null;
    centroid: string;
    boundary: string;
  }>(sql`
    SELECT resolution, region,
           ST_AsGeoJSON(centroid) AS centroid,
           ST_AsGeoJSON(geom) AS boundary
    FROM geothrive.h3_cells
    WHERE h3 = ${index}
  `);
  const row = rows[0];
  if (!row) return null;
  return {
    resolution: row.resolution,
    region: row.region,
    centroid: JSON.parse(row.centroid).coordinates,
    boundary: JSON.parse(row.boundary).coordinates[0],
  };
}

/**
 * Every attribute this tier may read, plus a count of the ones it may not.
 *
 * Two queries on purpose. The withheld count is computed by a separate aggregate rather than
 * by fetching everything and subtracting, because fetching a row you are not allowed to see in
 * order to count it defeats the point of gating in SQL. Neither statement can return a value
 * above the caller's tier, which is a property you can read off the WHERE clauses.
 */
async function attributesFor(
  index: string,
  tier: string,
): Promise<{ attributes: Attribute[]; withheld: number }> {
  const allowed = visibleTiers(tier);
  const [rows, counted] = await Promise.all([
    db().execute<{
      layer_key: string;
      value: unknown;
      source: string | null;
      license_class: string;
      min_tier: string;
      fetched_at: unknown;
    }>(sql`
      SELECT layer_key, value, source, license_class, min_tier, fetched_at
      FROM geothrive.cell_attributes
      WHERE h3 = ${index} AND min_tier IN (${list(allowed)})
      ORDER BY layer_key
    `),
    db().execute<{ withheld: string }>(sql`
      SELECT count(*) AS withheld
      FROM geothrive.cell_attributes
      WHERE h3 = ${index} AND min_tier NOT IN (${list(allowed)})
    `),
  ]);

  return {
    attributes: rows.map((row) => ({
      layer_key: row.layer_key,
      value: row.value,
      source: row.source,
      license_class: row.license_class,
      min_tier: row.min_tier,
      fetched_at: iso(row.fetched_at),
    })),
    withheld: Number(counted[0]?.withheld ?? 0),
  };
}

/** Weight scores for a cell. Not tier-gated, the derived score is what GeoThrive sells. */
async function scoresFor(index: string): Promise<Score[]> {
  const rows = await db().execute<{
    model_key: string;
    score: string;
    components: unknown;
    computed_at: unknown;
  }>(sql`
    SELECT model_key, score, components, computed_at
    FROM geothrive.cell_scores
    WHERE h3 = ${index}
    ORDER BY computed_at DESC
  `);
  return rows.map((row) => ({
    model_key: row.model_key,
    score: num(row.score),
    components: row.components,
    computed_at: iso(row.computed_at),
  }));
}

/** Every hexagon intersecting a bounding box, as GeoJSON. Capped at 2000 features. */
export async function gridCells(bbox: string): Promise<FeatureCollection> {
  const parts = bbox.split(',').map(Number);
  if (parts.length !== 4 || parts.some(Number.isNaN)) {
    throw new Error('bbox must be four numbers: min_lng,min_lat,max_lng,max_lat');
  }
  const [minLng, minLat, maxLng, maxLat] = parts;

  // ST_MakeEnvelope plus ST_Intersects is what the GiST index on geom exists for. The LEFT
  // JOIN on scores keeps unscored cells in the result, because a hole in the map is a worse
  // answer than a hexagon with a null score.
  const rows = await db().execute<{
    h3: string;
    resolution: number;
    region: string | null;
    geometry: string;
    score: string | null;
    model_key: string | null;
  }>(sql`
    SELECT c.h3, c.resolution, c.region,
           ST_AsGeoJSON(c.geom) AS geometry,
           s.score, s.model_key
    FROM geothrive.h3_cells c
    LEFT JOIN geothrive.cell_scores s ON s.h3 = c.h3
    WHERE ST_Intersects(c.geom, ST_MakeEnvelope(${minLng}, ${minLat}, ${maxLng}, ${maxLat}, 4326))
    ORDER BY c.h3
    LIMIT ${MAX_BBOX_FEATURES}
  `);

  // Source layers are deliberately absent here. A bbox response is a map, and shipping
  // licensed layers by the thousand is exactly the redistribution the licence forbids. Fetch
  // gridCell() for a specific hexagon.
  const features: Feature[] = rows.map((row) => ({
    type: 'Feature',
    geometry: JSON.parse(row.geometry),
    properties: {
      h3: row.h3,
      resolution: row.resolution,
      region: row.region,
      score: row.score === null ? null : num(row.score),
      model_key: row.model_key,
    },
  }));

  return { type: 'FeatureCollection', features, count: features.length };
}

/** One hexagon with its full layer stack and score. */
export async function gridCell(h3: string): Promise<Cell> {
  const cell = await cellRow(h3);
  if (cell === null) throw new NotInGrid(h3);

  const tier = currentTier();
  const [layers, scores] = await Promise.all([attributesFor(h3, tier), scoresFor(h3)]);

  return {
    h3,
    resolution: cell.resolution,
    region: cell.region,
    centroid: cell.centroid,
    boundary: cell.boundary,
    attributes: layers.attributes,
    withheld: layers.withheld,
    scores,
    tier,
  };
}

export interface CorridorCell {
  h3: string;
  region: string | null;
  centroid: [number, number];
  score: number | null;
  tag: string | null;
}

/**
 * Many hexagons at once, by index, with only the fields a route profile needs.
 *
 * This exists because the corridor route samples up to 60 points along a line. Against the old
 * HTTP client that was 60 requests, which was tolerable only because they went out in parallel
 * to a service with its own connection pool. A serverless function holds a pool of one, so the
 * same shape here would serialise into 60 round trips and time out. One query with an array
 * parameter is the same work in a single trip.
 *
 * DISTINCT ON keeps the newest score per cell, matching what scoresFor() would have returned
 * first. Cells not in the grid are simply absent from the result, which is what lets the caller
 * count how many samples missed.
 */
export async function gridCellsByIndex(indexes: string[]): Promise<Map<string, CorridorCell>> {
  if (indexes.length === 0) return new Map();

  const rows = await db().execute<{
    h3: string;
    region: string | null;
    centroid: string;
    score: string | null;
    components: { tag?: string } | null;
  }>(sql`
    SELECT DISTINCT ON (c.h3)
      c.h3, c.region, ST_AsGeoJSON(c.centroid) AS centroid, s.score, s.components
    FROM geothrive.h3_cells c
    LEFT JOIN geothrive.cell_scores s ON s.h3 = c.h3
    WHERE c.h3 IN (${list(indexes)})
    ORDER BY c.h3, s.computed_at DESC
  `);

  return new Map(
    rows.map((row) => [
      row.h3,
      {
        h3: row.h3,
        region: row.region,
        centroid: JSON.parse(row.centroid).coordinates as [number, number],
        score: row.score === null ? null : num(row.score),
        tag: row.components?.tag ?? null,
      },
    ]),
  );
}

/**
 * The Grid Snapshot payload for a point: score, percentile, neighbourhood context.
 *
 * A bare number is not a product. The comparison is the mean of the surrounding ring, and
 * where this cell sits in the whole loaded grid as a percentile. That is what makes the score
 * legible to someone who has never seen the weight model.
 */
export async function gridSnapshot(lat: number, lng: number, resolution = 6): Promise<Snapshot> {
  const index = latLngToCell(lat, lng, resolution);
  const cell = await cellRow(index);
  if (cell === null) throw new NotInGrid(index);

  const tier = currentTier();
  const [layers, scores] = await Promise.all([attributesFor(index, tier), scoresFor(index)]);

  const top = scores[0];
  const ring = gridDisk(index, 1).filter((neighbour) => neighbour !== index);

  // Neighbour stats and percentile in one round trip, keyed to the cell's own model so the
  // comparison is like for like. A cell with no score has nothing to compare, and the query is
  // skipped rather than run with a null model key.
  const stats = top
    ? (
        await db().execute<{
          neighbour_count: string;
          neighbour_mean: string | null;
          scored: string;
          below: string;
        }>(sql`
          SELECT
            (SELECT count(*) FROM geothrive.cell_scores
              WHERE h3 IN (${list(ring)}) AND model_key = ${top.model_key}) AS neighbour_count,
            (SELECT avg(score) FROM geothrive.cell_scores
              WHERE h3 IN (${list(ring)}) AND model_key = ${top.model_key}) AS neighbour_mean,
            (SELECT count(*) FROM geothrive.cell_scores
              WHERE model_key = ${top.model_key}) AS scored,
            (SELECT count(*) FROM geothrive.cell_scores
              WHERE model_key = ${top.model_key} AND score < ${top.score}) AS below
        `)
      )[0]
    : null;
  const scored = stats ? Number(stats.scored) : 0;

  return {
    h3: index,
    region: cell.region,
    centroid: cell.centroid,
    score: top ? top.score : null,
    model_key: top ? top.model_key : null,
    neighbour_count: stats ? Number(stats.neighbour_count) : 0,
    neighbour_mean_score:
      stats && stats.neighbour_mean !== null ? round(num(stats.neighbour_mean), 2) : null,
    percentile: stats ? (scored ? round((Number(stats.below) / scored) * 100, 1) : 0) : null,
    attributes: layers.attributes,
    withheld: layers.withheld,
    tier,
  };
}

function round(value: number, places: number): number {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}

/**
 * Liveness plus which datasource answered and how many cells it holds.
 *
 * Reports whether PostGIS is actually installed rather than just whether Postgres is up. A
 * database that answers but has no PostGIS fails every real query on this app, and that is
 * worth telling apart from a database that is down.
 *
 * The `datasources` array is kept, with one entry, because it is the field that says out loud
 * where the bytes are. AfriGIS terms and Kesh's own protocol require this data to stay on
 * South African infrastructure, Supabase has no African region, and the move to Frankfurt was
 * a deliberate call made with that constraint on the table. A health endpoint that quietly
 * stopped mentioning location would make this app the thing that misrepresents the position.
 */
export async function gridHealth(): Promise<Health> {
  const location = process.env.GEOTHRIVE_DB_LOCATION ?? 'Supabase eu-central-1 (Frankfurt)';

  let database = false;
  let postgis: string | null = null;
  let cells = 0;
  try {
    const rows = await db().execute<{ postgis: string | null; cells: string }>(sql`
      SELECT
        (SELECT extversion FROM pg_extension WHERE extname = 'postgis') AS postgis,
        (SELECT count(*) FROM geothrive.h3_cells) AS cells
    `);
    database = true;
    postgis = rows[0].postgis;
    cells = Number(rows[0].cells);
  } catch {
    database = false;
  }

  return {
    status: database ? 'ok' : 'degraded',
    datasource: 'sa',
    datasources: [
      {
        name: 'sa',
        location,
        read_only: true,
        configured: Boolean(process.env.DATABASE_URL),
        description: "The real 32,683-cell grid, mirrored from GeoThrive's SA Postgres. Read-only.",
      },
    ],
    database,
    postgis,
    cells,
    // No per-caller keys in this app. The tier is a deployment setting, so there is nothing to
    // enforce and nothing to bootstrap. Named rather than dropped so the field keeps meaning
    // something to anyone reading the old payload alongside this one.
    auth: `deployment tier: ${currentTier()}`,
  };
}
