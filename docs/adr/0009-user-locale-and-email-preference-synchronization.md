# ADR 0009: User Locale Synchronization and Email Preference

- **Status:** Accepted
- **Date:** 2026-11-12

## Context
While the web application supports client-side localization for UI copy and API machine error codes (ADR 0004), transactional emails (verification, password reset, account deletion) are sent by the backend (`portateka-api`) and must be delivered in the user's preferred language. We need a clear precedence model and bidirectional synchronization mechanism so that the user's language choice is honored consistently across devices and email notifications.

## Decision

### 1. Source of Truth & Precedence Hierarchy
The user language precedence is defined as follows (updated alongside [ADR 0012](./0012-locale-prefixed-url-routing-and-seo.md) when migrating from `localStorage` to locale-prefixed URLs):
1. **Direct URL navigation (highest priority for rendering):** All application routes live under `/:locale/...` (`en-US`, `bg-BG`). Navigating directly to `/bg-BG/properties` or `/en-US/properties` renders in the URL locale without forcing a redirect or mutating `users.locale`.
2. **Sign-in (`POST /api/auth/sign-in/email`):** The server returns `user.locale`, and the client redirects immediately to `/:user.locale/properties` so the authenticated session lands in the user's preferred language.
3. **Unprefixed entry (`/` or legacy unprefixed paths):** Without `localStorage`, unprefixed paths detect the best match from `navigator.languages` (exact BCP 47 match first, then primary language prefix, fallback `DEFAULT_LOCALE`) and replace-redirect to `/:detectedLocale/...`.
4. **Registration (`POST /api/auth/sign-up/email`):**
   - The sign-up form pre-fills the language selection with the active URL locale (falling back to `DEFAULT_LOCALE`), staying synced if the user switches language before editing the field.
   - Options are generated from `SUPPORTED_LOCALES` with no option for an empty language field in the UI.
   - The chosen locale is explicitly included in the sign-up payload so the verification email is delivered in that language and links directly to `/:locale/verify-email`.

### 2. Bidirectional Updates
When a user switches language explicitly:
- **`TopControls` header toggle:** Renders a crawlable `<Link replace>` to the alternate locale URL (preserving subpath, query string, and hash). When authenticated, clicking it also fires `PATCH /api/auth/me` with `{ locale }` in the background.
- **`ProfilePage` language selector:** Navigates (`replace: true`) to the new locale URL via `setLocale` and fires `PATCH /api/auth/me` with `{ locale }` in the background.

### 3. Type-Safe Constants & Errors
`SUPPORTED_LOCALES` and `DEFAULT_LOCALE` in `src/i18n/types.ts` are used across components, `I18nProvider`, and `src/validators/authValidators.ts` (avoiding hardcoded locale strings in UI or validation logic). The shared validation schemas (`signUpEmailSchema`, `updateMeSchema`) validate `locale` against `SUPPORTED_LOCALES` (`z.enum(SUPPORTED_LOCALES, { error: "invalid_locale" })`), keeping `src/validators/authValidators.ts` mirrored with `portateka-api` (ADR 0008). Any invalid value is rejected with the machine code `invalid_locale`, which is translated by the type-safe dictionary (`t.errors.fields.invalid_locale`).

## Consequences
- **Positive:** Transactional emails always match the user's chosen language; seamless multi-device experience where logging in adapts the UI to the user's stored account preference; zero circular dependencies between React Query and the i18n provider.
- **Negative / Trade-offs:** Language switching while signed in incurs a background network mutation (`PATCH /api/auth/me`).
