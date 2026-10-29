# GeoThrive Africa frontend migration — development

Base: `e55de9c7f40f080fa81fca1c4adcf803548c5095` in `PsychedelicSafari/geothrive-web`.
Branch: `codex/frontend-migration`.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Commercial GeoThrive Africa homepage |
| `/services` | Spatial strategy, location intelligence, ESG/circular economy, regenerative places |
| `/portfolio` | H3 Explorer and existing public partner/case-study links |
| `/about` | Kshetra Govindasamy and the GeoThrive approach |
| `/contact` | Enquiry form that prepares a mailto draft; no submission service or persistence |
| `/explore` | Existing H3 Explorer and AfriGIS field scanner |

Marketing pages share a route-group layout. The explorer stays outside that group to preserve
its map theme. Marketing pages do not import MapLibre or call the GIS APIs. The map's
existing `/api/grid/*` and `/api/afrigis/*` paths remain unchanged.

## Infrastructure boundaries

The user confirmed `geothrive-web` in the `geothrive-africa` Vercel workspace is running the
base commit. The permanent website domain is planned as `geothrive.africa`; it currently
points to Ubuntu. Ubuntu serves `/geoserver/`, `/mapstore/` and `/afrikaburn2026/`.

No DNS, Nginx, Vercel settings, database structures, credentials, migrations or production
deployments are changed by this branch. No GIS service hostname is invented or configured.
Future website cutover requires a separately approved plan preserving those Ubuntu services
under a confirmed dedicated hostname. Matching database counts do not prove synchronization.

The existing health endpoint is retained. The separately discussed readiness-check patch is
not part of this frontend migration.

## Content and data

Homepage graphics are illustrative vector artwork, not source GIS datasets. Commercial copy
uses the existing GeoThrive Africa service positioning and public contact information. There
are no invented customer endorsements, prices, impact results or claims of automated sync.

No environment values are copied into this checkout. Real grid and AfriGIS requests need
operator-configured runtime credentials. Local checks without these cannot establish live
database parity, data access policies or provider availability. Existing score-band counts in
the explorer remain source snapshot constants and require a separate data-presentation review.

## Development validation

From `frontend/`, use Bun only:

```text
bun install --frozen-lockfile
bun run format
bun run lint
bun run typecheck
bun run knip
bun run build
```

Run a local preview to check the six routes, navigation, mobile menu, enquiry validation and
email-draft preparation. Do not click the final mailto link during automated checks. Without
runtime credentials, map API failures are expected; do not retrieve production secrets to
complete a visual test. Do not call the live AfriGIS routes for routine page checks.

## Rollback

Review and test this branch before any release. A future approved code rollback can restore
the previous application version; there is no database migration or infrastructure change to
reverse. Keep the original working checkout and its local work separate from this worktree.
