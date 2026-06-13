# Substrate (geothrive-web)

Frontend for **Substrate**, a geospatial caching layer.

## What this is

The app is a Next.js (App Router, TypeScript) frontend that renders a map and
queries geospatial data through a **cache**, not the live upstream API.

### Data layer

- **AfriGIS** is the upstream geospatial data source.
- A **PostGIS**-backed cache wraps AfriGIS and is indexed by **H3** hexagonal
  grid cells. The frontend reads from this cache for fast, bounded queries.
- The frontend never calls the live AfriGIS API directly. It talks to the
  cache, which is responsible for refreshing from AfriGIS.

No map feature is implemented yet. This repo is the clean scaffold (Next.js
app, tooling, CI, Vercel link). Map rendering and cache queries land in later
milestones.

## Repo layout

This repo is a monorepo. The deployable Next.js app lives in `frontend/`
(the Vercel root directory). The repo root holds CI config, this README, and
deploy config.

```
.
├── frontend/            # Next.js app (Vercel root directory)
│   ├── app/             # App Router pages
│   ├── .env.example     # AfriGIS placeholders (real .env is local, gitignored)
│   ├── oxlint.json      # linter
│   ├── .oxfmtrc.json    # formatter
│   ├── knip.json        # unused-dep checker
│   └── next.config.ts
└── .github/workflows/   # CI
```

## Local development

```bash
cd frontend
bun install
cp .env.example .env.local   # then fill in real AfriGIS credentials
bun run dev                  # http://localhost:3000
```

## Tooling

- Package manager: **Bun** (never npm/pnpm/yarn).
- Format: `bun run format` / `bun run format:fix` (oxfmt).
- Lint: `bun run lint` / `bun run lint:fix` (oxlint, no ESLint).
- Typecheck: `bun run typecheck` (tsgo).
- Unused deps: `bun run knip`.
- Build: `bun run build`.

## Deploy

Vercel. Project root directory is `frontend`, framework preset `nextjs`.
Preview deploys run on every PR via the GitHub integration. No custom domain
assigned yet.
