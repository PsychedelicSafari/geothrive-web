/**
 * The `geothrive` schema, as Drizzle sees it.
 *
 * This is a description of tables that already exist, not a definition of them. The owner of
 * the schema is still Alembic over in apps/api/packages/core: those migrations built these
 * tables and they are what runs against Supabase. Drizzle here is a typed reader, and there
 * is deliberately no drizzle-kit config in this app, because two tools generating migrations
 * against one database is how you get a schema nobody can describe.
 *
 * Every table is declared under an explicit `pgSchema('geothrive')` rather than relying on a
 * search_path. Supabase fronts connections with Supavisor, which silently drops the `options`
 * startup parameter, so a search_path set on the connection string never arrives. Naming the
 * schema on every table sidesteps that entirely: the SQL says `geothrive.h3_cells` whatever
 * the session happens to be configured with.
 */

import {
  boolean,
  customType,
  integer,
  jsonb,
  numeric,
  pgSchema,
  smallint,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

/**
 * PostGIS geometry. Drizzle has no native mapping and does not need one: geometry only ever
 * leaves the database through ST_AsGeoJSON, so nothing here reads the raw column value. The
 * type exists so the column can be referenced in a where clause.
 */
const geometry = customType<{ data: string; driverData: string }>({
  dataType: () => 'geometry',
});

export const geothrive = pgSchema('geothrive');

export const h3Cells = geothrive.table('h3_cells', {
  h3: varchar('h3', { length: 20 }).primaryKey(),
  resolution: smallint('resolution').notNull(),
  region: varchar('region', { length: 80 }),
  geom: geometry('geom').notNull(),
  centroid: geometry('centroid').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull(),
});

export const cellAttributes = geothrive.table('cell_attributes', {
  id: integer('id').primaryKey(),
  h3: varchar('h3', { length: 20 }).notNull(),
  layerKey: varchar('layer_key', { length: 120 }).notNull(),
  value: jsonb('value').notNull(),
  source: varchar('source', { length: 120 }),
  licenseClass: varchar('license_class', { length: 32 }).notNull(),
  // The tier gate. Filtered in SQL, never in TypeScript: see lib/tiers.ts.
  minTier: varchar('min_tier', { length: 32 }).notNull(),
  fetchedAt: timestamp('fetched_at', { withTimezone: true }).notNull(),
});

export const cellScores = geothrive.table('cell_scores', {
  id: integer('id').primaryKey(),
  h3: varchar('h3', { length: 20 }).notNull(),
  modelKey: varchar('model_key', { length: 80 }).notNull(),
  // numeric(6,3). postgres.js hands numerics back as strings so precision survives the trip;
  // callers parse at the edge where the value becomes a number in a response.
  score: numeric('score', { precision: 6, scale: 3 }).notNull(),
  components: jsonb('components'),
  computedAt: timestamp('computed_at', { withTimezone: true }).notNull(),
});

export const apiKeys = geothrive.table('api_keys', {
  id: uuid('id').primaryKey(),
  keyHash: varchar('key_hash', { length: 64 }).notNull(),
  label: varchar('label', { length: 120 }).notNull(),
  tier: varchar('tier', { length: 32 }).notNull(),
  active: boolean('active').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
  lastUsedAt: timestamp('last_used_at', { withTimezone: true }),
});
