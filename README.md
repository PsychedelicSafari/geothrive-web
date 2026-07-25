# Substrate / GeoThrive Web

Frontend for **Substrate**, a South Africa geospatial field scanner for the
GeoThrive workstream.

## Current State

The app is a Next.js App Router frontend in `frontend/`. It currently ships a
MapLibre field-scanner experience:

- Search a South African address through AfriGIS geocoding.
- Drop the selected result on an OpenStreetMap basemap.
- Fetch a three-day forecast from the nearest AfriGIS weather station.
- Keep all credentials server-side through Next.js route handlers.

The long-term production shape is still cache-backed: AfriGIS remains the
upstream source, while a PostGIS cache indexed by H3 cells should sit in front
of live AfriGIS calls before real traffic is introduced.

## Repo Layout

```text
.
|-- frontend/              # Deployable Next.js app; Vercel root directory
|   |-- app/               # App Router pages, components, and API routes
|   |-- lib/               # Server-side AfriGIS client
|   |-- .env.example       # Placeholder AfriGIS env vars
|   |-- bun.lock           # Bun lockfile
|   |-- oxlint.json        # Lint config
|   |-- .oxfmtrc.json      # Format config
|   |-- knip.json          # Unused dependency config
|   `-- next.config.ts
|-- .github/workflows/     # CI
|-- .setup-state.json      # Setup and deployment milestone ledger
|-- docs/                  # Delivery and deployment planning notes
`-- vercel.json            # Vercel project metadata/config hint
```

## Local Development

```bash
cd frontend
bun install --frozen-lockfile
cp .env.example .env.local
bun run dev
```

Open `http://localhost:3000`.

Required local and Vercel env vars:

- `AFRIGIS_CLIENT_ID`
- `AFRIGIS_CLIENT_SECRET`
- `AFRIGIS_API_KEY`

`AFRIGIS_CLIENT_NAME` is documented for humans, but the current client only
requires the three values above at runtime.

## Quality Gates

Run these from `frontend/` before opening or merging a change:

```bash
bun run format
bun run lint
bun run typecheck
bun run knip
bun run build
```

CI runs the same gates on pull requests and pushes to `main`.

## Deployment

Deployment target: Vercel.

- Vercel project: `geothrive-web`
- Vercel root directory: `frontend`
- Production URL: `https://geothrive-web.vercel.app`
- Package manager: Bun
- Install command: `bun install --frozen-lockfile`
- Build command: `bun run build`

Preview deploys should come from pull requests. Production deploys should come
from merges to `main` after CI and preview smoke checks pass.

## Phased Delivery Workflow

Use `docs/phased-delivery-plan.md` as the working sequence for upcoming code
and deployment changes. The short version:

1. Sync `main` and create a scoped branch.
2. Make one logical change per phase.
3. Run the quality gates locally.
4. Push the branch and review the Vercel preview.
5. Merge to `main` only after preview smoke checks pass.
6. Verify production and update `.setup-state.json` when a milestone lands.
