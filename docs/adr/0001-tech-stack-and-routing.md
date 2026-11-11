# ADR 0001: Tech Stack and Routing

- **Status:** Accepted
- **Date:** 2026-11-11

## Context
We need a minimal, maintainable, and production-ready showcase frontend (`portateka-min-web`) for `portateka-api`. It must feature dedicated pages for every user flow (authentication, email verification, password reset, user profile, and properties CRUD) with strict TypeScript type safety and fast local development.

## Decision
We use **React 19**, **Vite 6**, **TypeScript 5** (`strict: true`, `verbatimModuleSyntax: true`), and **React Router v7** (`react-router`) in declarative SPA mode with route guards (`RequireAuth` and `GuestOnly`).

## Consequences
- **Positive:** Fast HMR and builds with Vite; dedicated URL routes matching the email verification (`/verify-email?token=...`) and password reset (`/reset-password?token=...`) paths configured in `portateka-api`.
- **Negative / Trade-offs:** Client-side routing requires SPA fallback configuration if deployed to static hosting in the future.
