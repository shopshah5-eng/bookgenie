# BookGenie

BookGenie is a Next.js publishing studio for the workflow **PROMPT → PLAN → GENERATE → DESIGN → DOWNLOAD**. Every user book, generation job, generated asset, and export is backed by Supabase; there are no bundled demo books or mock generation providers.

## Configure a real environment

A fresh checkout intentionally cannot create a book until the required services are configured. Copy the example file and fill in real values:

```bash
cp .env.example .env.local
```

Required values:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only; never expose it to the browser)
- `OPENROUTER_API_KEY` for planning, writing, and revision
- `GEMINI_API_KEY` when `AI_IMAGE_PROVIDER=gemini`
- `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_APP_URL`

Apply every SQL migration in `supabase/migrations/` to the same Supabase project. The migrations create the books, jobs, pages, assets, and private storage schema used by the authenticated pipeline.

`AI_IMAGE_PROVIDER=gemini` is the production image path. `AI_IMAGE_PROVIDER=pollinations` is also supported as an external provider; it is not a local or synthetic fallback. Provider failures are persisted as failed generation jobs and are never converted into generated-looking placeholder content.

## Development

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Sign in before using `/create`. The application has no anonymous book-creation path.

## Checks

```bash
npm run lint       # legacy UI lint debt may still be reported
npm run build      # production compilation and TypeScript check
npx tsc --noEmit   # type check only
```

Private book reads, status, revisions, saves, shares, and exports require a verified Supabase session belonging to the book owner. Shared publications are addressed only by generated share tokens.

## Deployment notes

Set the same environment variables in the hosting provider, configure the Supabase OAuth redirect URL to point to `/api/auth/callback`, and run all migrations before enabling generation. Never restore credentials from older revisions: a service-role key grants administrative database access and must be rotated if it was ever exposed.
