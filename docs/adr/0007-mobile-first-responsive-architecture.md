# ADR 0007: Mobile-First Responsive Architecture and Touch Ergonomics

- **Status:** Accepted (Updated)
- **Date:** 2026-11-14

## Context
`portateka-web` is used primarily on mobile phones and less frequently on desktop screens. Mobile browsers present dynamic toolbars/keyboards, coarse touch pointers, and single-hand thumb reach constraints.

## Decision
1. **Dynamic Viewport & Safe Areas:** Use `100dvh` (`min-block-size: 100dvh`) and `viewport-fit=cover` with `env(safe-area-inset-bottom)` so mobile address bars and home indicators never clip navigation or toast notifications.
2. **Thumb-Friendly Bottom Navigation on Mobile:** `AppLayout` renders a fixed 4-item bottom tab bar (`styles.bottomNav` in `AppLayout.module.css`) on viewports `< 48rem` and transitions to a top navigation bar (`styles.desktopNav`) on wider viewports.
3. **Top-Aligned Auth Forms:** `AuthLayout` aligns forms near the top of the viewport on mobile (`justify-content: flex-start`) with `scroll-padding-block-end: 6rem` so virtual keyboards do not obstruct submit buttons, and equips all inputs with mobile `inputMode`, `enterKeyHint`, and autofill attributes (`autocomplete="username"`, `current-password`, `new-password`).
4. **Fluid Property Grid & Fluid Typography:** Use a fluid CSS grid on `PropertiesListPage.module.css` (`styles.grid`: `repeat(auto-fit, minmax(min(18.75rem, 100%), 1fr))`) to adapt from a single mobile column to an auto-fitting multi-column layout on wider screens, and `clamp()` (with max <= 2.5x min for WCAG 200% zoom compliance) for headings.

## Consequences
- **Positive:** Ergonomic one-handed mobile navigation, zero iOS input auto-zoom (`font-size: max(1rem, 1em)`), and native password-manager / virtual-keyboard integration.
- **Negative / Trade-offs:** Both mobile bottom nav and desktop top nav links exist in `AppLayout` DOM (toggled via CSS `display: none` across the `48rem` breakpoint).
