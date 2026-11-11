# ADR 0008: Portable Zod v4 Schemas and React Hook Form Integration

- **Status:** Accepted
- **Date:** 2026-11-11

## Context
`portateka-api` and `portateka-web` are independent repositories that cannot import code from each other directly, yet they share identical validation rules and field machine error codes (`required`, `invalid_email`, `password_too_short`, `too_long`, etc.). We want client-side validation and form state management using `react-hook-form` and `zod` (v4) in a way that allows copying validator schemas verbatim between backend and frontend.

## Decision
1. **Mirrored Validator Files (`src/validators/authValidators.ts`, `src/validators/propertyValidators.ts`):**
   Keep the Zod v4 schemas identical to `portateka-api/src/validators/*` so any schema change on the backend can be copied directly into the frontend without translation glue inside the schema definitions.
2. **Machine-Code Resolver & `useAppForm` (`src/hooks/useAppForm.ts`):**
   - Implement a lightweight Zod v4 resolver (`createZodMachineResolver`) that extracts the first issue per field (`issue.message`, which is a short machine code) — matching `formatIssues` in `portateka-api/src/validators/validate.ts`.
   - Default to `mode: "onTouched"` and `reValidateMode: "onChange"` so errors appear only after the user finishes interacting with a field (`blur`) and clear immediately as they fix the value (`input`).
   - Store the **machine code** in `formState.errors[field].message` (for both client-side Zod issues and server-side `applyServerErrors(err)`), and translate it at render time via `getFieldError(field)` using the active locale dictionary (`en-US` or `bg-BG`).
3. **Disabling Controls During Submission via Native `<fieldset disabled>`:**
   - Wrap form controls inside `<fieldset className="ui-fieldset" disabled={isPending}>` driven by the mutation/submission pending state, rather than passing `disabled: true` into `useForm({ disabled })` or `register(field, { disabled })`.
   - In `react-hook-form`, setting `disabled: true` on registered fields or the form configuration marks those fields as disabled in RHF's internal state and strips their values (`undefined`), which can interfere with submission payloads, re-renders, or error recovery.
   - Native `<fieldset disabled>` locks all descendant `<input>`, `<textarea>`, `<select>`, and `<button>` elements (including auxiliary controls like password visibility toggles and cancel buttons) at the DOM level without mutating RHF form state, and also covers auto-triggered mutations on mount (such as URL token verification on `VerifyEmailPage`).

## Consequences
- **Positive:** 100% copy-pasteable Zod v4 schemas between `portateka-api` and `portateka-web`; unified handling of client and server validation errors; switching UI language dynamically re-translates active form errors on screen without re-validating.
- **Negative / Trade-offs:** Optional empty strings in HTML text inputs (like `lastName` on sign-up) should be normalized (e.g. `setValueAs: (v) => (v === "" ? undefined : v)`) when registering fields whose backend schema expects `.min(1).optional()`.
