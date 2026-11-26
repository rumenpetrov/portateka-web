# ADR 0012: Locale-Prefixed URL Routing and SPA SEO

- **Status:** Accepted (Extended by ADR 0013)
- **Date:** 2026-11-26

## Context
Previously, `portateka-web` stored the active language in `localStorage` (`portateka_locale`) and served all routes without a language prefix (`/`, `/sign-in`, `/properties`). This prevented search engines from indexing localized pages separately, prevented sharing language-specific URLs, and coupled language state to browser storage.

## Decision
1. **Mandatory BCP 47 locale prefix (`/:locale/...`):**
   - Every route is nested under `/:locale` using exact canonical BCP 47 tags (`en-US`, `bg-BG`), including the default locale (`/en-US`, `/en-US/sign-in`, `/bg-BG/properties`).
   - Case-variant prefixes (e.g. `/bg-bg/properties`) and trailing slashes replace-redirect to canonical form (`/bg-BG/properties`).
2. **Stateless catch-all redirect without `localStorage`:**
   - Remove `portateka_locale` from `localStorage`.
   - Bare `/` (including PWA `start_url: "/"`) and any non-locale path (e.g. `/properties`, older `/verify-email?token=...` links, or `/foo`) detect the locale from `navigator.languages` (exact BCP 47 match first, then primary language prefix, falling back to `en-US`) and replace-redirect to `/:detectedLocale<pathname><search><hash>`.
3. **Router-backed `I18nProvider` & crawlable switcher:**
   - `<BrowserRouter>` wraps `<I18nProvider>` in `src/main.tsx` so `I18nProvider` derives the active locale directly from the URL and exposes `localizePath` and `getLocaleSwitchUrl`.
   - `TopControls` renders the language toggle as a crawlable `<Link replace hrefLang={nextLocale}>` preserving subpath, query string, and hash.
4. **Transactional email links (`portateka-api`):**
   - `buildVerificationUrl` includes `/${locale}` so verification and password-reset emails link directly to `/:locale/verify-email` and `/:locale/reset-password`.
5. **SPA SEO metadata & crawl assets:**
   - `RouteMetadata` updates `<title>` and `<meta name="description">` in place on every route, injects `<link rel="canonical">` plus bidirectional `hreflang` (`en-US`, `bg-BG`, `x-default`) on indexable public routes (`/:locale`, `/:locale/sign-in`, `/:locale/sign-up`), and emits `<meta name="robots" content="noindex, nofollow">` on all other routes (`/forgot-password`, token flows, authenticated routes, and 404).
   - Static `public/robots.txt` and `public/sitemap.xml` are served directly and excluded from Workbox `navigateFallbackDenylist` in `vite.config.ts`.

## Consequences
- **Positive:** Clean, shareable, crawlable locale URLs; no `localStorage` locale drift; zero duplicate `<head>` tags; backwards compatibility with older unprefixed links.
- **Negative / Trade-offs:** Remains a client-rendered SPA on Cloudflare Workers Assets, so crawlers that do not execute JavaScript rely on `sitemap.xml` and `robots.txt` rather than server-rendered per-route HTML `<head>` tags.
- **Update (ADR 0013):** Public pages (`/:locale`, `/:locale/404`, future marketing pages) now render as static Astro SSG HTML with build-time SEO tags and `@astrojs/sitemap`, while the React Router SPA is scoped under `/:locale/app/*` (`noindex, nofollow`).
