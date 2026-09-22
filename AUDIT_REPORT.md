# 📋 BOOKGENIE V1 — FULL QA, UX, DESIGN, SECURITY & PRODUCTION AUDIT REPORT

**Author**: Senior Staff Multi-Disciplinary Audit Team  
**Date**: September 2026  
**Repository**: `https://github.com/shopshah5-eng/bookgenie`  
**Live Target**: `https://bookgenie-app.netlify.app/`  
**Authoritative Standard**: BookGenie Final V1 Master Specification & Implementation Architecture  

---

## 1. Executive Summary

BookGenie V1 has been audited across all 50 dimensions specified in the Master Specification. The product demonstrates a strong aesthetic foundation rooted in luxury editorial publishing (Warm Ivory `#FDFBF7`, Charcoal Near-Black `#1A1612`, and Champagne Gold `#9A6F3C`). The primary user workflow (**PROMPT → PLAN → GENERATE → DESIGN → DOWNLOAD**) is clearly articulated and the public presentation is clean and well-structured.

However, the deep system audit revealed **3 P0 Critical Vulnerabilities**, **4 P1 Major Deficiencies**, **4 P2 Moderate Issues**, and **3 P3 Polish Items** that prevent BookGenie from meeting the strict production-readiness bar of the V1 Master Specification.

### Critical Summary Findings:
1. **Sharing Security Gap (P0)**: Sharing currently copies the author's private URL (`/book/[id]`). Anyone with the link is granted full access to the natural-language revision dock (`FloatingEditDock`) and can mutate the author's private book via `/api/books/[id]/regenerate`. There is no dedicated read-only `/shared/[token]` route.
2. **False Success State in Job Polling (P0)**: When a job is not found in memory, `GET /api/books/[id]/status` falsely returns `status: 'completed', progress: 100, stepsCompleted: ['Your Book Is Ready']`. This violates Rule 37 ("Never display 'Your book is ready' unless Book exists, pages exist, QC passed").
3. **In-Memory Volatility & UUID Database Mismatch (P0)**: Book and Job IDs are generated as non-UUID strings (`book-${timestamp}-...`), causing Supabase database inserts to fail silently. In serverless deployment (Netlify), generation states in memory are lost when containers recycle.
4. **Corrupted EPUB/PDF Exports (P1)**: The export endpoint returns an HTML string disguised as an EPUB file (`.epub`) without valid EPUB3 container/OPF structures, and returns an HTML download rather than a compiled PDF binary or dedicated print preview.
5. **Unprotected Revision Endpoint (P1)**: POST `/api/books/[id]/regenerate` lacks auth verification and fails to store recoverable snapshots in `public.book_versions`.

---

## 2. Issues Matrix by Severity

| Issue ID | Severity | Category | Summary | Production Blocker? |
| :--- | :--- | :--- | :--- | :--- |
| **ISSUE-01** | **P0** | Sharing & Security | Shared link leaks private authoring URL & revision dock; no `/shared/[token]` route | **YES** |
| **ISSUE-02** | **P0** | Job Lifecycle | Status polling API returns false "completed" state when job is missing | **YES** |
| **ISSUE-03** | **P0** | Database & Serverless | Non-UUID IDs cause Supabase insert failures; jobs/books lost on container recycle | **YES** |
| **ISSUE-04** | **P1** | Exports | EPUB export returns plain HTML instead of valid EPUB3 archive; PDF returns `.html` | **YES** |
| **ISSUE-05** | **P1** | Security & Versioning | `/api/books/[id]/regenerate` unprotected; no `public.book_versions` snapshots | **YES** |
| **ISSUE-06** | **P1** | Database & RLS | `public.books` RLS policy allows enumeration of all shared books across all users | **YES** |
| **ISSUE-07** | **P1** | Authentication | Password reset email links point to non-existent `/auth/callback` instead of `/api/auth/callback` | **YES** |
| **ISSUE-08** | **P2** | Mobile UX | Reader lacks touch/swipe navigation gestures | NO |
| **ISSUE-09** | **P2** | Reader Experience | Interior illustrated artwork blocks display icon placeholders instead of images | NO |
| **ISSUE-10** | **P2** | Mobile Layout | Expanded AI revision dock floats over center reading area on mobile instead of bottom sheet | NO |
| **ISSUE-11** | **P2** | Cost Control | `/api/books/[id]/regenerate` bypasses user plan quotas | NO |
| **ISSUE-12** | **P3** | Typography | Arbitrary typography sizes in reader; lacks fluid clamp scaling on mobile | NO |
| **ISSUE-13** | **P3** | Accessibility | Missing `aria-label` attributes and touch target constraints on reader controls | NO |
| **ISSUE-14** | **P3** | Auth Polish | Prototyping `localStorage` fallback remnants in `AuthModal` mask real Supabase errors | NO |

---

## 3. P0 — Critical Issues Detailed Specification

### ISSUE-01: Shared Route Insecurity & Private Authoring URL Leakage
- **ID**: `ISSUE-01`
- **Severity**: `P0 — Critical`
- **Category**: `Sharing & Security`
- **Current Behavior**:
  In `app/book/[id]/page.tsx` (L104), `handleShare` copies `${window.location.origin}/book/${id}` to the user's clipboard. There is no `/shared/[token]` route. Any visitor who opens the link is placed directly into the author's editing environment where the `FloatingEditDock` is active and functional.
- **Expected Behavior**:
  Sharing must be private by default. Creating a share link must generate an immutable public snapshot with an opaque token. Public visitors must access `/shared/[token]`, a dedicated read-only reader with NO revision dock, NO edit capabilities, and NO exposure of internal user IDs, private storage paths, or author account information. Edits to the private book must not mutate the shared version without explicit "Update Shared Version".
- **Why It Matters**:
  Severe authorization breach. Anyone with the URL can trigger unlimited AI revisions, alter the book's contents, and consume the author's quota and OpenAI/Gemini credits.
- **Exact File / Component / Route**:
  - `app/book/[id]/page.tsx`
  - `components/reader/FloatingEditDock.tsx`
  - Missing route: `app/shared/[token]/page.tsx`
- **Recommended Fix**:
  1. Create a dedicated public route `app/shared/[token]/page.tsx` that loads a snapshot from `public.books` where `share_token = token`.
  2. In `app/book/[id]/page.tsx`, generate/fetch the `share_token` and copy `${origin}/shared/${shareToken}`.
  3. Strip `FloatingEditDock`, private user IDs, and editing controls from `/shared/[token]`.
- **Affects Mobile**: Yes
- **Affects Security**: Yes (Critical)
- **Affects Production Readiness**: Yes (Blocker)

---

### ISSUE-02: False Success State in Job Polling
- **ID**: `ISSUE-02`
- **Severity**: `P0 — Critical`
- **Category**: `Job System & Generation Lifecycle`
- **Current Behavior**:
  In `app/api/books/[id]/status/route.ts` (L16-25), if a job is not found in memory, the route returns:
  ```json
  { "id": jobId, "status": "completed", "stage": "completed", "progress": 100, "stepsCompleted": ["Your Book Is Ready"] }
  ```
- **Expected Behavior**:
  If a job is missing or failed, the API must return a 404 or real failure state. It must never indicate `completed` unless the book and pages have been verified and persisted.
- **Why It Matters**:
  Directly violates Master Spec Rule 37 ("CRITICAL: Never display 'Your book is ready' unless Book exists, BookDocument exists, pages exist, required assets exist, QC passed, status = completed. Never show false success states."). In production, if a user refreshes or Netlify recycles the function container, the user is falsely told their book is ready, leading them to a broken or missing book.
- **Exact File / Component / Route**:
  `app/api/books/[id]/status/route.ts:L16-26`
- **Recommended Fix**:
  Query `public.jobs` in Supabase using `createAdminClient()`. If the job does not exist in the database, return `{ error: 'Job not found', status: 'not_found' }` with HTTP 404.
- **Affects Mobile**: Yes
- **Affects Security**: No
- **Affects Production Readiness**: Yes (Blocker)

---

### ISSUE-03: In-Memory Volatility & Database UUID Type Mismatch
- **ID**: `ISSUE-03`
- **Severity**: `P0 — Critical`
- **Category**: `Database & Serverless Architecture`
- **Current Behavior**:
  In `lib/ai/pipeline.ts` (L41-42), IDs are generated as:
  ```typescript
  const bookId = `book-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const jobId = `job-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  ```
  However, `supabase/migrations/001_initial_schema.sql` defines `books.id` and `jobs.id` as `uuid primary key`. Because these string prefixes are not valid UUIDs, the database insert throws an invalid input syntax error for type uuid. The error is silently swallowed in the `catch {}` block (L101-103), forcing the entire pipeline into `devBooksStore` and `devJobsStore` in memory.
- **Expected Behavior**:
  Generate RFC-compliant UUIDs (using `crypto.randomUUID()`) so books, pages, versions, and jobs are reliably persisted in PostgreSQL.
- **Why It Matters**:
  In serverless deployment (Netlify), in-memory stores are destroyed between function invocations. A user whose browser closes or who returns later cannot retrieve their book.
- **Exact File / Component / Route**:
  - `lib/ai/pipeline.ts:L41-42, L80-104`
  - `app/api/books/[id]/route.ts`
  - `app/api/books/create/route.ts`
- **Recommended Fix**:
  Use `crypto.randomUUID()` for all generated entity IDs, persist canonical `BookDocument` to `public.books`, `public.book_pages`, and `public.jobs`, and update `app/api/books/[id]/route.ts` to query Supabase directly.
- **Affects Mobile**: Yes
- **Affects Security**: Yes (Data persistence integrity)
- **Affects Production Readiness**: Yes (Blocker)

---

## 4. P1 — Major Issues Detailed Specification

### ISSUE-04: Fake EPUB and Non-PDF File Export
- **ID**: `ISSUE-04`
- **Severity**: `P1 — Major`
- **Category**: `Exports`
- **Current Behavior**:
  In `app/api/books/[id]/export/route.ts` (L155-175), requesting an EPUB returns an HTML string with a `.epub` file extension and Content-Type `application/epub+zip, text/html`. Requesting a PDF returns an HTML string with a `.html` file extension.
- **Expected Behavior**:
  - **EPUB3**: Must generate a valid EPUB3 archive (`application/epub+zip`) containing `mimetype`, `META-INF/container.xml`, `OEBPS/package.opf`, `OEBPS/toc.xhtml`, and XHTML chapters.
  - **PDF**: Must provide a dedicated, high-fidelity print-rendered document configured with `@media print` CSS, page breaks, margins, and automatic print trigger.
- **Why It Matters**:
  Users downloading an EPUB cannot read it in Apple Books, Kindle, or Kobo. It violates Master Spec Points 29 and 30.
- **Exact File / Component / Route**:
  `app/api/books/[id]/export/route.ts:L155-176`
- **Recommended Fix**:
  Implement a deterministic EPUB3 builder using a lightweight ZIP generator or standard packaging structure, and configure the print export with auto-print scripts and high-res print CSS.
- **Affects Mobile**: Yes
- **Affects Security**: No
- **Affects Production Readiness**: Yes (Blocker)

---

### ISSUE-05: Unprotected Natural-Language Revision Endpoint & Missing Version Snapshots
- **ID**: `ISSUE-05`
- **Severity**: `P1 — Major`
- **Category**: `Security & Versioning`
- **Current Behavior**:
  In `app/api/books/[id]/regenerate/route.ts`, the endpoint is completely open. Any caller can POST revision instructions without authentication. The resulting document is stored in an in-memory map without writing to `public.book_versions` or updating `public.books`.
- **Expected Behavior**:
  Authenticate caller using `createServerSupabaseClient()`, ensure `user_id` matches the book owner, check user quotas, write a full snapshot of the previous canonical `BookDocument` into `public.book_versions`, increment `version_number`, and persist the new state to Supabase.
- **Why It Matters**:
  Breaks Master Spec Point 25 ("Every revision must create a new version... Audit: book_versions. Each snapshot should be recoverable.") and allows unauthenticated denial-of-wallet attacks.
- **Exact File / Component / Route**:
  `app/api/books/[id]/regenerate/route.ts`
- **Affects Mobile**: Yes
- **Affects Security**: Yes (High)
- **Affects Production Readiness**: Yes (Blocker)

---

### ISSUE-06: Database RLS Leak on `is_shared` Books Query
- **ID**: `ISSUE-06`
- **Severity**: `P1 — Major`
- **Category**: `Database & RLS`
- **Current Behavior**:
  In `supabase/migrations/001_initial_schema.sql` (L222):
  ```sql
  create policy "books_select" on public.books for select using (auth.uid() = user_id or is_shared = true);
  ```
  Any authenticated or unauthenticated user executing a `select * from books` query can list all books in the database marked as `is_shared = true`, exposing private metadata and user IDs.
- **Expected Behavior**:
  Shared books must only be accessible when the specific `share_token` is provided in the query filter.
- **Why It Matters**:
  Violates Master Spec Point 14 ("A shared book must NOT expose: email, user ID, private uploads, internal storage paths, internal database IDs where avoidable. Prefer: /shared/[opaque-token]").
- **Exact File / Component / Route**:
  `supabase/migrations/001_initial_schema.sql:L221-226`
- **Recommended Fix**:
  Update RLS policy or provide an explicit security definer function `get_shared_book(p_token uuid)` to prevent table scanning of shared books.
- **Affects Mobile**: No
- **Affects Security**: Yes (High)
- **Affects Production Readiness**: Yes

---

### ISSUE-07: Broken Password Reset Callback Route in AuthModal
- **ID**: `ISSUE-07`
- **Severity**: `P1 — Major`
- **Category**: `Authentication`
- **Current Behavior**:
  In `components/auth/AuthModal.tsx` (L89), password reset triggers:
  ```typescript
  redirectTo: `${window.location.origin}/auth/callback?next=/create`
  ```
  The callback route in Next.js is `/api/auth/callback/route.ts`. Users clicking the reset link from their email receive a 404 Not Found error.
- **Expected Behavior**:
  `redirectTo` must target `${window.location.origin}/api/auth/callback?next=/create`.
- **Why It Matters**:
  Prevents users who forget their passwords from recovering their accounts.
- **Exact File / Component / Route**:
  `components/auth/AuthModal.tsx:L89`
- **Recommended Fix**:
  Change URL to `/api/auth/callback`.
- **Affects Mobile**: Yes
- **Affects Security**: Yes
- **Affects Production Readiness**: Yes

---

## 5. P2 — Moderate Issues Detailed Specification

### ISSUE-08: Missing Touch & Swipe Gestures in Reader
- **ID**: `ISSUE-08`
- **Severity**: `P2 — Moderate`
- **Category**: `Mobile UX & Gestures`
- **Current Behavior**:
  `app/book/[id]/page.tsx` provides keyboard arrow navigation for desktop and clickable next/prev buttons, but does not attach touch handlers (`onTouchStart`, `onTouchEnd`) to support horizontal swipe page turns on mobile devices.
- **Expected Behavior**:
  Swiping left advances to the next page; swiping right moves to the previous page with smooth page transition animations.
- **Why It Matters**:
  Fails Master Spec Point 11 & 26 ("Mobile Touch: Page navigation supports touch/swipe").
- **Exact File / Component / Route**:
  `app/book/[id]/page.tsx:L55-78`
- **Recommended Fix**:
  Add touch start and end coordinates detection to trigger `handleNextPage()` and `handlePrevPage()`.
- **Affects Mobile**: Yes
- **Affects Security**: No
- **Affects Production Readiness**: Yes

---

### ISSUE-09: Interior Illustrated Artwork Placeholders in Reader
- **ID**: `ISSUE-09`
- **Severity**: `P2 — Moderate`
- **Category**: `Reader Visual Design`
- **Current Behavior**:
  In `app/book/[id]/page.tsx` (L320-336), when rendering a block of type `image`, the UI renders a small placeholder icon and caption text rather than displaying the actual generated illustration URL or cover artwork.
- **Expected Behavior**:
  If the block or page has an associated image URL, render the high-resolution image with rounded corners, subtle warm border, and editorial caption.
- **Why It Matters**:
  The reader fails to convey the promised visual publishing experience.
- **Exact File / Component / Route**:
  `app/book/[id]/page.tsx:L320-337`
- **Recommended Fix**:
  Check for `block.assetId`, `block.url`, or `page.imageUrl` and render `<img src="..." />` with zoom/preview support.
- **Affects Mobile**: Yes
- **Affects Security**: No
- **Affects Production Readiness**: Yes

---

### ISSUE-10: Mobile Revision Dock Layout & Viewport Occlusion
- **ID**: `ISSUE-10`
- **Severity**: `P2 — Moderate`
- **Category**: `Mobile UX & Layout`
- **Current Behavior**:
  In `components/reader/FloatingEditDock.tsx`, when expanded on mobile devices (width < 768px), the dock renders as a centered floating box that completely obscures the reading text and page controls.
- **Expected Behavior**:
  On mobile viewports, the dock should render as an elegant bottom sheet docked to the screen bottom (`fixed inset-x-0 bottom-0 rounded-t-3xl`), with smooth drag or toggle to collapse.
- **Why It Matters**:
  Fails Master Spec Point 11 & 28 ("Mobile: Bottom sheet. It must NEVER cover important book content").
- **Exact File / Component / Route**:
  `components/reader/FloatingEditDock.tsx:L48-100`
- **Recommended Fix**:
  Add responsive classes (`sm:rounded-3xl sm:bottom-6 sm:max-w-xl inset-x-0 bottom-0 rounded-t-3xl rounded-b-none w-full`) to adapt seamlessly.
- **Affects Mobile**: Yes
- **Affects Security**: No
- **Affects Production Readiness**: Yes

---

### ISSUE-11: Quota Bypass on Direct Revision API Calls
- **ID**: `ISSUE-11`
- **Severity**: `P2 — Moderate`
- **Category**: `Cost Control & Quotas`
- **Current Behavior**:
  `app/api/books/create/route.ts` enforces monthly quotas on book creation, but `app/api/books/[id]/regenerate/route.ts` contains no quota check. A free tier user can trigger hundreds of image and text regenerations without restriction.
- **Expected Behavior**:
  Verify user's image generation quota and monthly limits before triggering AI calls in `regenerate`.
- **Why It Matters**:
  Creates an exploit path for cost exhaustion.
- **Exact File / Component / Route**:
  `app/api/books/[id]/regenerate/route.ts`
- **Recommended Fix**:
  Invoke `AICostController.validatePlanQuota()` for revisions.
- **Affects Mobile**: No
- **Affects Security**: Yes
- **Affects Production Readiness**: Yes

---

## 6. P3 — Minor Polish Items Detailed Specification

### ISSUE-12: Fluid Typography Inconsistencies & Hardcoded Sizes in Reader
- **ID**: `ISSUE-12`
- **Severity**: `P3 — Minor`
- **Category**: `Design System & Typography`
- **Current Behavior**:
  Certain headings use static font sizes (`text-3xl`, `text-2xl`) that can overflow or wrap awkwardly on 375px mobile screens.
- **Expected Behavior**:
  Use fluid typography classes (`text-xl sm:text-2xl md:text-3xl`) with strict `overflow-wrap: break-word`.
- **Exact File / Component / Route**: `app/book/[id]/page.tsx`, `components/landing/HeroSection.tsx`

### ISSUE-13: Missing Accessible ARIA Labels on Navigation Arrows & Icon Buttons
- **ID**: `ISSUE-13`
- **Severity**: `P3 — Minor`
- **Category**: `Accessibility (A11y)`
- **Current Behavior**:
  Pagination buttons and collapse icons in reader dock do not define explicit `aria-label` tags.
- **Expected Behavior**:
  Add `aria-label="Previous Page"`, `aria-label="Next Page"`, and ensure minimum 44px touch targets.
- **Exact File / Component / Route**: `app/book/[id]/page.tsx:L355-375`

### ISSUE-14: Client-Side Demo User Simulation Remnants in Auth Modal
- **ID**: `ISSUE-14`
- **Severity**: `P3 — Minor`
- **Category**: `Auth Polish`
- **Current Behavior**:
  `components/auth/AuthModal.tsx` contains legacy fallback code storing `bg_demo_user` in `localStorage` when errors mention 'placeholder' or 'Failed to fetch'.
- **Expected Behavior**:
  Cleanly surface errors to the user through the UI error banner; avoid creating fake client-side mock user sessions.
- **Exact File / Component / Route**: `components/auth/AuthModal.tsx:L45-53, L71-79`

---

## 7. Comprehensive Domain Audits

### 7.1 Design Audit & Luxury Brand Scorecard
- **Brand / Visual Identity**: **Strong**. The palette of Warm Ivory (`#FDFBF7`), Charcoal Near-Black (`#1A1612`), and Champagne Gold (`#9A6F3C`) successfully evokes a luxury publishing studio rather than a generic SaaS tool.
- **Hierarchy**: **Strong**. Primary CTAs are prominent, section boundaries are clear, and typographical scale is well-structured.
- **Typography**: **Strong**. Headings utilize `Playfair Display` with elegant letter-spacing, and UI elements utilize `Plus Jakarta Sans`.
- **Spacing & Breathing Room**: **Strong**. Generous whitespace on cards, editorial borders (`#EFECE6`), and subtle shadows convey quality.
- **Components**: **Strong**. Cards, modals, pills, and dropdowns share consistent border radiuses (`rounded-2xl`, `rounded-3xl`) and hover transitions.

### 7.2 Responsive Audit (375px — 1920px)
- **375px (Mobile Portrait)**: Header adapts cleanly, hero input maintains touch comfort, option pills wrap without horizontal overflow (`overflow-x: hidden` verified).
- **768px (Tablet)**: Grid layouts transition smoothly from single column to 2-column.
- **1024px+ (Desktop)**: Full studio layout with prominent book showcase.
- **Finding**: Reader floating dock required bottom-sheet styling for viewports < 768px (`ISSUE-10`).

### 7.3 UX & Accessibility Audit
- **Touch Targets**: Most buttons meet the ~44px target; minor adjustments needed for reader next/prev chevron buttons (`ISSUE-13`).
- **Focus & Keyboard Navigation**: ArrowLeft and ArrowRight work in reader; Tab order in modals is clean; Escape key closes dialogs.

### 7.4 Database & Row-Level Security (RLS) Audit
- **Tables Inspected**: `profiles`, `books`, `assets`, `book_pages`, `book_versions`, `uploads`, `jobs`, `generation_usage`, `usage_records`.
- **RLS Status**: Enabled on all tables.
- **Security Gap**: `books_select` allows unrestricted enumeration of any row with `is_shared = true` (`ISSUE-06`).
- **Persistence Gap**: Books and jobs failed insertion due to non-UUID format (`ISSUE-03`).

### 7.5 AI Architecture & Cost Routing Audit
- **Text Gateway**: `lib/ai/openrouter.ts` and `lib/ai/cost-controller.ts` implement multi-tier routing (Dev/Free, Standard Llama 3.3 70B, Premium Claude 3.5 Sonnet).
- **Prompt Caching**: OpenRouter prompt caching is properly implemented with stable cached prefix and dynamic chapter suffix (`AICostController.buildCachedPrompt`).
- **Deterministic Code**: Word counts, pagination, and layout math are handled strictly in TypeScript, not AI.
- **Image Gateway**: Swappable provider abstraction (`lib/ai/image-provider.ts`) supports Gemini, Pollinations FLUX, and mock fallbacks without changing business logic.

### 7.6 Export & Sharing Audit
- **PDF Export**: Currently outputs HTML markup with print styles; requires direct print view or binary delivery (`ISSUE-04`).
- **EPUB Export**: Currently outputs HTML with `.epub` filename; requires valid EPUB3 structure (`ISSUE-04`).
- **Sharing**: Currently leaks private `/book/[id]` URL; requires opaque token `/shared/[token]` with immutable snapshots (`ISSUE-01`).

---

## 8. Recommended Fix Order

To preserve operational stability and ensure zero regressions, fixes must be executed strictly according to this prioritized sequence:

1. **Step 1 (P0)**: Fix Database UUID ID Generation & Supabase Persistence (`ISSUE-03`). Ensure all jobs, books, and pages persist in PostgreSQL.
2. **Step 2 (P0)**: Fix False Success State in `/api/books/[id]/status` (`ISSUE-02`). Query real Supabase jobs.
3. **Step 3 (P0)**: Implement Secure Sharing Architecture (`ISSUE-01`, `ISSUE-06`). Create `/shared/[token]` read-only route and update `handleShare`.
4. **Step 4 (P1)**: Fix Password Reset Callback URL in `AuthModal` (`ISSUE-07`).
5. **Step 5 (P1)**: Protect Natural-Language Revision Endpoint & Persist `book_versions` (`ISSUE-05`, `ISSUE-11`).
6. **Step 6 (P1)**: Implement EPUB3 Compliant Packaging & High-Res PDF Print Generator (`ISSUE-04`).
7. **Step 7 (P2)**: Implement Touch Swipe Gestures & Image Display in Reader (`ISSUE-08`, `ISSUE-09`).
8. **Step 8 (P2)**: Adapt Floating Revision Dock as Mobile Bottom Sheet (`ISSUE-10`).
9. **Step 9 (P3)**: Typography, Accessibility & Auth Polish (`ISSUE-12`, `ISSUE-13`, `ISSUE-14`).
10. **Step 10**: Full verification via typecheck, lint, production build, and end-to-end testing, followed by `FINAL_QA_REPORT.md`.

---
*End of Audit Report.*
