# ADR 0007: Mobile-First Responsive Architecture and Touch Ergonomics

- **Status:** Accepted
- **Date:** 2026-11-11

## Context
`portateka-web` is used primarily on mobile phones and less frequently on desktop screens. Mobile browsers present dynamic toolbars/keyboards, coarse touch pointers, and single-hand thumb reach constraints.

## Decision
1. **Dynamic Viewport & Safe Areas:** Use `100dvh` (`min-block-size: 100dvh`) and `viewport-fit=cover` with `env(safe-area-inset-bottom)` so mobile address bars and home indicators never clip navigation or toast notifications.
2. **Thumb-Friendly Bottom Navigation on Mobile:** `AppLayout` renders a fixed 4-item bottom tab bar (`.app-bottom-nav`) on viewports `< 48rem` and transitions to a top navigation bar (`.app-desktop-nav`) on wider viewports.
3. **Top-Aligned Auth Forms:** `AuthLayout` aligns forms near the top of the viewport on mobile (`justify-content: flex-start`) with `scroll-padding-block-end: 6rem` so virtual keyboards do not obstruct submit buttons, and equips all inputs with mobile `inputMode`, `enterKeyHint`, and autofill attributes (`autocomplete="username"`, `current-password`, `new-password`).
4. **Container-Driven Property Grid & Fluid Typography:** Use `@container (min-width: 38rem)` on `.app-main` (`container-type: inline-size`) to expand the single-column mobile property stack into a 2-column grid, and `clamp()` (with max <= 2.5x min for WCAG 200% zoom compliance) for headings.

## Consequences
- **Positive:** Ergonomic one-handed mobile navigation, zero iOS input auto-zoom (`font-size: max(1rem, 1em)`), and native password-manager / virtual-keyboard integration.
- **Negative / Trade-offs:** Both mobile bottom nav and desktop top nav links exist in `AppLayout` DOM (toggled via CSS `display: none` across the `48rem` breakpoint).
