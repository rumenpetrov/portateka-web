# ADR 0003: Server State with TanStack Query and Abstract Error Handling

- **Status:** Accepted
- **Date:** 2026-11-11

## Context
All interactions with `portateka-api` return either `{ data: T }` on success or `{ code: ErrorCode, resource?: Resource, params?: Record<string, string> }` on error (plus potential non-JSON `429` / `403` responses from Cloudflare WAF at the edge). Manually managing loading states, caching, cache invalidation (such as updating `users.preferredPropertyId` when a first property is created or a preferred property is deleted), and repetitive error toasts in every component leads to boilerplate and inconsistent UX.

## Decision
1. Use **TanStack Query (`@tanstack/react-query`)** with structured query keys (`["auth", "me"]`, `["properties"]`, `["properties", id]`, `["health"]`) to manage all server state.
2. Normalize all non-2xx responses in `src/api/client.ts` into an `ApiClientError` instance containing `status`, `code`, `resource`, and `params` (falling back gracefully when Cloudflare WAF returns non-JSON `429`/`403` bodies).
3. Handle errors in two coordinated layers:
   - **Field-level validation errors (`params`):** Mapped directly to form fields via a localized helper when `code === "VALIDATION_ERROR"` or field-specific `FORBIDDEN` (`email_not_verified`).
   - **Abstract global notifications:** Configured in React Query's `QueryCache` and `MutationCache` `onError` callbacks to automatically translate and display human-readable toast notifications for top-level errors (`UNAUTHORIZED`, `NOT_FOUND`, `INTERNAL_SERVER_ERROR`, `RATE_LIMITED`, `NETWORK_ERROR`), while clearing expired sessions on `401`.

## Consequences
- **Positive:** Components stay declarative and focused on UI; mutations automatically invalidate related queries (`me` and `properties`); unhandled API errors always surface as localized user-friendly notifications.
- **Negative / Trade-offs:** Requires discipline to use `meta: { skipGlobalErrorToast: true }` (or automatic detection of field-handled errors) when a form wishes to suppress a duplicate toast for inline field validation errors.
