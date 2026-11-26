# ADR 0013: Astro Hybrid Architecture (Static Public Pages + React SPA Island)

- **Status:** Accepted
- **Date:** 2026-11-26

## Context
Following ADR 0012, `portateka-web` had locale-prefixed URLs (`/:locale/...`), but remained a pure client-rendered Vite SPA. Non-JS crawlers could not read per-route localized `<head>` metadata or marketing content, adding marketing pages required shipping the React + React Query bundle to every visitor, and Cloudflare Workers `single-page-application` mode could not return real HTTP `404` status codes for unknown URLs.

## Decision
1. **Astro Static Site Generation (`astro.config.mjs`):**
   - Configure Astro with `output: "static"`, `trailingSlash: "never"`, and `build: { format: "file" }` (emitting flat `index.html`, `en-US.html`, `bg-BG.html`, `app.html`, `404.html`, `en-US/404.html`, `bg-BG/404.html`).
   - Keep zero SSR runtime compute for public pages so hosting remains portable and edge-cached.
2. **Strict Route Boundary (`/:locale` vs `/:locale/app/*`):**
   - **Astro static `.astro` pages (`0 KB React`):** `/` (`src/pages/index.astro` browser-locale redirect), `/:locale` (`src/pages/[locale]/index.astro` static landing page with a tiny inline `TOKEN_STORAGE_KEY` check toggling Sign In / Sign Up vs Open App), `/:locale/404` (`src/pages/[locale]/404.astro`), `/404` (`src/pages/404.astro`), and future marketing pages.
   - **Single React SPA island (`src/pages/app.astro` → `src/spa/App.tsx`):** Mounted via `<App client:only="react" />` (`noindex, nofollow`). `src/router.tsx` scopes `/app` (PWA `start_url` redirect) and all interactive auth (`sign-in`, `sign-up`, `forgot-password`, `verify-email`, `reset-password`) and dashboard routes (`/:locale/app`, `properties`, `properties/new`, `properties/:id`, `profile`) under `/:locale/app/*`.
   - **Cross-boundary navigation:** In-SPA links use React Router `<Link>` + `buildAppPath` (`I18nProvider.localizePath`); links crossing back to static pages (`BrandLogo`, guest `NotFoundPage`, post-account-deletion redirect in `ProfilePage`) use `<a href>` / `window.location.replace` via `buildLocalizedPath`.
3. **One-Way Component & Logic Sharing (`Astro → React`):**
   - Astro imports pure presentational React components (`src/components/ui/*`, `BrandLogoView`, `WelcomeBetaCard`) **without** `client:*` so they compile to static HTML + CSS at build time.
   - Shared pure TypeScript modules eliminate duplication across Astro and React: `src/theme/colorScheme.ts` (consumed by `ThemeProvider.tsx`, `BaseLayout.astro`, and `PublicLayout.astro`), `src/i18n/dictionaries.ts`, `src/i18n/localeRouting.ts`, and `TOKEN_STORAGE_KEY` from `src/api/client.ts`.
   - `BaseLayout.astro` emits `<style is:inline>@layer tokens, base, components, utilities;</style>` at the top of `<head>` before any `<link rel="stylesheet">` so `@layer components` consistently overrides `@layer base` even when Astro splits CSS bundles or minifiers strip bare `@layer` order declarations.
4. **Cloudflare Worker Routing (`worker/index.ts`, `wrangler.jsonc`):**
   - Configure `assets` with `run_worker_first: false`, `not_found_handling: "404-page"`, and `html_handling: "drop-trailing-slash"` so static files serve directly from Cloudflare's edge with zero Worker invocations.
   - `worker/index.ts` rewrites `^/(?:en-US|bg-BG)/app(?:/.*)?$` to `/app` via `env.ASSETS.fetch`, and when `ASSETS` returns `404`, serves `/${locale}/404` (resolved via `extractLocaleFromPathname` or `Accept-Language`) with HTTP `404` status.
   - `hybridRoutingDevPlugin` in `astro.config.mjs` mirrors both SPA rewrites and localized `404` handling in `astro dev` and `astro preview`.
5. **SPA-Scoped PWA (`@vite-pwa/astro`):**
   - Use `generateSW` with `injectRegister: null` (registration stays in `src/pwa/updateStore.ts`), `manifest.start_url: "/app"`, `navigateFallback: "/app"`, and `navigateFallbackAllowlist: [/^\/app(?:\/|$)/, /^\/(?:en-US|bg-BG)\/app(?:\/|$)/i]` so the Service Worker only intercepts SPA navigations and never hijacks static marketing or 404 pages.
6. **SEO, Sitemap & API Coordination:**
   - `@astrojs/sitemap` generates `sitemap-index.xml` and `sitemap-0.xml` restricted to indexable static public pages (`/:locale` and future marketing pages); `public/robots.txt` points to `sitemap-index.xml`.
   - `portateka-api` updates `WEB_APP_VERIFY_EMAIL_PREFIX` to `/app/verify-email` and `WEB_APP_RESET_PASSWORD_PREFIX` to `/app/reset-password` so transactional emails link directly into `/:locale/app/*`.

## Consequences
- **Positive:** Crawlers receive real localized HTML, Open Graph, `canonical`, and `hreflang` tags with 0 KB React JS on public pages; unknown URLs return real HTTP `404` responses in the user's locale; React Query caching, RHF/Zod forms, and offline PWA UX stay isolated inside one persistent SPA tree without hydration mismatches.
- **Negative / Trade-offs:** Navigating between static public pages (`/:locale`) and the SPA (`/:locale/app/*`) performs a standard full-page transition (`<a href>`); `vite-css-modules` CLI relies on `vite.css.config.mjs` (`--config`) because it reads top-level Vite `plugins` rather than Astro's nested `vite` block.
