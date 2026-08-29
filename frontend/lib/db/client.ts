/**
 * The connection to Supabase, sized for serverless.
 *
 * Three settings here are not preferences, they are requirements of running Postgres behind
 * Supavisor from Vercel functions.
 *
 * `prepare: false`. Supabase's transaction pooler (port 6543) multiplexes many clients onto
 * far fewer backends, so a prepared statement created on one request is not there on the
 * next. postgres.js prepares by default and would fail intermittently, which is worse than
 * failing consistently.
 *
 * `max: 1`. A Vercel function instance serves one request at a time, so a pool of one is the
 * whole pool it can use. Anything larger just holds Supabase backends open across the free
 * tier's connection budget for no gain.
 *
 * Module-scope, not per-request. Instances are reused between invocations, so the socket
 * survives a warm start and most requests skip the TLS handshake entirely.
 *
 * The fourth setting is not in this file. `vercel.json` pins functions to `fra1`, because the
 * database is in eu-central-1 and this module is now the thing that talks to it. Left on the
 * default us-east-1, every round trip below pays an Atlantic crossing, which spends the whole
 * latency budget on geography. That was free when a service in Amsterdam did the querying and
 * this app made one HTTP call; it is not free now.
 *
 * Note what is NOT set here: search_path and default_transaction_read_only. Supavisor drops
 * the `options` startup parameter without erroring, so anything set that way is silently
 * ignored. Both live on the `substrate_ro` role instead (`ALTER ROLE ... SET ...`), which is
 * server-side state the pooler does honour, and every query in lib/grid.ts schema-qualifies
 * its tables anyway.
 */

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from './schema';

function connectionString(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      'Missing required env var DATABASE_URL. Point it at the Supabase transaction pooler ' +
        '(aws-0-<region>.pooler.supabase.com:6543) as the substrate_ro role. See .env.example.',
    );
  }
  return url;
}

// Lazy, so importing this module in a build step that has no DATABASE_URL does not throw.
// Next collects route handlers at build time and would otherwise fail the build rather than
// the request.
let cached: ReturnType<typeof drizzle<typeof schema>> | undefined;

export function db(): ReturnType<typeof drizzle<typeof schema>> {
  if (!cached) {
    const client = postgres(connectionString(), {
      prepare: false,
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10,
      // Visible in Supabase's pg_stat_activity, so a runaway connection can be traced to this
      // app rather than to "some pooler client".
      connection: { application_name: 'geothrive-web' },
    });
    cached = drizzle(client, { schema });
  }
  return cached;
}
