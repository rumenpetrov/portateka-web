# ADR 0013: Astro Hybrid Architecture (Static Public Pages + React SPA Island)

- **Status:** Accepted
- **Date:** 2026-11-26

## Context
Following ADR 0012, `portateka-web` had locale-prefixed URLs (`/:locale/...`), but remained a pure client-rendered Vite SPA. Non-JS crawlers could not read per-route localized `<head>` metadata or marketing content, adding marketing pages required shipping the React + React Query bundle to every visitor, and Cloudflare Workers `single-page-application` mode could not return real HTTP `404` status codes for unknown URLs.

## Decision
1. **Astro Static Site Generation (`astro.config.mjs`):**
   - Pre-render all Astro routes to static HTML with flat file URLs and zero SSR runtime compute so public pages stay portable and edge-cached.
2. **Strict Route Boundary (`/:locale` vs `/:locale/app/*`):**
   - **Static Astro pages (`src/pages/`, 0 KB React):** Root locale redirect (`/`), localized landing pages (`/:locale`, with a tiny inline `TOKEN_STORAGE_KEY` check toggling auth links vs Open App), localized `404` pages (`/:locale/404`, `/404`), and future marketing pages.
   - **Single React SPA island (`src/pages/app.astro` → `src/spa/App.tsx`):** Mounted client-only (`noindex, nofollow`) to host `/app` (PWA entry redirect) and all interactive auth and authenticated dashboard routes under `/:locale/app/*` (`src/router.tsx`).
   - **Cross-boundary navigation:** In-SPA links use React Router `<Link>` (`localizePath`); links crossing back to static pages use `<a href>` / `window.location.replace` (`buildLocalizedPath`).
3. **One-Way Component & Logic Sharing (`Astro → React`):**
   - Astro imports pure presentational React components without `client:*` so they render to static HTML + CSS at build time.
   - Shared pure TypeScript modules (`src/theme/colorScheme.ts`, `src/i18n/dictionaries.ts`, `src/i18n/localeRouting.ts`, and `TOKEN_STORAGE_KEY` in `src/api/client.ts`) eliminate duplicated theme, i18n, locale-pattern, and auth-token logic across Astro, React, and `worker/index.ts`.
   - `BaseLayout.astro` declares the CSS `@layer` order inline at the top of `<head>` before stylesheets so `@layer components` consistently overrides `@layer base` even when Astro splits CSS bundles or minifiers strip bare `@layer` statements.
4. **Cloudflare Worker Routing (`worker/index.ts`, `wrangler.jsonc`):**
   - Serve static assets directly from the edge (`run_worker_first: false`), with `not_found_handling: "none"` so unmatched paths fall through to `worker/index.ts` instead of Static Assets' built-in `404-page` handler.
   - `worker/index.ts` handles `308` canonical locale-casing redirects, rewrites `/:locale/app/*` (matched via `SPA_ROUTE_PATTERN` from `src/i18n/localeRouting.ts`) to `/app`, and serves the localized `404` asset with HTTP `404` status (resolved from URL locale or `Accept-Language`).
   - `astro.config.mjs` rewrites `/:locale/app/*` during `astro dev`, while `npm run preview` runs `wrangler dev` to test the built `dist/` bundle through `worker/index.ts`.
5. **SPA-Scoped PWA (`@vite-pwa/astro`):**
   - Generate a Workbox service worker whose registration stays in `src/pwa/updateStore.ts` and whose navigation fallback is scoped to `/app` and `SPA_ROUTE_PATTERN` so static marketing and `404` pages are never hijacked by the SPA shell.
6. **SEO, Sitemap & API Coordination:**
   - `@astrojs/sitemap` indexes only public static pages (filtering out `/app` and `404` routes); `public/robots.txt` points to `sitemap-index.xml`.
   - `portateka-api` sets `WEB_APP_VERIFY_EMAIL_PREFIX` and `WEB_APP_RESET_PASSWORD_PREFIX` under `/app/*` so transactional emails link directly into `/:locale/app/*`.

## Consequences
- **Positive:** Crawlers receive real localized HTML, Open Graph, `canonical`, and `hreflang` tags with 0 KB React JS on public pages; unknown URLs return real HTTP `404` responses in the user's locale; React Query caching, RHF/Zod forms, and offline PWA UX stay isolated inside one persistent SPA tree without hydration mismatches.
- **Negative / Trade-offs:** Navigating between static public pages (`/:locale`) and the SPA (`/:locale/app/*`) performs a standard full-page transition (`<a href>`); `vite-css-modules` CLI relies on `vite.css.config.mjs` (`--config`) because it reads top-level Vite `plugins` rather than Astro's nested `vite` block.
