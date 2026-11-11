# ADR 0001: Tech Stack and Routing

- **Status:** Accepted
- **Date:** 2026-11-11

## Context
We need a minimal, maintainable, and production-ready showcase frontend (`portateka-web`) for `portateka-api`. It must feature dedicated pages for every user flow (authentication, email verification, password reset, user profile, and properties CRUD) with strict TypeScript type safety and fast local development.

## Decision
We use **React 19**, **Vite 6**, **TypeScript 5** (`strict: true`, `verbatimModuleSyntax: true`), and **React Router v7** (`react-router`) in declarative SPA mode with route guards (`RequireAuth` and `GuestOnly`). Cross-directory module imports use the `@/*` path alias mapped to `./src/*` in `tsconfig.json` and `vite.config.ts`, keeping `./` relative imports only for closely coupled same-directory sibling files.

## Consequences
- **Positive:** Fast HMR and builds with Vite; dedicated URL routes matching the email verification (`/verify-email?token=...`) and password reset (`/reset-password?token=...`) paths configured in `portateka-api`.
- **Negative / Trade-offs:** Client-side routing requires SPA fallback configuration if deployed to static hosting in the future.
