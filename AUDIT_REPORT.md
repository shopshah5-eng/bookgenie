# BookGenie current audit

Date: 2026-09-28
Branch: `arena/01a0e84c-bookgenie`

## Why the project was not working

The repository could build, but the primary authenticated workflow could not be considered production-ready:

1. **A fresh checkout had no configuration contract.** Supabase and AI credentials were embedded in source as fallbacks, while no `.env.example` or setup instructions existed. The embedded Supabase service-role key was an administrative secret and had to be removed and rotated.
2. **The database migration and application disagreed.** Migration 002 revoked/granted permissions on legacy tables (`book_assets`, `generation_jobs`, and `source_uploads`) that do not exist. The API also queried `author`, `cover_url`, and `cover_image_url`, while `books` did not define those columns. Inserts/updates were being ignored, so books and covers could appear to generate and then disappear.
3. **Generation reported success without durable state.** Book/job writes were logged and ignored on failure, IDs/users had unsafe fallbacks, and the worker could leave a job in `processing` forever after an AI/database error. Serverless memory cannot be the source of truth.
4. **Several private APIs trusted missing authentication.** A private book could be fetched without a session, save/revision routes accepted unauthenticated requests, status could be queried for another job, and sharing had a fake in-memory success path.
5. **The default create form requested 36 pages while the free plan allows 16.** A new free user was rejected by the quota check before their first book could start.
6. **AI failures were silently converted into synthetic success.** Missing/failed OpenRouter/Gemini calls fell back to mock content even in live mode, which made a broken integration look like a completed book.
7. **The verification script did not run.** It imported TypeScript through native Node and crashed on the `@/lib` alias.

## Fixes made

- Removed embedded Supabase anon/service-role and OpenRouter credentials. Added environment-only configuration, `.env.example`, and setup documentation.
- Added migration `003_runtime_schema_and_rls_fixes.sql` for cover columns, contact/affiliate tables, and corrected owner-only RLS. Corrected migration 002 table names and grants.
- Made DB inserts/persistence errors fail explicitly; removed the hardcoded fallback user ID; persisted generation failure states.
- Secured private book reads, status, save, share, delete, and regenerate endpoints with a verified Supabase owner session.
- Removed the public shared-book ID lookup/filter injection path. Shared API/page responses now use opaque share-token lookup and strip user IDs, prompts/source material, and asset IDs.
- Made demo publications explicitly read-only and isolated from user APIs.
- Changed live AI providers to fail visibly when credentials/provider requests fail. Mock content is available only with `GENERATION_MODE=mock`.
- Started the create form within the free plan's 16-page limit.
- Added `tsx` and an `npm run verify` command so deterministic demo/PDF/EPUB checks execute successfully.
- Contact and affiliate forms no longer claim success when persistence fails.
- Paid plan selection no longer grants Creator/Pro entitlements without a payment provider/webhook; it returns `PAYMENT_NOT_CONFIGURED` until checkout is implemented.

## Verification performed

- `npx tsc --noEmit` — passed.
- `npm run build` — passed; all Next.js routes compiled.
- `npm run verify` — passed: demo integrity, PDF `%PDF-` header, EPUB zip header, slug resolution.
- `node scripts/test-endpoints.mjs` against the dev server — passed demo export, genuine 404s, form validation, and honeypot checks.
- Manual no-environment checks — public pages and demos return 200, unauthenticated create returns 401, unknown books return 404, and shared demo data masks `userId` as `verified-creator`.

## Required deployment steps

1. Rotate any Supabase service-role and OpenRouter keys that were ever used from the old source revision.
2. Copy `.env.example` to `.env.local` and set real values. Set the same values in Netlify/hosting environment variables.
3. Apply migrations `001`, `002`, and `003` to the connected Supabase project.
4. Configure Supabase email/Google redirect URLs for `/api/auth/callback` and test a real signup, create, poll, revision, share, and export flow.
5. Configure a real payment provider before enabling paid plan buttons.

## Remaining quality debt

- `npm run lint` still reports legacy UI lint debt (mostly explicit `any`, React effect guidance, unused imports, and unescaped JSX text). It is separate from the production build/typecheck and should be cleaned before enforcing lint in CI.
- Generated images are currently returned as provider URLs/base64 and are not yet consistently uploaded to the private `assets` storage bucket. A production worker should persist image bytes, sign private URLs, and record `assets`/`generation_usage` rows.
- The current generation advancement is poll-driven. A durable queue/worker is still needed for long-running books beyond the serverless request lifecycle.
- PDF/EPUB generation is deterministic and valid, but remote cover images can be omitted from EPUB when the image host is unreachable; the export still succeeds with text cover metadata.
