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

Vercel, project `geothrive-web` in the `psychedelic-safari` team. Root
directory is `frontend`, framework preset `nextjs`. Push to `main` deploys to
production. Every PR gets a preview URL through the GitHub integration.

Serves `geothrive.psychedelicsafari.guide`.

## Where this repo lives

This repo is public on purpose. Vercel only checks the commit author on private
repos, so a private repo here would block every push from anyone who is not the
Vercel account owner. Public means both of us can push and it just deploys, with
previews, at no cost.

The app code is public. The research, context and notes are not. Those live in
the private `PsychedelicSafari/geothrive` repo, which clones this one into
`apps/web`. Work on the app here. Nothing sensitive belongs in this repo.
