# Agent Guidelines (`portateka-web`)

## Agent Persona & Workflow
- **Style:** Direct, concise, zero conversational filler. Explain the "why" and trade-offs behind non-obvious technical decisions in 1–3 short bullets.
- **Design philosophy:** Prefer simple, explicit, readable code over clever abstractions (KISS, YAGNI). Reuse existing project helpers (`src/i18n/localeRouting.ts`, `src/i18n/dictionaries.ts`, `src/theme/colorScheme.ts`, `src/components/ui/*`, `src/api/client.ts`) before introducing new ones, and extract new shared utilities only when a pattern genuinely repeats. Use dedicated `import type { ... }` statements for types—never mix inline `type` imports with value imports in the same `import` declaration.
- **Durable docs:** Document boundaries, invariants, and the "why"—avoid repeating volatile details already defined in code or config (package versions, exact config flags, literal locales, ADR ranges, or exhaustive file/component lists). Reference the owning directory or symbol (e.g., `src/i18n/`, `DEFAULT_LOCALE`) only when a pointer helps.
- **Step-by-step execution:** Break work into small, independently verifiable steps:
  1. **Inspect (read-only):** Read relevant files first so the plan fits the existing codebase.
  2. **Plan & teach:** Present a short plan for the current step, explain the key concepts/trade-offs, highlight any decisions for the user, and **stop for explicit confirmation before creating or modifying any files, installing packages, or committing**.
  3. **Execute & verify:** After confirmation, apply the changes and verify them (`npm run typecheck` and, when routing/assets/bundling change, `npm run build` / `npm run preview`) before moving to the next step.

## Architecture & Stack
- **Static shell & marketing pages:** Astro (`astro.config.mjs`, `src/layouts/`, `src/pages/`) deployed to Cloudflare Workers Static Assets (`wrangler.jsonc`, `worker/index.ts`), kept portable to standard static hosting without vendor lock-in inside `src/`.
- **Interactive SPA island:** React + TypeScript (`strict`), React Router (`src/router.tsx`), and TanStack React Query (`src/api/`) mounted under `src/spa/`.
- **Forms & validation:** React Hook Form + Zod (`src/hooks/useAppForm.ts`, `src/validators/`).
- **Styling & i18n:** CSS Modules (`vite-css-modules`), design tokens & cascade layers (`src/theme/tokens.css`), and typed locale dictionaries (`src/i18n/`).

## Frontend & Hybrid Routing Conventions
- **Strict route boundary:** Public/marketing routes live as static Astro pages in `src/pages/` (0 KB React client JS); interactive and authenticated flows live in the SPA (`src/spa/pages/`). Use React Router `<Link>` (`localizePath`) inside the SPA, and plain `<a href>` / `window.location` when crossing the boundary.
- **One-way component sharing (`Astro → React`):** Import pure presentational components (`src/components/ui/*`, `src/components/astro/*`, and pure presentational components) into `.astro` pages without `client:*` so markup and styles stay shared with zero client JS.
- **Scripts in Astro:** Prefer regular bundled `<script>` tags importing shared `.ts` modules over `<script is:inline>`. Reserve `is:inline` strictly for tiny pre-paint scripts, passing shared constants via `define:vars`.
- **Translations & locale patterns:** Render static pages via `getStaticPaths()` + `getDictionary(locale)` and SPA views via `useI18n()`. Never use client-side DOM-patching scripts for localization, and derive locale lists/route patterns from `src/i18n/` rather than hardcoding them in configs or `worker/`.
- **CSS Modules & cascade layers:** Keep `.module.css` selectors compatible with `npm run css:types` (wrap external/polyfill selectors in `:global(...)`) and preserve the `@layer` order declared in `src/theme/tokens.css` and `src/layouts/BaseLayout.astro`.
- **Architecture Decision Records (ADRs):** Architectural decisions and trade-offs live in `docs/adr/`. Do not duplicate their details here; keep `docs/adr/` updated when introducing or changing architectural patterns.

## Environment, Build & CI/CD Workflow
- **Local environment:** Keep local overrides in `.env` (copied from `.env.example`, never committed). Use `API_TARGET_URL` for local `/api` & `/health` proxying and `PUBLIC_API_BASE_URL` for direct production API builds.
- **Dev vs preview:** Use `npm run dev` (`astro dev`) for fast HMR, and `npm run preview` (`wrangler dev`) to test the built `dist/` bundle through `worker/index.ts` (including SPA rewrites, localized `404`s, canonical redirects, and PWA).
- **CI/CD:** `.github/workflows/ci.yml` validates PRs via `_build.yml`; pushes to `main` build `dist/` and deploy `worker/index.ts` + static assets via `.github/workflows/deploy.yml`.
