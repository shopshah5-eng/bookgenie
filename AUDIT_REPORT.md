# BookGenie pipeline audit

Date: 2026-09-28
Branch: `arena/01a0e84c-bookgenie`

## Findings addressed

- Removed bundled example routes, demo book data, demo storage bucket/policy, demo links, demo cover/mockup assets, and dead showcase components.
- Removed mock text/image providers and every synthetic blueprint/chapter/page fallback from the live generation pipeline. Provider and persistence errors now fail the job and are written to Supabase.
- Made generation DB-only: books, jobs, pages, assets, versions, bookshelf responses, status, reader responses, revisions, saves, sharing, and exports no longer use process memory as a source of truth.
- Persisted Gemini base64 output and provider URL output as private Supabase `assets`, with signed URLs for reading and export.
- Added real cover and interior-image attachment to generated page blocks.
- Added image persistence to visual revisions as well as full generation.
- Embedded cover and interior image bytes into PDF and EPUB exports. Exporters remain deterministic and do not depend on a browser.
- Increased provider request windows to 25 seconds and retained explicit failure states instead of presenting placeholder success.
- Added an environment contract with no mock-generation switch.

## Current verification

- `npx tsc --noEmit` — passed after removing stale generated `.next` type references.
- `npm run verify` — passed; no bundled demo book or mock provider remains.
- Direct exporter fixture — passed: PDF has `%PDF-` magic bytes and EPUB contains both cover and interior image entries.
- `git diff --check` — passed.
- `npm run build` — passed; the route manifest contains no `/examples` route.
- Endpoint checks without environment — passed: `/examples` is 404, unknown book/shared IDs are 404, and anonymous create returns the expected configuration error.

## Deployment status

Production has not been proven from this checkout. No authenticated Supabase session, provider credentials, applied production migration, or deployed end-to-end create/poll/export test is available here. Do not claim authenticated generation is live until that test succeeds.

Before enabling users:

1. Apply migrations `001` through `004` to the production Supabase project.
2. Configure the private `assets` bucket and server-only service-role environment variable.
3. Configure `OPENROUTER_API_KEY`, `GEMINI_API_KEY`, `AI_IMAGE_PROVIDER`, OAuth redirect URLs, and canonical site URLs.
4. Test signup, authenticated create, every polling stage, a cover and interior asset, reader hydration, PDF/EPUB downloads, revision, share, and deletion with a real account.
5. Confirm failed provider and failed database writes become failed jobs and never completed books.
