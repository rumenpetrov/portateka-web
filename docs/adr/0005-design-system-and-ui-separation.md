# ADR 0005: Design System Tokens and UI vs. Feature Component Separation

- **Status:** Accepted
- **Date:** 2026-11-11

## Context
The showcase application needs a clean design system supporting both Light and Dark themes, and a clear architectural boundary between reusable UI primitives and domain-specific business components.

## Decision
1. **Design Tokens & Theming (`src/theme/`):** Define semantic CSS custom properties (`--bg-canvas`, `--bg-surface`, `--text-primary`, `--border-default`, `--accent-primary`, `--status-danger`, etc.) in `tokens.css` with `[data-theme="light"]` and `[data-theme="dark"]` selectors plus `color-scheme` support.
2. **Pure UI Primitives (`src/components/ui/`):** Components such as `Button`, `Input`, `Textarea`, `Card`, `Badge`, `Alert`, `Modal`, `Spinner`, `EmptyState`, and `ToastViewport` accept only standard presentation props and DOM attributes. They must **never** import from `src/api/` or domain modules.
3. **Feature / Business Components (`src/components/features/` & `src/pages/`):** Compose `src/components/ui/` primitives with React Query hooks, routing, and i18n to implement domain workflows (`PropertyForm`, `PropertyCard`, `ProfileForm`, etc.).

## Consequences
- **Positive:** UI components remain portable, predictable, and easy to style or test in isolation; switching between dark and light theme happens instantaneously via CSS custom properties without React re-render overhead.
- **Negative / Trade-offs:** Slightly more files than co-locating raw HTML elements inside pages, which pays off in visual consistency and maintainability.
