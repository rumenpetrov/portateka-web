# ADR 0005: Design System Tokens, Modern Web Platform Primitives, and UI vs. Feature Separation

- **Status:** Accepted (Updated)
- **Date:** 2026-11-11

## Context
The showcase application requires a minimal, high-impact design system supporting Light and Dark themes, strict separation between primitive and semantic theme tokens (single source of truth), and reusable UI components with zero business-logic coupling.

## Decision
1. **Two-Tier Design Tokens (`src/theme/tokens.css`):**
   - **Tier 1 (`--primitive-*`):** Raw OKLCH color scales, spacing, typography, radius, and motion values defined once on `:root` inside `@layer tokens`. Never referenced directly by components.
   - **Tier 2 (`--theme-*`):** Semantic tokens driven by `color-scheme: light dark`, `light-dark()`, CSS Relative Color Syntax (`oklch(from var(--theme-accent) l c h / 0.14)`), `color-mix(in oklab, ...)`, and `contrast-color()` (with CIE XYZ relative-color luminance calculation `color(from var(...) xyz-d65 ...)` as the pre-`contrast-color()` fallback).
2. **Declarative `<meta name="color-scheme">` Sync:**
   - `index.html` declares `<meta name="color-scheme" content="light dark">` and runs an inline FOUC-prevention script.
   - `:root` maps `<meta name="color-scheme">` overrides directly in CSS using `:has(> head > meta[name="color-scheme"][content="dark"])` and `[content="light"]`, so all `light-dark()` tokens and native controls (`accent-color`, `scrollbar-color`) adapt automatically without duplicated theme blocks.
3. **Native HTML Top-Layer Overlays (`<dialog>` and `popover="manual"`):**
   - `Modal` uses `<dialog closedby="any">` opened with `.showModal()` (with a coordinate-based click fallback for browsers without `closedBy`) and `overscroll-behavior: contain` on `dialog:modal` and `dialog::backdrop`.
   - `ToastViewport` uses the Popover API (`popover="manual"`) inside a top-layer stack with `ariaNotify()` + a pre-populated `aria-live="assertive"` live region.
4. **Pure UI Primitives (`src/components/ui/`) vs. Feature Components (`src/components/features/`):**
   - Components in `src/components/ui/` accept only presentation props and never import from `src/api/` or domain modules.

## Consequences
- **Positive:** Single source of truth for all tokens; zero-JS focus trapping and `Esc` handling for modals; automatic WCAG foreground contrast calculation via `contrast-color()`.
- **Negative / Trade-offs:** Newer CSS/HTML features (`contrast-color()`, `closedby`, `ariaNotify()`) require the lightweight CSS/JS fallbacks included in `tokens.css`, `Modal.tsx`, and `ToastViewport.tsx`.
