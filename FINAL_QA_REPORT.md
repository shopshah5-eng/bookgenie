# Current QA status

Date: 2026-09-28

- TypeScript: passing (`npx tsc --noEmit`)
- Production surface check: passing (`npm run verify`)
- Binary exporter fixture: passing for PDF header and EPUB cover/interior image entries
- Bundled demo routes, book data, links, assets, storage bucket, and mock providers: removed
- Authenticated generation: requires real Supabase, AI provider environment variables, applied migrations, and an end-to-end account test
- Production deployment: not verified from this environment
- Production build: passing (`npm run build`)
- Endpoint smoke checks without environment: passing (`/examples` 404, unknown book/shared IDs 404, anonymous create 503)
- Lint: still reports existing legacy UI debt; it is not clean
