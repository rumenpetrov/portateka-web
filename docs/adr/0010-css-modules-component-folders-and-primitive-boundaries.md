# ADR 0010: CSS Modules, Component Folder Structure, and Primitive Boundaries

- **Status:** Accepted
- **Date:** 2026-11-14

## Context
As the component library expanded, global `.ui-*`, layout, and page rules accumulated in `src/theme/tokens.css` alongside ad-hoc inline `style={{}}` objects in TSX files, creating naming collisions, cascade fragility, and scattered spacing overrides. At the same time, component implementations, styles, and TypeScript definitions were mixed together inside flat directories, and `NotificationProvider` and `react-router` routing lived under `src/components/`.

## Decision
1. **Colocated CSS Modules with Automated Declaration Generation:**
   - Move all component, layout, feature, and page styling out of `src/theme/tokens.css` and inline `style={{}}` blocks into colocated `*.module.css` files (retaining inline `style` only for truly dynamic runtime values such as dynamic `Spinner` and `Skeleton` dimensions).
   - Use `vite-css-modules` (`patchCssModules({ generateSourceTypes: true, declarationMap: true })` in `vite.config.ts`) together with `allowArbitraryExtensions: true` in `tsconfig.json`.
   - Generate `*.module.css.d.ts` files automatically via `npm run css:types` (`vite-css-modules --silent`), wired ahead of `vite`, `tsc --noEmit`, and `tsc -b` in `package.json` (`dev`, `typecheck`, `build`).
2. **Explicit CSS Cascade Layer Order at App Entry:**
   - Declare `@layer tokens, base, components, utilities;` in `src/theme/tokens.css` and import `@/theme/tokens.css` first in `src/main.tsx` before `AppRouter` (and before any lazily or statically imported CSS Modules).
   - Wrap CSS Module component styles in `@layer components` so global `@layer tokens` and `@layer base` resets always precede component rules while `@layer utilities` keeps highest precedence.
3. **Component Folder Convention (`<ComponentName>/`):**
   - Group every UI primitive, layout, feature component, and page inside a dedicated `<Name>/` folder containing `<Name>.tsx`, `<Name>.types.ts` (when props or domain types are exported), `<Name>.module.css` (when styled), and an `index.ts` barrel.
   - Maintain a top-level barrel at `src/components/ui/index.ts` for all UI primitives.
4. **Strict UI Primitive & Form Composition Boundaries:**
   - Keep `src/components/ui/` strictly agnostic of application infrastructure and routing: UI primitives may not import from `react-router`, `@/api`, `@/i18n`, `@/theme`, or `@/notifications`.
   - Polymorphic primitives (`Anchor`, `Button`, `Text`, `Flex`, `Grid`) expose `as?: C` so consumers pass external components such as `Link` from `"react-router"` explicitly (`<Anchor as={Link} to="...">`, `<Button as={Link} to="...">`).
   - Separate form concerns across dedicated UI primitives: `Fieldset` (`<fieldset>` layout and `gap`), `Field` (`gap`), `FormControl` (label, required indicator, hint, and error chrome), and bare input controls (`Input`, `Select`, `Textarea`).
5. **Top-Level Infrastructure Module Placement:**
   - House toast notification state and global error dispatching in `src/notifications/` (`NotificationProvider.tsx`, `types.ts`) alongside `src/i18n/` and `src/theme/`, keeping only the presentation-only `ToastViewport` primitive inside `src/components/ui/`.

## Consequences
- **Positive:** Scoped CSS class names with compile-time TypeScript checks and IDE go-to-definition (`declarationMap: true`); predictable CSS cascade order; self-contained component directories; `src/components/ui/` can be extracted or tested without router or API mocking.
- **Negative / Trade-offs:** Raw `tsc` without running `npm run css:types` (or `npm run typecheck`) assumes `.module.css.d.ts` files are already up to date; consumers linking via React Router must pass `as={Link}` explicitly to `Anchor` and `Button`.
