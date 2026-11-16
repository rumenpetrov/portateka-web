# ADR 0011: Prompt-Based PWA Updates and Singleton Service Worker Store

- **Status:** Accepted
- **Date:** 2026-11-16

## Context
With `vite-plugin-pwa` configured as `registerType: "autoUpdate"` (`skipWaiting: true`, `clientsClaim: true`, and `injectRegister: "auto"`), an open PWA tab boots from the previously precached `index.html` and JS bundle. Because React Router performs client-side navigation without reloading the document, a newly deployed service worker swaps in the background while the running tab continues executing stale in-memory code until the user manually refreshes or restarts the app.

## Decision
1. **Prompt-Based Service Worker Lifecycle (`vite.config.ts`):**
   - Set `VitePWA({ registerType: "prompt" })` and omit `skipWaiting` and `clientsClaim` so newly installed service workers wait in the `waiting` state until the user confirms an update.
2. **Singleton Update Store (`src/pwa/updateStore.ts`):**
   - Register the service worker once via `registerSW({ immediate: true, ... })` from `virtual:pwa-register`, exposed through `useSyncExternalStore` (`usePwaUpdate`), so update state persists across `AuthLayout` $\leftrightarrow$ `AppLayout` transitions without re-registering.
   - Surface any already-waiting service worker (`registration.waiting`), and trigger throttled `registration.update()` checks on `document` `visibilitychange` (when visible) and `window` `focus`.
3. **Persistent Update Banner (`src/components/layout/PwaUpdateBanner/`):**
   - Render `PwaUpdateBanner` in both `AppLayout` and `AuthLayout` alongside `OfflineBanner`, giving the user an explicit **Refresh** action (`updateSW(true)` to activate the waiting worker and reload) and a **Dismiss** action.

## Consequences
- **Positive:** Users are notified as soon as a new deployment is ready—even across side-by-side windows or long-lived PWA sessions—and control when the page reloads instead of experiencing unexpected mid-session reloads or silent stale-bundle mismatches.
- **Negative / Trade-offs:** Requires one click from the user to apply an update; service worker registration and update prompts only run in production builds (`npm run build` / `npm run preview`), not `npm run dev`.
