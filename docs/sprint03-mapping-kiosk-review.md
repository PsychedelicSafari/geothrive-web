# GeoThrive Africa — Sprint 03 development review

Later changes: [Brand, partnership and News review](brand-refresh-review.md) supersedes the earlier colour, logo and News status recorded below.

17 October 2026. Local development only; approval is required before any release.

## Development baseline

- Repository: `PsychedelicSafari/geothrive-web`.
- Reference commit: `e55de9c7f40f080fa81fca1c4adcf803548c5095`.
- Branch: `codex/frontend-migration`.
- Isolated worktree: `C:\Users\kg\.codex\worktrees\geothrive-frontend\Kshetra 2`.
- All frontend work remains uncommitted and unpushed. The index has no staged changes.
- The original checkout remains on `codex/phased-delivery-setup`, commit `fd72e6cb1632b7abee9632dad9398e750c8e2b40`, with its pre-existing changes preserved.
- No production deployment, DNS, Vercel setting, Nginx setting, credential, permission or database schema was changed.

## Delivered behavior

The shared navigation contains Home, Services, H3 Explorer, Mapping Kiosk, Join the Grid, Tours and About, in that order. Mapping Kiosk has its own `/mapping-kiosk` route. `/portfolio` and `/contact` remain available. The current route is identified with `aria-current="page"`.

“Let's Talk” opens the public WhatsApp destination confirmed on the Safari website. The sticky header keeps desktop navigation available; mobile also has a persistent contact link. The mobile disclosure exposes all seven destinations, closes after selection and closes with Escape, returning focus to its button. No message was sent during testing.

The kiosk page provides the requested headline, introduction and five sections: mapping legacy, documented geography tools, the legacy application, four illustrated participatory workflows, and a transition to `/join`. The historical ESD partnership is qualified. No partner logo or PDF screenshot was republished.

Historical capabilities are attributed to the February 2025 guide. The legacy **green natural-capital model** and the Explorer’s **red weight scores** are explicitly distinguished. The new artwork is illustrative, not a rendering of proprietary source datasets.

The kiosk map is click-to-load. Before loading, no legacy iframe exists. After loading, it opens the actual external application. Closing removes the iframe. The launch button is always present, including before loading and in the error state. A permanent explanatory fallback remains visible because browsers do not reliably expose every cross-origin framing failure to JavaScript.

`/join` explains the proposed participation model. It contains no registration form, inputs, submission API or login requirement. It does not promise complete African data residency. Consent, moderation, visibility, providers, storage and correction/removal arrangements remain prerequisites for future onboarding.

The other sprint content includes an attributed Tobler quotation and proximity illustration on the homepage, a revised H3 introduction, a professionally focused founder biography, a guided-experience service link, and `/tours` listing **C, D and E only**. Tour enquiries open a visitor-controlled WhatsApp draft; current prices and arrangements are confirmed through enquiry.

## Sources and limits

| Source | Used for | Limits |
| --- | --- | --- |
| `18 Feb2025_Mapping Kiosk_Tourism & Hopsitality (1).pdf`, 16 pages | Primary historical and functional reference | The inspected Downloads copy was SHA-256 identical to the attached PDF. Historical descriptions do not establish present availability or current publication/branding permission. |
| PDF p. 1–2 | Historical ESD partnership and September 2024 revision | No current endorsement asserted. |
| PDF pp. 2–10, 14 | Address/location, base maps, layers, natural capital, conservation, coastline and local-enterprise examples | No claim that all functions were tested live. |
| PDF pp. 11–13 | Marker, categorisation, submission, approval and specialist-assessment workflow | No submission or personal-data collection was tested. |
| [Psychedelic Safari](https://psychedelicsafari.guide/) | C: The Green Door; D: The Peninsula Side Quest; E: The Full Quest; public WhatsApp destination | Checked 17 October 2026. No invented availability, booking confirmation or prices. |
| [Safari About](https://psychedelicsafari.guide/about) | Founder’s professional background and geography qualification | Public biography, not independent credential verification. |
| [Public LinkedIn profile](https://za.linkedin.com/in/kshetra) | GeoTripz, UNISA, adventure-tourism hotspot/mobile-knowledge research | Only a public indexed extract was available; the full profile was not accessible to the web fetcher. |
| [Waldo Tobler, 1970](https://doi.org/10.2307/143141) | First Law attribution | Proximity is explained as a tendency, not a universal causal rule. |
| [Cape Point photograph](https://www.goodfreephotos.com/south-africa/other-south-africa/landscape-at-cape-point-at-cape-of-good-hope-africa.jpg.php) | South African landscape | Rohan_Reddy via Good Free Photos, CC0. Credit and licence link included on page. |

The photo is stored locally as a 900 × 1200 WebP, 263,474 bytes, with responsive `next/image` sizing. Its original metadata is not carried into the derived asset. No new runtime dependency or remote-image configuration was needed.

## Iframe compatibility result

**Passed in the actual Codex in-app Chromium browser against a localhost parent origin.**

- The legacy URL returned HTTP 200.
- No `X-Frame-Options` or `Content-Security-Policy` header was returned on the tested HTML response.
- The browser rendered the legacy basemap, green grid and controls inside the iframe; no framing restriction was bypassed.
- The direct button opened `https://map-geotripz.afrigis.co.za/` in a separate browser tab with the Geotripz title.
- No location permission, CAPTCHA completion, contribution form, account login or data submission was performed.
- Local framing success is not a promise of compatibility with every future origin, browser or provider policy. Recheck on any approved Vercel preview before publication.
- Current partnership participation and permission to publish branding/embedded presentation still require owner confirmation before release. Development testing does not establish those rights.

## Quality checks

| Check | Result |
| --- | --- |
| `bun run format` | Passed |
| `bun run lint` | Passed without diagnostics |
| `bun run typecheck` | Passed |
| `bun run knip` | Passed dependency-usage/unused-code check |
| `bun run build` | Passed; all nine public page routes prerendered |
| `git diff --check` | Passed |
| Dependency manifest and Bun lockfile | Unchanged; no dependency upgrade |

These are the repository’s existing checks. Knip checks dependency usage; it is not a vulnerability scan.

Browser verification used the built application behind a separate localhost QA proxy. The proxy is outside the repository and intercepts `/api/*` with synthetic fixtures. It is not application code or a deployment change.

| Browser / route check | Evidence |
| --- | --- |
| Nine page routes | `/`, `/services`, `/explore`, `/mapping-kiosk`, `/join`, `/tours`, `/about`, `/contact`, `/portfolio`: HTTP 200 |
| Navigation | All requested paths, active markers and WhatsApp target inspected in the rendered DOM |
| Responsive kiosk and join | 320, 390, 768, 1024, 1200 and 1440px: no document horizontal overflow; one H1 per route |
| Mobile navigation | Open, select Join the Grid, automatic close, Escape and focus return passed |
| Participation privacy | Zero forms/inputs/textareas on `/join`; no registration request |
| Legacy map | Actual external iframe rendered; close removed iframe; direct button opened exact destination |
| H3 Explorer | 37 synthetic cells rendered; location preset, cell details, neighbour context and 3D toggle passed |
| Route profile | Synthetic 20km route, four samples, mean and chart rendered |
| Field scanner | Synthetic geocode selection, marker, station and forecast rendered |
| Browser console | No errors observed in the completed local application flow |

The fixture proxy recorded requests for grid cells, cell details, snapshot, corridor, geocode and weather. It forwarded **zero** requests from those application API routes to production. Public basemap tiles and the explicitly requested external legacy viewer used their normal public network resources.

No production DB connectivity or production data parity was claimed or retested. Existing deployment-tier licensed-data withholding, database clients, spatial routes, query logic and credentials remain untouched. Existing Explorer legend wording/counts are inherited from the reference implementation and were not independently audited in this UI sprint.

## Files and review map

- `frontend/lib/site.ts`: central navigation, public legacy URL, public WhatsApp URL.
- `frontend/app/components/site/SiteHeader.tsx`, `SiteFooter.tsx`, `ContactBand.tsx`: navigation, mobile access and contact links.
- `frontend/app/(marketing)/mapping-kiosk/page.tsx`: sourced editorial kiosk page.
- `frontend/app/components/site/MappingKioskEmbed.tsx`: visitor-controlled external iframe and permanent fallback link.
- `frontend/app/components/site/MappingWorkflowVisual.tsx`: original illustrative workflow artwork.
- `frontend/app/(marketing)/join/page.tsx`: separate participation introduction.
- `frontend/app/(marketing)/tours/page.tsx`: C/D/E offerings only.
- `frontend/app/(marketing)/services/page.tsx`: guided-experience service transition.
- `frontend/app/(marketing)/about/page.tsx`: sourced professional biography.
- `frontend/app/components/site/ToblerFeature.tsx`, marketing homepage: attributed geography feature.
- `frontend/app/components/HomeTabs.tsx`: Explorer introduction only; interaction/data flow retained.
- `frontend/app/sprint03.css`, root layout import: responsive styling for this sprint.
- `frontend/public/images/cape-point.webp`: optimised CC0 landscape photograph.
- `/portfolio`: retained route now leads readers to the dedicated kiosk page.

The previous migration’s locale fix in `GridExplorer.tsx` remains. There is no Sprint 03 edit to spatial API/database files or deployment configuration.

## Screenshots and machine-readable evidence

Artifacts are in `C:\Users\kg\.codex\visualizations\2026\10\17\01a1496c-683f-7733-8fbc-37cd95fa27d7`:

- `sprint03-kiosk-desktop.jpg`: desktop navigation and kiosk introduction, 1200px test viewport.
- `sprint03-kiosk-embed-desktop.jpg`: actual legacy iframe in the kiosk page.
- `sprint03-join-desktop.jpg`: separate participation page.
- `sprint03-kiosk-mobile.jpg`: mobile kiosk introduction, 390px test viewport.
- `sprint03-navigation-mobile.jpg`: expanded mobile navigation.
- `sprint03-join-mobile.jpg`: mobile participation page.
- `sprint03-tobler-desktop.jpg`: homepage geography feature.
- `sprint03-tours-grid-full-desktop.jpg`: complete owner-approved C/D/E experience descriptions and Grid activation positioning.
- `sprint03-responsive-results.json`: measured responsive checks.

## Approval and rollback

Review this isolated worktree before authorising a commit, push or preview deployment. No production promotion has occurred.

The original checkout provides an unchanged working baseline. The safest immediate rollback is to leave this development worktree unused and continue from the original checkout; no production rollback is needed. Preserve the current uncommitted work before removing any development changes. If the reviewed change is committed later, revert that specific commit for a traceable rollback. Do not reset or discard the original checkout’s local work.

Remaining release gates: review copy and current branding/embedding permission; approve the development changes; explicitly authorise any future commit, preview or deployment. Onboarding and production database-readiness improvements are separate exercises.

## Approved Tours copy follow-up

Kshetra supplied the full C, D and E descriptions and explicitly confirmed the WhatsApp number on 17 October 2026. The Tours page now uses that owner-provided copy, including the named starting point for The Green Door, the Peninsula narrative, The Full Quest optional arrangements and its seasonal/pre-booking requirement.

The page leads with “Read the landscape. Bring a Grid to life.” It presents the tours as Kshetra’s practical activation of a Grid through local knowledge, guiding skills and natural assets. A separate explanation connects this example to working with nearby guides and enterprises, sharing skills and shaping opportunities together. “Grid” is explained through place and relationships; no automated cross-grid service or new technical integration is claimed.

The Services introduction carries the same positioning. The existing public WhatsApp URL is retained with the owner’s confirmation recorded in its source comment. All three experience enquiries point to that number with the relevant tour name in a visitor-controlled draft.

Checks rerun after this update: format, lint, typecheck, Knip, build and Git whitespace validation all passed. Tours and Services returned HTTP 200. Browser checks confirmed exactly three experiences, their approved labels and paragraphs, correct WhatsApp targets, the Join the Grid transition and the Services-to-Tours transition. There were no console errors in the reviewed flow. Tours had one H1, zero forms/inputs/textareas and no document horizontal overflow at 320, 390, 768, 1024 and 1200px. The longer mobile descriptions use the full content width for readability.

New review artifacts in the same screenshot directory:

- `sprint03-tours-grid-desktop.jpg`: Grid positioning and desktop navigation.
- `sprint03-tours-grid-full-desktop.jpg`: complete updated Tours page.
- `sprint03-tours-grid-mobile.jpg`: mobile introduction.
- `sprint03-tours-green-door-mobile.jpg`: full Green Door copy on mobile.
- `sprint03-tours-copy-checks.json`: responsive measurements.

This follow-up changes Tours, its Services introduction, scoped presentation CSS and a public contact confirmation comment. It adds no runtime dependency and does not change spatial APIs, database connections, credentials or deployment settings. All work remains uncommitted on `codex/frontend-migration` for review.