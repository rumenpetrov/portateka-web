# ADR 0002: Environment-Driven API Target and Dev CORS Proxy

- **Status:** Accepted
- **Date:** 2026-11-11

## Context
`portateka-api` enforces a strict CORS policy on `/api/*` allowing only `c.env.WEB_APP_BASE_URL` (`https://portateka.rpetrov.dev` by default). During development and showcasing, the developer needs to switch between a local Worker (`http://localhost:8787`) and the deployed production Worker (`https://portateka-api.rpetrov.dev`) via `.env` without modifying `portateka-api` or exposing an in-app environment switcher to end users.

## Decision
1. Configure `API_TARGET_URL` in `.env` (e.g., `http://localhost:8787` or `https://portateka-api.rpetrov.dev`).
2. Configure Astro's Vite dev server proxy (`astro.config.mjs`) to forward `/api` and `/health` to `API_TARGET_URL` with `changeOrigin: true`.
3. Support an optional `PUBLIC_API_BASE_URL` (following Astro's `PUBLIC_` client env prefix convention) for production builds hosted directly on an allowed CORS origin.

## Consequences
- **Positive:** Browser requests during local development are same-origin (`http://localhost:5173/api/...`), completely avoiding CORS preflight rejections against both local and remote API targets without touching `portateka-api`.
- **Negative / Trade-offs:** Changing `API_TARGET_URL` in `.env` requires restarting the Astro dev server (`npm run dev`).
