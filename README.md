# Portateka

Web app where you organize and manage your property portfolio information.

---

## Tech Stack

- **Static Shell & Marketing Pages:** Astro 7 (`output: "static"`) + `@astrojs/sitemap` + `@vite-pwa/astro`
- **Interactive App Island (`/:locale/app/*`):** React 19 + TypeScript (`strict`) mounted with `client:only="react"`
- **SPA Routing:** React Router v7
- **Server State & Caching:** TanStack React Query v5
- **Forms & Validation:** React Hook Form + Zod v4 (`@hookform/resolvers`)
- **Internationalization (i18n):** Built-in typed dictionary (`en-US` default, `bg-BG`) shared by Astro and React
- **Hosting & Edge Routing:** Cloudflare Workers Static Assets (`wrangler.jsonc` + `worker/index.ts`)
- **Icons:** Lucide React

---

## Requirements

- **Node.js:** `>=24.22.0`
- **npm:** `>=11.19.1`
- A running instance of [`portateka-api`](https://github.com/rumenpetrov/portateka-api)

---

## Local Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Configure `.env`:**
   Copy `.env.example` to `.env` in the project root:

   ```bash
   cp .env.example .env
   ```

   | Variable              | Default                 | Description                                                                                                |
   | --------------------- | ----------------------- | ---------------------------------------------------------------------------------------------------------- |
   | `API_TARGET_URL`      | `http://localhost:8787` | Target backend URL proxied by Astro/Vite in local development (`/api` and `/health`).                      |
   | `PUBLIC_API_BASE_URL` | _(empty)_               | Optional direct API base URL for production builds. Leave empty in local dev to use the dev proxy.         |

3. **Start the local dev server:**

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`.

---

## Scripts

| Command             | Description                                                                                 |
| ------------------- | ------------------------------------------------------------------------------------------- |
| `npm run css:types` | Generate TypeScript declaration files (`*.module.css.d.ts`) for CSS Modules               |
| `npm run dev`       | Generate CSS Module types and start Astro dev server at `http://localhost:5173`             |
| `npm run build`     | Generate CSS Module types, run `astro check`, `tsc --noEmit`, and build static site to `dist/` |
| `npm run deploy`    | Deploy the built `dist/` static assets and `worker/index.ts` router to Cloudflare Workers  |
| `npm run preview`   | Locally preview the production build from `dist/`                                           |
| `npm run typecheck` | Generate CSS Module types and run `astro check` + `tsc --noEmit` without emitting           |

---

## Project Structure

```text
src/
├── api/            # Fetch client, React Query keys, types, and domain API modules (auth, properties)
├── components/
│   ├── astro/      # Pure presentational React views rendered statically by Astro (0 KB JS)
│   ├── features/   # Domain-specific components (auth, home, profile, properties tabs & modals)
│   ├── layout/     # AppLayout, AuthLayout, TopControls, BrandLogo/BrandLogoView, Footer, banners
│   ├── seo/        # SPA RouteMetadata updater
│   └── ui/         # Pure polymorphic UI primitives (Anchor, Button, Input, Modal, Card, etc.)
├── hooks/          # Shared hooks (e.g. useAppForm wrapper for React Hook Form + Zod)
├── i18n/           # Locale dictionaries, routing helpers (buildLocalizedPath / buildAppPath), I18nProvider
├── layouts/        # Astro layouts (BaseLayout.astro, PublicLayout.astro)
├── notifications/  # Toast notification context & global error notification bridge
├── pages/          # Astro file-based routes (/, /[locale], /[locale]/404, /app, /404)
├── pwa/            # Singleton service-worker update store (registerSW + useSyncExternalStore)
├── spa/            # React SPA island root (App.tsx) and React Router pages (src/spa/pages/)
├── theme/          # Design tokens & cascade layers (tokens.css), shared colorScheme helpers, ThemeProvider
└── validators/     # Zod schemas mapped to i18n validation keys
worker/             # Cloudflare Worker entry rewriting /:locale/app/* -> /app and serving localized 404s
```

Each component, layout, and SPA page lives in its own `<Name>/` folder alongside any colocated `<Name>.types.ts`, `<Name>.module.css`, and `index.ts` barrel.
