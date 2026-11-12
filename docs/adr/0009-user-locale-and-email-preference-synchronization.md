# ADR 0009: User Locale Synchronization and Email Preference

- **Status:** Accepted
- **Date:** 2026-11-12

## Context
While the web application supports client-side localization for UI copy and API machine error codes (ADR 0004), transactional emails (verification, password reset, account deletion) are sent by the backend (`portateka-api`) and must be delivered in the user's preferred language. We need a clear precedence model and bidirectional synchronization mechanism so that the user's language choice is honored consistently across devices and email notifications.

## Decision

### 1. Source of Truth & Precedence Hierarchy
The user language precedence is strictly defined as follows:
1. **Authenticated user (highest priority / single source of truth):** The persisted `users.locale` on the server is the authoritative source of truth.
   - Upon sign-in (`POST /api/auth/sign-in/email`), the server returns `user.locale`, and the client immediately synchronizes the active UI locale to match the server preference.
   - When an authenticated session is restored from an existing token (page reload), `AppLayout` observes `useMeQuery` data and aligns the client locale with `user.locale` whenever the server value loads or changes, overriding any stale local device storage without fighting subsequent user-initiated toggles.
2. **Guest user (unauthenticated):** The client's `localStorage` (`portateka_locale`, falling back to `DEFAULT_LOCALE`) dictates the UI copy.
3. **Registration (`POST /api/auth/sign-up/email`):**
   - The sign-up form pre-fills the language selection with the active UI locale (falling back to `DEFAULT_LOCALE`).
   - Options are generated from `SUPPORTED_LOCALES` with no option for an empty language field in the UI.
   - The chosen locale is explicitly included in the sign-up payload so the verification email is delivered in that language.

### 2. Bidirectional Updates
When an authenticated user toggles or changes their language (via `TopControls` in the header or the language selector on `ProfilePage`):
- The client UI updates immediately (`setLocale`), updating `<html lang="...">` and `localStorage`.
- In the background, `PATCH /api/auth/me` is invoked with `{ locale }` via `useUpdateMeMutation` to update `users.locale` on the server and keep the React Query cache synchronized.

### 3. Type-Safe Constants & Errors
`SUPPORTED_LOCALES` and `DEFAULT_LOCALE` in `src/i18n/types.ts` are used across components, `I18nProvider`, and `src/validators/authValidators.ts` (avoiding hardcoded locale strings in UI or validation logic). The shared validation schemas (`signUpEmailSchema`, `updateMeSchema`) validate `locale` against `SUPPORTED_LOCALES` (`z.enum(SUPPORTED_LOCALES, { error: "invalid_locale" })`), keeping `src/validators/authValidators.ts` mirrored with `portateka-api` (ADR 0008). Any invalid value is rejected with the machine code `invalid_locale`, which is translated by the type-safe dictionary (`t.errors.fields.invalid_locale`).

## Consequences
- **Positive:** Transactional emails always match the user's chosen language; seamless multi-device experience where logging in adapts the UI to the user's stored account preference; zero circular dependencies between React Query and the i18n provider.
- **Negative / Trade-offs:** Language switching while signed in incurs a background network mutation (`PATCH /api/auth/me`).
