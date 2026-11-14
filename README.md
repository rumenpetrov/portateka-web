# Portateka

Web app where you organize and manage your property portfolio information.

---

## Tech Stack

- **Framework:** React 19 + TypeScript (`strict`)
- **Build & Dev Server:** Vite 6
- **Routing:** React Router v7
- **Server State & Caching:** TanStack React Query v5
- **Forms & Validation:** React Hook Form + Zod v4 (`@hookform/resolvers`)
- **Internationalization (i18n):** Built-in typed dictionary (`en-US` default, `bg-BG`)
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

   | Variable              | Default                 | Description                                                                                             |
   | --------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------- |
   | `VITE_API_TARGET_URL` | `http://localhost:8787` | Target backend URL proxied by Vite in local development (`/api` and `/health`).                         |
   | `VITE_API_BASE_URL`   | _(empty)_               | Optional direct API base URL for production builds. Leave empty in local dev to use the Vite dev proxy. |

3. **Start the local dev server:**

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`.

---

## Scripts

| Command             | Description                                                                        |
| ------------------- | ---------------------------------------------------------------------------------- |
| `npm run css:types` | Generate TypeScript declaration files (`*.module.css.d.ts`) for CSS Modules      |
| `npm run dev`       | Generate CSS Module types and start Vite dev server at `http://localhost:5173`     |
| `npm run build`     | Generate CSS Module types, run `tsc -b`, and build production bundle to `dist/`    |
| `npm run deploy`    | Deploy the built `dist/` static assets to Cloudflare Workers                       |
| `npm run preview`   | Locally preview the production build from `dist/`                                  |
| `npm run typecheck` | Generate CSS Module types and run TypeScript compiler check without emitting       |

---

## Project Structure

```text
src/
├── api/            # Fetch client, React Query keys, types, and domain API modules (auth, properties)
├── components/
│   ├── features/   # Domain-specific components (auth, profile, properties tabs & modals)
│   ├── layout/     # AppLayout, AuthLayout, TopControls, BrandLogo
│   └── ui/         # Pure polymorphic UI primitives (Anchor, Button, Input, Modal, Card, etc.)
├── hooks/          # Shared hooks (e.g. useAppForm wrapper for React Hook Form + Zod)
├── i18n/           # Locale dictionaries (bg-BG, en-US) and I18nProvider
├── notifications/  # Toast notification context & global error notification bridge
├── pages/          # Route-level page components
├── theme/          # Design tokens & cascade layers (tokens.css) and ThemeProvider (light/dark/system)
└── validators/     # Zod schemas mapped to i18n validation keys
```

Each component, layout, and page lives in its own `<Name>/` folder alongside any colocated `<Name>.types.ts`, `<Name>.module.css`, and `index.ts` barrel.
