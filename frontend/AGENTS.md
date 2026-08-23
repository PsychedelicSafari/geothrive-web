<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

## GeoThrive frontend

This is the frontend for GeoThrive, a geospatial caching layer. It renders a
map and queries a PostGIS-backed cache (indexed by H3 hex grids) that wraps
AfriGIS. The frontend talks to the cache, never the live AfriGIS API directly.

- Package manager: Bun only. Never npm/pnpm/yarn.
- Lint: oxlint (no ESLint). Format: oxfmt. Typecheck: tsgo. Unused deps: knip.
- Real env lives in `.env.local` (gitignored). See `.env.example` for the
  AfriGIS variables.
