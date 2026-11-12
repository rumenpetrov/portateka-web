import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import { bgBG } from "./bg-BG";
import { enUS } from "./en-US";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "./types";
import type {
  ApiErrorShape,
  FieldMachineCodeKey,
  SupportedLocale,
  TranslationDictionary,
} from "./types";

const LOCALE_STORAGE_KEY = "portateka_locale";

const DICTIONARIES: Record<SupportedLocale, TranslationDictionary> = {
  "en-US": enUS,
  "bg-BG": bgBG,
};

function isSupportedLocale(value: string | null): value is SupportedLocale {
  if (!value) {
    return false;
  }
  return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

function readInitialLocale(): SupportedLocale {
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (isSupportedLocale(stored)) {
      return stored;
    }
  } catch {
    // Ignore storage access errors
  }
  return DEFAULT_LOCALE;
}

export function translateFieldMachineCode(
  field: string,
  machineCode: string,
  t: TranslationDictionary,
): string {
  if (machineCode === "too_long") {
    if (field === "email") {
      return t.errors.fields.emailTooLong;
    }
    if (field === "description") {
      return t.errors.fields.descriptionTooLong;
    }
    if (field === "notes") {
      return t.errors.fields.notesTooLong;
    }
    if (field === "name" || field === "firstName" || field === "lastName") {
      return t.errors.fields.nameTooLong;
    }
  }

  const knownFieldMessages = t.errors.fields as Record<string, string>;
  const matched = knownFieldMessages[machineCode as FieldMachineCodeKey];
  if (matched) {
    return matched;
  }

  return t.errors.topLevel.VALIDATION_ERROR.default;
}

export function translateFieldErrorsFromShape(
  error: ApiErrorShape | null | undefined,
  t: TranslationDictionary,
): Record<string, string> {
  if (!error?.params) {
    return {};
  }

  // Only map field validation machine codes (422 VALIDATION_ERROR, 409 ALREADY_EXISTS, or 403 FORBIDDEN email_not_verified)
  if (
    error.code !== "VALIDATION_ERROR" &&
    error.code !== "ALREADY_EXISTS" &&
    error.code !== "FORBIDDEN"
  ) {
    return {};
  }

  const result: Record<string, string> = {};
  for (const [field, machineCode] of Object.entries(error.params)) {
    result[field] = translateFieldMachineCode(field, machineCode, t);
  }
  return result;
}

export function translateApiErrorFromShape(
  error: ApiErrorShape | null | undefined,
  t: TranslationDictionary,
  options?: { isSignInAttempt?: boolean },
): string {
  if (!error) {
    return t.errors.topLevel.INTERNAL_SERVER_ERROR.default;
  }

  if (error.status === 429 || error.code === "RATE_LIMITED") {
    return t.errors.topLevel.RATE_LIMITED;
  }

  if (error.code === "NETWORK_ERROR") {
    return t.errors.topLevel.NETWORK_ERROR;
  }

  // If the error contains a specific field machine code (e.g. email_not_verified or invalid_or_expired_token),
  // surface that human-readable message when requested as a single summary string.
  if (
    error.params &&
    (error.code === "VALIDATION_ERROR" ||
      error.code === "FORBIDDEN" ||
      error.code === "ALREADY_EXISTS")
  ) {
    const entries = Object.entries(error.params);
    if (entries.length === 1) {
      const firstEntry = entries[0];
      if (firstEntry) {
        return translateFieldMachineCode(firstEntry[0], firstEntry[1], t);
      }
    }
  }

  switch (error.code) {
    case "UNAUTHORIZED": {
      if (options?.isSignInAttempt) {
        return t.errors.topLevel.UNAUTHORIZED.invalidCredentials;
      }
      if (error.resource === "user") {
        return t.errors.topLevel.UNAUTHORIZED.user;
      }
      return t.errors.topLevel.UNAUTHORIZED.default;
    }
    case "FORBIDDEN": {
      if (error.resource === "user") {
        return t.errors.topLevel.FORBIDDEN.user;
      }
      return t.errors.topLevel.FORBIDDEN.default;
    }
    case "NOT_FOUND": {
      if (error.resource === "property") {
        return t.errors.topLevel.NOT_FOUND.property;
      }
      if (error.resource === "user") {
        return t.errors.topLevel.NOT_FOUND.user;
      }
      if (error.resource === "route") {
        return t.errors.topLevel.NOT_FOUND.route;
      }
      return t.errors.topLevel.NOT_FOUND.default;
    }
    case "ALREADY_EXISTS": {
      if (error.resource === "user") {
        return t.errors.topLevel.ALREADY_EXISTS.user;
      }
      if (error.resource === "property") {
        return t.errors.topLevel.ALREADY_EXISTS.property;
      }
      return t.errors.topLevel.ALREADY_EXISTS.default;
    }
    case "VALIDATION_ERROR": {
      return t.errors.topLevel.VALIDATION_ERROR.default;
    }
    case "INTERNAL_SERVER_ERROR": {
      if (error.resource === "user") {
        return t.errors.topLevel.INTERNAL_SERVER_ERROR.user;
      }
      return t.errors.topLevel.INTERNAL_SERVER_ERROR.default;
    }
    default: {
      return t.errors.topLevel.INTERNAL_SERVER_ERROR.default;
    }
  }
}

interface I18nContextValue {
  locale: SupportedLocale;
  setLocale: (next: SupportedLocale) => void;
  t: TranslationDictionary;
  translateApiError: (
    error: ApiErrorShape | null | undefined,
    options?: { isSignInAttempt?: boolean },
  ) => string;
  translateFieldErrors: (
    error: ApiErrorShape | null | undefined,
  ) => Record<string, string>;
  formatDate: (isoOrDate: string | Date) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

let activeLocaleSnapshot: SupportedLocale = readInitialLocale();

export function getActiveDictionary(): TranslationDictionary {
  return DICTIONARIES[activeLocaleSnapshot];
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<SupportedLocale>(readInitialLocale);

  useEffect(() => {
    activeLocaleSnapshot = locale;
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: SupportedLocale) => {
    activeLocaleSnapshot = next;
    setLocaleState(next);
    document.documentElement.lang = next;
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, next);
    } catch {
      // Ignore storage access errors
    }
  }, []);

  const t = DICTIONARIES[locale];

  const translateApiError = useCallback(
    (
      error: ApiErrorShape | null | undefined,
      options?: { isSignInAttempt?: boolean },
    ) => {
      return translateApiErrorFromShape(error, t, options);
    },
    [t],
  );

  const translateFieldErrors = useCallback(
    (error: ApiErrorShape | null | undefined) => {
      return translateFieldErrorsFromShape(error, t);
    },
    [t],
  );

  const formatDate = useCallback(
    (isoOrDate: string | Date) => {
      const date =
        typeof isoOrDate === "string" ? new Date(isoOrDate) : isoOrDate;
      return new Intl.DateTimeFormat(locale, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
    },
    [locale],
  );

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      setLocale,
      t,
      translateApiError,
      translateFieldErrors,
      formatDate,
    }),
    [locale, setLocale, t, translateApiError, translateFieldErrors, formatDate],
  );

  return <I18nContext value={value}>{children}</I18nContext>;
}

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
