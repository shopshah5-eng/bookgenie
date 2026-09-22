# 🚀 AGENTS.md — BookGenie Project Guidelines & Rules

---

## 🔒 V1 SCOPE PROTECTION RULE (CRITICAL)
> **Before implementing any feature, determine whether it is required by the V1 Master Specification. If it is not explicitly required and is not necessary for security, reliability, accessibility, or the core generation pipeline, do not add it. Ask before expanding scope.**

Out of scope for V1:
- ❌ Canva-style editor / drag-and-drop toolbars
- ❌ Marketplace / Community
- ❌ Print-on-demand
- ❌ Team collaboration / Sharing accounts
- ❌ Full complex dashboard
- ❌ Microservice architecture

The core product loop is strictly:
**PROMPT → PLAN → GENERATE → DESIGN → DOWNLOAD**

---

## 📱 HARD RESPONSIVENESS RULE (MANDATORY)
> **BookGenie must be fully responsive from the first implementation.**
- Every screen, component, modal, reader, generation animation, upload flow, sharing interface, and floating AI revision dock must work seamlessly on mobile (375px+), tablet (768px+), laptop (1024px+), and wide desktop (1440px+).
- Desktop must NOT simply be scaled down for mobile; layouts must intentionally adapt to each breakpoint.
- **Mobile Touch**: Page navigation supports touch/swipe; floating AI editor becomes an elegant bottom sheet on mobile.
- **Zero Horizontal Scroll**: Strict `overflow-x: hidden`; long titles wrap cleanly; images maintain proper aspect ratios without distortion.

---

## 🧠 DETERMINISTIC CODE RULE
> **Never spend an AI call on something deterministic code can do reliably.**
- Page numbers, word counts, EPUB packaging, PDF generation, file parsing, asset validation, layout mathematics, and signed URL generation must always be written in TypeScript/code.
- AI is reserved for writing, planning, structured rewriting, semantic QC, and creative visual generation.

---

## 💰 MULTI-TIER AI ROUTING & COST CONTROL
- **Multi-Tier Text**: Use cheap/free models for classification, metadata, and QC; standard models for chapters and guides; premium models only for complex literature.
- **Prompt Caching**: Structure prompts with a stable cached prefix (rules, blueprint, character bible) and a dynamic chapter suffix.
- **Targeted Revisions**: Never regenerate an image unless the user explicitly asks for visual changes. Text edits modify text only.

---

## 💎 LIVE-DATA & REAL INTEGRATION INTEGRITY RULE
- **ZERO FAKE DATA IN AUTHENTICATED EXPERIENCE**: All user-facing books, accounts, bookshelf data, generation jobs, and downloadable files must be real data persisted in Supabase.
- **ISOLATED DEMO CONTENT**: The only prebuilt demo is the public "Ocean Wonders" book in the showcase, completely isolated from user accounts.
- **REAL AI GENERATION**: OpenRouter (Text) and Gemini (Images) are used for live generation. If a call fails, reflect real error states; never fake completion.

---

## 🎨 Visual Design Tokens & Palette
- **Canvas / Background**: Warm Ivory / Linen Cream (`#FDFBF7`)
- **Primary Text**: Deep Charcoal Near-Black (`#1A1612`)
- **Secondary Text**: Warm Stone Slate (`#6B635B`)
- **Accent / CTAs**: Warm Champagne Amber / Editorial Gold (`#9A6F3C`, hover `#845D30`, active gradient `linear-gradient(135deg, #A87B45 0%, #8C5F2E 100%)`)
- **Surfaces**: Crisp white cards (`#FFFFFF`) with thin warm border (`#EFECE6`)
- **Headings**: Editorial Serif (`Playfair Display` / `Cormorant Garamond`)
- **Body & Interface**: Clean Modern Sans (`Plus Jakarta Sans`)

---

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
