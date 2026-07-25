# Phased Delivery Plan

Last updated: 2026-07-25

This plan keeps GeoThrive changes small, reviewable, and deployable. Each phase
should land as its own branch or pull request unless the change is purely
mechanical.

## Phase 0: Sync And Baseline

Goal: make sure the local workspace matches GitHub and the current app is
healthy before changing behavior.

- Sync `main` from `PsychedelicSafari/geothrive-web`.
- Create a scoped branch with the `codex/` prefix.
- Install with `bun install --frozen-lockfile` from `frontend/`.
- Run `bun run format`, `bun run lint`, `bun run typecheck`, `bun run knip`,
  and `bun run build`.
- Record any setup or deployment milestone in `.setup-state.json`.

Exit criteria: local checks pass and the branch starts from the latest
`origin/main`.

## Phase 1: Current Scanner Stabilization

Goal: improve the existing AfriGIS field-scanner experience without changing
the backend shape.

- Tighten address-search empty, loading, and error states.
- Add better mobile spacing for the search dropdown, map, and field report.
- Guard malformed AfriGIS responses at the route-handler boundary.
- Add lightweight API smoke tests or route-level fixtures when the test stack is
  introduced.
- Keep live AfriGIS calls behind server routes only.

Exit criteria: the existing live geocode, map marker, and weather report still
work in local dev and Vercel preview.

## Phase 2: Cache Layer Foundation

Goal: stop the frontend from depending on live upstream AfriGIS calls for repeat
reads.

- Define the PostGIS schema for geocode results, weather stations, forecasts,
  request metadata, and refresh timestamps.
- Add H3 cell indexing for coordinate-based weather lookups.
- Introduce server-side cache lookup and refresh services.
- Keep AfriGIS credentials scoped to server runtime environments.
- Add cache-miss and upstream-failure behavior before routing UI traffic through
  the cache.

Exit criteria: API routes can read from cache first and refresh from AfriGIS only
when needed.

## Phase 3: Operational Safeguards

Goal: make quota, secrets, and failure modes visible before broader release.

- Add structured server logs around upstream calls and cache refreshes.
- Track AfriGIS quota-sensitive call paths.
- Add clear user-facing messages for missing credentials, upstream failure, and
  no-result states.
- Document secret rotation and required Vercel env vars.

Exit criteria: a maintainer can diagnose whether a failure is UI, cache,
credential, quota, or upstream related.

## Phase 4: Preview Deployment

Goal: validate each change in a production-like environment before merge.

- Push the branch to GitHub.
- Open a pull request.
- Wait for GitHub CI to pass.
- Review the Vercel preview deployment.
- Smoke test address search, map fly-to, marker placement, and weather lookup.

Exit criteria: CI is green and the Vercel preview passes the smoke checklist.

## Phase 5: Production Release

Goal: merge only validated changes and verify the live deployment.

- Merge the pull request into `main`.
- Let the Vercel GitHub integration deploy production.
- Verify `https://geothrive-web.vercel.app`.
- Update `.setup-state.json` with the landed milestone, pull request, and commit.

Exit criteria: production reflects the intended change and the setup ledger is
current.

## Phase 6: Domain And Launch Readiness

Goal: prepare the app for a named public surface.

- Assign and verify the custom domain when ready.
- Confirm Vercel production env vars are complete.
- Run a final quota and cache review.
- Document rollback steps for the most recent release.

Exit criteria: the app has a stable domain, clear rollback path, and cache-backed
read behavior for real users.

## Change Protocol

For every code or deployment change:

```bash
git fetch origin main
git checkout main
git pull --ff-only origin main
git checkout -b codex/<phase-or-feature-name>
cd frontend
bun install --frozen-lockfile
bun run format
bun run lint
bun run typecheck
bun run knip
bun run build
```

Then commit, push, open a pull request, and use the Vercel preview as the
deployment checkpoint before merging.
