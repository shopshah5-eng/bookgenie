# 📚 BookGenie — Architecture, System Index & Developer Guide

> **Quick Reference for AI Agents & Developers**: Read this document first before inspecting individual source files. It maps the complete codebase, endpoints, database schema, and payment pipelines so you never need to scan from scratch.

---

## ⚡ Quick Start & Verification

```bash
npm run dev        # Launch local Next.js dev server at http://localhost:3000
npm run build      # Verify production compilation & TypeScript checks
npx tsc --noEmit   # Quick zero-overhead typecheck
```

- **Hosting & CI/CD**: Netlify linked to GitHub (`https://bookgenie-app.netlify.app`). Pushing to `master` automatically triggers a production deployment.
- **Git Remote**: `https://github.com/shopshah5-eng/bookgenie.git`

---

## 🗺️ High-Level Codebase Directory Map

```
book-genie/
├── app/                               # Next.js App Router (Pages & API routes)
│   ├── (public pages)/                # Home (/), /about, /features, /pricing, /help, /faq, /blog
│   ├── admin/                         # System Admin Dashboard (Whitelist protected)
│   ├── api/                           # Backend API handlers
│   │   ├── admin/                     # /api/admin/overview (System metrics & DB stats)
│   │   ├── auth/callback/             # Supabase OAuth redirect handler
│   │   ├── books/                     # Book CRUD, status, preview, regeneration & PDF/EPUB export
│   │   ├── ebooks/                    # Curated ebooks order, verification, & PDF downloads
│   │   ├── payments/razorpay/         # Subscription & one-time plan orders, verify, webhook
│   │   ├── subscription/upgrade/      # User plan upgrades & quota management
│   │   └── user/profile/              # User profile & plan entitlements
│   ├── book/[id]/                     # Book generation progress (/generating) & reader (/preview)
│   ├── create/                        # Interactive book creator wizard (Prompt -> Plan -> Generate)
│   ├── digital-blueprint/             # Standalone public sales & checkout page for curated eBooks
│   └── my-ebooks/                     # User bookshelf & exclusive curated library for shopshah5@gmail.com
├── components/                        # Reusable React components
│   ├── auth/                          # AuthModal, AuthContext (Supabase auth wrapper)
│   ├── create/                        # BookCreatorCard, GenerationProgressModal, BlueprintEditor
│   ├── ebooks/                        # CuratedEbooksSection, EbookCheckoutModal (Razorpay modal)
│   ├── home/                          # MinimalHeader, MinimalHero, MinimalPricing, FAQ, Features
│   ├── landing/                       # Navigation, Footer, Testimonials, Trust badges
│   ├── preview/                       # BookSpreadViewer, EditAssistantPanel, PageToolbar
│   └── reader/                        # BookReaderClient, SharedBookReaderClient (Flipbook view)
├── lib/                               # Core backend logic & services
│   ├── admin/                         # Admin authorization helper (ADMIN_EMAILS check)
│   ├── ai/                            # Multi-tier AI routing (OpenRouter, NVIDIA NIM, Gemini, Cost Controller)
│   ├── book/                          # Types, database persistence (server-books.ts), PDF generator (pdf-generator.ts)
│   ├── ebooks/                        # Catalog definitions (catalog.ts) & PDF builder (pdf-builder.ts)
│   ├── payments/                      # Plans (plans.ts) & Razorpay server utilities (razorpay.ts)
│   ├── supabase/                      # Supabase client, server, and service-role admin bindings
│   └── utils/                         # String sanitizers, formatters, cn class utility
├── public/                            # Static assets, vector icons, and book covers
│   └── images/ebooks/                 # High-resolution covers for Starter Kit & Profit Blueprint
└── supabase/migrations/               # Production PostgreSQL schema, RLS policies, tables
```

---

## 🔑 Key Features & Subsystems

### 1. Digital Products & Curated eBooks (`/digital-blueprint` & `/my-ebooks`)
- **The Two eBooks**:
  - `starter-kit` (**The First $100 Online — Free Starter Kit 2026 Edition**): 12 pages, free 1-click download via `/api/ebooks/download/starter-kit`.
  - `blueprint` (**The Digital Product Profit Blueprint 2026 Edition**): 96 pages, 34 chapters, ₹299 INR live Razorpay checkout via `/api/ebooks/create-order` and `/api/ebooks/verify-payment`.
- **Target User Rule**: In `app/my-ebooks/page.tsx`, the `CuratedEbooksSection` is displayed for **`shopshah5@gmail.com`** with VIP author privileges.
- **PDF Generation**: Deterministic, print-ready binary PDF generator built in `lib/ebooks/pdf-builder.ts` using `jsPDF`.

### 2. Live Payments & Razorpay Gateway (`lib/payments/`)
- **Live Credentials**: Configured in `.env.local` (`RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `NEXT_PUBLIC_RAZORPAY_KEY_ID`).
- **Signature Verification**: Server-side HMAC-SHA256 signature verification in `lib/payments/razorpay.ts`.
- **Currency**: `INR` for Indian domestic accounts; `amount` is passed in paise (e.g. ₹299 = `29900`).

### 3. AI Text & Image Generation Pipeline (`lib/ai/`)
- **Cost Controller (`lib/ai/cost-controller.ts`)**: Routes prompts according to user plan tier.
  - Free plan: `openrouter/free` or `meta-llama/llama-3.1-8b-instruct:free`
  - Standard plan: `deepseek/deepseek-chat`
  - Premium / Creator: `anthropic/claude-3.5-sonnet`
  - Zero-Cost Fallback: `meta/llama-3.2-11b-vision-instruct` via **NVIDIA NIM** (`lib/ai/nvidia.ts`).
- **Image Generation**: Driven by `GEMINI_API_KEY` (or Pollinations external fallback).

### 4. Authentication & Supabase Database (`lib/supabase/`)
- **Authentication**: Email/Password and OAuth managed via Supabase SSR client.
- **Admin Whitelist**: Configured via `ADMIN_EMAILS="shopshah5@gmail.com,saraitaj6@gmail.com"` in `.env.local`.
- **Key Tables**:
  - `books`: Master book records, user association, schema status (`planning`, `writing`, `ready`, etc.).
  - `pages`: Content blocks, page layout, text, and visual associations.
  - `purchases`: Plan purchases, ebook sales, Razorpay order and payment IDs.
  - `jobs`: Asynchronous generation progress tracking.

---

## 🚀 Deployment & Environment Variables

### Deploying to Production
When you run `git push origin master`:
1. GitHub receives the commit.
2. Netlify webhook immediately triggers the production build (`npm run build`).
3. Changes go live on `https://bookgenie-app.netlify.app` within 1–2 minutes.

### Required Environment Variables (Set in Netlify Dashboard & `.env.local`):
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
OPENROUTER_API_KEY=sk-or-v1-...
GEMINI_API_KEY=AQ...
RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=...
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_...
ADMIN_EMAILS="shopshah5@gmail.com,saraitaj6@gmail.com"
NEXT_PUBLIC_APP_URL="https://bookgenie-app.netlify.app"
```

---

## 🛠️ File-by-File Index

| File | Purpose |
| :--- | :--- |
| `app/my-ebooks/page.tsx` | Main user bookshelf. Renders curated books for `shopshah5@gmail.com`. |
| `app/digital-blueprint/page.tsx` | High-converting public sales & checkout page for both eBooks. |
| `components/ebooks/EbookCheckoutModal.tsx` | Interactive checkout modal: email capture &rarr; Razorpay popup &rarr; Thank You screen with instant PDF download. |
| `components/ebooks/CuratedEbooksSection.tsx` | Responsive cards showcasing the Starter Kit & Profit Blueprint with pricing. |
| `lib/ebooks/catalog.ts` | Canonical metadata, chapters, and pricing definitions for both ebooks. |
| `lib/ebooks/pdf-builder.ts` | Generates 12-page Starter Kit and 96-page Blueprint PDFs on demand. |
| `app/api/ebooks/create-order/route.ts` | Razorpay order creation endpoint (₹299 INR). |
| `app/api/ebooks/verify-payment/route.ts` | Verifies cryptographic payment signature & issues secure download token. |
| `app/api/ebooks/download/[slug]/route.ts` | Streams downloadable binary PDF files for both books. |
| `lib/payments/razorpay.ts` | Razorpay client initialization and signature verification helpers. |
| `lib/payments/plans.ts` | Plan tiers: `free`, `single`, `pro`, `creator`. |
| `lib/ai/pipeline.ts` | Core AI generation pipeline: Planning &rarr; Chapters &rarr; Visuals &rarr; Design. |
| `lib/book/pdf-generator.ts` | Full user-generated book PDF compiler. |
