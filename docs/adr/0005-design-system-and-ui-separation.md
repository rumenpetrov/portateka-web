# ADR 0005: Design System Tokens, Modern Web Platform Primitives, and UI vs. Feature Separation

- **Status:** Accepted (Updated)
- **Date:** 2026-11-14

## Context
The showcase application requires a minimal, high-impact design system supporting Light and Dark themes, strict separation between primitive and semantic theme tokens (single source of truth), and reusable UI components with zero business-logic coupling.

## Decision
1. **Two-Tier Design Tokens (`src/theme/tokens.css`):**
   - **Tier 1 (`--primitive-*`):** Raw OKLCH color scales, spacing, typography, radius, and motion values defined once on `:root` inside `@layer tokens`. Never referenced directly by components.
   - **Tier 2 (`--theme-*`):** Semantic tokens driven by `color-scheme: light dark`, `light-dark()`, CSS Relative Color Syntax (`oklch(from var(--theme-accent) l c h / 0.14)`), `color-mix(in oklab, ...)`, and `contrast-color()` (targeting Baseline 2026 directly without legacy math fallbacks).
2. **Declarative `<meta name="color-scheme">` Sync:**
   - `index.html` declares `<meta name="color-scheme" content="light dark">` and runs an inline FOUC-prevention script.
   - `:root` maps `<meta name="color-scheme">` overrides directly in CSS using `:has(> head > meta[name="color-scheme"][content="dark"])` and `[content="light"]`, so all `light-dark()` tokens and native controls (`accent-color`, `scrollbar-color`) adapt automatically without duplicated theme blocks.
3. **Native HTML Top-Layer Overlays (`<dialog>` and `popover="manual"`):**
   - `Modal` uses `<dialog closedby="any">` opened with `.showModal()` (with a coordinate-based click fallback for browsers without `closedBy`) and `overscroll-behavior: contain` on `dialog:modal` and `dialog::backdrop`.
   - `ToastViewport` uses the Popover API (`popover="manual"`) inside a top-layer stack with `ariaNotify()` + a pre-populated `aria-live="assertive"` live region.
4. **Pure UI Primitives (`src/components/ui/`) vs. Feature Components (`src/components/features/`):**
   - Components in `src/components/ui/` accept only presentation props (using `@layer components` CSS Modules and `as?: C` polymorphism where needed) and never import from `react-router`, `src/api/`, `src/i18n/`, `src/notifications/`, or domain modules. See ADR `0010` for the CSS Module, folder layout, and primitive boundary rules.
5. **Loading States (`Skeleton` vs. `Spinner`):**
   - Query-driven page/section loading (`isPending`) renders static `useI18n()` headers/navigation immediately and uses layout-matched `<Skeleton />` shapes (`aria-hidden="true"`, `--theme-bg-subtle` pulse with `@media (prefers-reduced-motion: reduce)`) inside a `role="status"` + `aria-busy="true"` container with a single `.visually-hidden` loading announcement.
   - `<Spinner />` is reserved for inline action/mutation feedback (`Button` `isLoading`, token verification).

## Consequences
- **Positive:** Single source of truth for all tokens; zero-JS focus trapping and `Esc` handling for modals; automatic WCAG foreground contrast calculation via `contrast-color()`; layout-matched skeleton placeholders prevent cumulative layout shift (CLS) on initial query fetches.
- **Negative / Trade-offs:** Newer CSS/HTML features (`contrast-color()`, `closedby`, `ariaNotify()`) require the lightweight CSS/JS fallbacks included in `tokens.css`, `Modal.tsx`, and `ToastViewport.tsx`.
