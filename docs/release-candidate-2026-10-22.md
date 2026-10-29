# GeoThrive release candidate — 22 October 2026

The existing marketing redesign is preserved in commit `49e783c`. It includes the public site, `/explore`, Mapping Kiosk, news, tours and participation information. The 17 October review documents describe historical work; their uncommitted-state statements are superseded by this preservation commit.

## Security fix

Seven API error paths now return fixed public messages rather than provider, environment or database error text: autocomplete, geocode, weather, cells, cell details, snapshot and health. Error responses carry `Cache-Control: no-store`. A missing cell still returns 404, identified by the existing `NotInGrid` error type name; an unrelated upstream error containing `404` is treated as a service failure.

Eleven Bun regression cases exercise the real handlers with mocked provider/database modules, including preserved successful response/cache behavior and missing-input behavior. No new dependency was added. CI runs these tests before the existing quality gates. The test command disables automatic environment-file loading.

## Local validation

- 11 API regression cases passed, including 31 assertions.
- Format, lint, typecheck, Knip and production build passed on the candidate source. One formatting issue in the new test was corrected before the final format check.
- The production build generated the marketing routes, explorer and API handlers successfully.
- `git diff --check` passed.

These are local code/build checks. They do not establish live database connectivity, per-user licensed-data access, AfriGIS quota controls, reliable saved enquiries or production readiness. The contact form still prepares an email draft; it does not persist enquiries. No production deployment, main merge, DNS change, database change or live provider call was performed for these checks.

## Release path

Publish the development branch and review its draft pull request. Match CI results to the final head SHA. The Vercel connector currently exposes a personal team with no matching GeoThrive project; the intended owning project/team still needs verification before a remote Preview. Prepare the production decision and rollback plan only after Preview and real-flow verification, retaining existing GIS routes.
