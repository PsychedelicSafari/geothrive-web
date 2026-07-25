# GeoThrive Frontend

Next.js 16 App Router frontend for the Substrate / GeoThrive field scanner.

## What Runs Here

- `app/page.tsx` renders the field-scanner shell.
- `app/components/Explorer.tsx` owns the address search, map, marker, and
  weather report UI.
- `app/api/afrigis/*/route.ts` keeps AfriGIS calls server-side.
- `lib/afrigis.ts` handles AfriGIS OAuth token creation, token caching, and
  service requests.

The current app calls AfriGIS directly through server routes. Before production
traffic, move metered geocode/weather reads behind the planned PostGIS + H3
cache.

## Commands

```bash
bun install --frozen-lockfile
bun run dev
bun run format
bun run lint
bun run typecheck
bun run knip
bun run build
```

Use Bun only. Do not use npm, pnpm, or yarn.

## Environment

Create `.env.local` from `.env.example`:

```bash
cp .env.example .env.local
```

Fill in:

- `AFRIGIS_CLIENT_ID`
- `AFRIGIS_CLIENT_SECRET`
- `AFRIGIS_API_KEY`

Never commit real env files.

## Deployment Notes

Vercel should use this directory as the project root:

- Framework preset: Next.js
- Install command: `bun install --frozen-lockfile`
- Build command: `bun run build`

The root repository README contains the broader delivery workflow and production
release sequence.
