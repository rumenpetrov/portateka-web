# ADR 0004: Type-Safe Client i18n and Machine Error Code Localization

- **Status:** Accepted
- **Date:** 2026-11-11

## Context
`portateka-api` intentionally returns short machine codes for both top-level errors (`VALIDATION_ERROR`, `UNAUTHORIZED`, `NOT_FOUND`, etc.) and field validation errors (`required`, `invalid_email`, `password_too_short`, `email_not_verified`, etc.) so that the client is solely responsible for human-readable translations. The app requires support for at least English (`en-US`, default) and Bulgarian (`bg-BG`).

## Decision
Implement a lightweight, zero-dependency, compile-time type-safe i18n module (`src/i18n/`) where:
1. `en-US.ts` defines the canonical `TranslationDictionary` structure.
2. `bg-BG.ts` is strictly typed against `TranslationDictionary`, guaranteeing at compile time (`npm run typecheck`) that no UI key or API error machine code is ever missing in Bulgarian.
3. Selected locale is persisted in `localStorage` (`portateka_locale`) and synchronized with `<html lang="...">`.

## Consequences
- **Positive:** Zero external i18n bundle overhead; TypeScript immediately flags any missing translation key or newly added API error code across languages; end users only ever see human-readable localized messages.
- **Negative / Trade-offs:** All translations are bundled statically (acceptable and fast for 2 languages in a minimal showcase app).
