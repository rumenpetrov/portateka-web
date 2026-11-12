# ADR 0004: Type-Safe Client i18n and Machine Error Code Localization

- **Status:** Accepted
- **Date:** 2026-11-11

## Context
`portateka-api` intentionally returns short machine codes for both top-level errors (`VALIDATION_ERROR`, `UNAUTHORIZED`, `NOT_FOUND`, etc.) and field validation errors (`required`, `invalid_email`, `password_too_short`, `email_not_verified`, etc.) so that the client is solely responsible for human-readable translations. The app requires support for at least English (`en-US`, default) and Bulgarian (`bg-BG`).

## Decision
Implement a lightweight, zero-dependency, compile-time type-safe i18n module (`src/i18n/`) where:
1. `src/i18n/types.ts` defines the single source of truth for locale constants (`SUPPORTED_LOCALES = ["en-US", "bg-BG"]` and `DEFAULT_LOCALE = "en-US"`) and `TranslationDictionary`.
2. `en-US.ts` and `bg-BG.ts` are strictly typed against `TranslationDictionary`, guaranteeing at compile time (`npm run typecheck`) that no UI key or API error machine code is ever missing in any language.
3. Selected locale is persisted in `localStorage` (`portateka_locale`, falling back to `DEFAULT_LOCALE`) and synchronized with `<html lang="...">`. For authenticated users, the server's `users.locale` is the authoritative source of truth and takes precedence over `localStorage` (see [ADR 0009](./0009-user-locale-and-email-preference-synchronization.md)).

## Consequences
- **Positive:** Zero external i18n bundle overhead; TypeScript immediately flags any missing translation key or newly added API error code across languages; end users only ever see human-readable localized messages.
- **Negative / Trade-offs:** All translations are bundled statically (acceptable and fast for 2 languages in a minimal showcase app).
