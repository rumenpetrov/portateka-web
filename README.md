# Portateka

Web app where you organize and manage your property portfolio information.

---

## Tech Stack

- **Static Shell & Marketing Pages:** Astro + `@astrojs/sitemap` + `@vite-pwa/astro`
- **Interactive App Island (`/:locale/app/*`):** React + TypeScript (`strict`)
- **SPA Routing:** React Router
- **Server State & Caching:** TanStack React Query
- **Forms & Validation:** React Hook Form + Zod (`@hookform/resolvers`)
- **Internationalization (i18n):** Built-in typed dictionaries shared by Astro and React
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
   | `API_TARGET_URL`      | `http://localhost:8787` | Target backend URL proxied in local dev (`npm run dev`) and local Worker preview (`npm run preview`) for `/api` and `/health`. |
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
| `npm run preview`   | Locally preview the built `dist/` site through `worker/index.ts` via Wrangler at `http://localhost:5173` |
| `npm run typecheck` | Generate CSS Module types and run `astro check` + `tsc --noEmit` without emitting           |

---

## Project Structure

```text
src/
├── api/            # Fetch client, React Query keys, types, and domain API modules
├── components/
│   ├── astro/      # Pure presentational React views rendered statically by Astro (0 KB JS)
│   ├── features/   # Domain-specific feature components
│   ├── layout/     # Shared shell, header controls, branding, footer, and status banners
│   ├── seo/        # SPA metadata updater
│   └── ui/         # Pure polymorphic UI primitives
├── hooks/          # Shared React hooks
├── i18n/           # Locale dictionaries, routing helpers, and I18nProvider
├── layouts/        # Astro page layouts
├── notifications/  # Toast notification context and global error bridge
├── pages/          # Astro file-based routes and the SPA shell entry
├── pwa/            # Service worker update store
├── spa/            # React SPA island root and React Router pages
├── theme/          # Design tokens, cascade layers, color-scheme helpers, and ThemeProvider
└── validators/     # Zod schemas mapped to i18n validation keys
worker/             # Cloudflare Worker edge router (SPA rewrites, canonical locale redirects, localized 404s)
```

Each component, layout, and SPA page lives in its own `<Name>/` folder alongside any colocated `<Name>.types.ts`, `<Name>.module.css`, and `index.ts` barrel.
