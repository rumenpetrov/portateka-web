# ADR 0002: Environment-Driven API Target and Vite CORS Proxy

- **Status:** Accepted
- **Date:** 2026-11-11

## Context
`portateka-api` is treated as read-only and enforces a strict CORS policy on `/api/*` allowing only `c.env.WEB_APP_BASE_URL` (`https://portateka.rpetrov.dev` by default). During development and showcasing, the developer needs to switch between a local Worker (`http://localhost:8787`) and the deployed production Worker (`https://portateka-api.rpetrov.dev`) via `.env` without modifying `portateka-api` or exposing an in-app environment switcher to end users.

## Decision
1. Configure `VITE_API_TARGET_URL` in `.env` (e.g., `http://localhost:8787` or `https://portateka-api.rpetrov.dev`).
2. Configure Vite's dev server proxy (`vite.config.ts`) to forward `/api` and `/health` to `VITE_API_TARGET_URL` with `changeOrigin: true`.
3. Support an optional `VITE_API_BASE_URL` for future production builds hosted directly on an allowed origin.

## Consequences
- **Positive:** Browser requests during local development are same-origin (`http://localhost:5173/api/...`), completely avoiding CORS preflight rejections against both local and remote API targets without touching `portateka-api`.
- **Negative / Trade-offs:** Changing `VITE_API_TARGET_URL` in `.env` requires restarting the Vite dev server (`npm run dev`).
