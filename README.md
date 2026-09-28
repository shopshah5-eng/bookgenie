# BookGenie

BookGenie is a Next.js publishing studio for the workflow **PROMPT → PLAN → GENERATE → DESIGN → DOWNLOAD**.

## Why a fresh checkout may look like it is not working

Authenticated generation is intentionally not usable until Supabase is configured. This repository must not contain Supabase keys or AI provider keys, so a fresh checkout can render the public/demo pages but cannot sign in or generate a user book until you add environment variables.

Copy the example file and fill in real values:

```bash
cp .env.example .env.local
```

Required values:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only; never expose it to the browser)
- `OPENROUTER_API_KEY` for live text generation
- `GEMINI_API_KEY` when `AI_IMAGE_PROVIDER=gemini`

Apply the SQL migrations in `supabase/migrations/` to the same Supabase project. The first migration creates the core schema and the later migrations add compatibility columns, public-form tables, and corrected grants.

For a local, zero-cost pipeline test only, set `GENERATION_MODE=mock`. Mock mode is not a production generation provider and should never be enabled for a deployed user-facing environment.

## Development

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Checks

```bash
npm run lint       # currently reports existing lint debt in legacy UI files
npm run build      # production compilation and TypeScript check
npx tsc --noEmit   # type check only
```

`npm run build` is the production readiness check. The API requires a configured authenticated Supabase session for private book operations; demo routes such as `/examples/ocean-wonders` work without signing in.

## Deployment notes

Set the same environment variables in the hosting provider, configure the Supabase OAuth redirect URL to point to `/api/auth/callback`, and run all migrations before enabling generation. Never restore the removed hardcoded keys from older revisions: a service-role key grants administrative database access and must be rotated if it was ever deployed or shared.
