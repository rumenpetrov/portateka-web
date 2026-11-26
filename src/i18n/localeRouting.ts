import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "./types";
import type { SupportedLocale } from "./types";

export const SITE_ORIGIN = "https://portateka.rpetrov.dev";

const SUPPORTED_LOCALES_PATTERN = SUPPORTED_LOCALES.join("|");

export const SPA_ROUTE_PATTERN = new RegExp(
  `^\\/(?:${SUPPORTED_LOCALES_PATTERN})\\/app(?:\\/.*)?$`,
  "i",
);

export const LOCALE_NOT_FOUND_PATTERN = new RegExp(
  `^\\/(?:${SUPPORTED_LOCALES_PATTERN})\\/404(?:\\.html|\\/)?$`,
  "i",
);

export function isSupportedLocale(
  value: string | null | undefined,
): value is SupportedLocale {
  if (!value) {
    return false;
  }
  return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

export function matchCanonicalLocale(
  segment: string | null | undefined,
): SupportedLocale | null {
  if (!segment) {
    return null;
  }

  const normalized = segment.toLowerCase();
  const matched = SUPPORTED_LOCALES.find(
    (locale) => locale.toLowerCase() === normalized,
  );
  return matched ?? null;
}

export function detectBrowserLocale(
  languages?: readonly string[],
): SupportedLocale {
  const candidates =
    languages ??
    (typeof navigator !== "undefined"
      ? navigator.languages.length > 0
        ? navigator.languages
        : navigator.language
          ? [navigator.language]
          : []
      : []);

  for (const candidate of candidates) {
    const exact = matchCanonicalLocale(candidate);
    if (exact) {
      return exact;
    }

    const primaryLanguage = candidate.split("-")[0]?.toLowerCase();
    if (!primaryLanguage) {
      continue;
    }

    const byLanguage = SUPPORTED_LOCALES.find(
      (locale) => locale.split("-")[0]?.toLowerCase() === primaryLanguage,
    );
    if (byLanguage) {
      return byLanguage;
    }
  }

  return DEFAULT_LOCALE;
}

export function normalizeTrailingSlash(pathname: string): string {
  if (pathname.length <= 1) {
    return "/";
  }

  const trimmed = pathname.replace(/\/+$/, "");
  if (trimmed === "") {
    return "/";
  }

  return trimmed;
}

export interface ExtractedLocalePath {
  rawLocale: string;
  locale: SupportedLocale;
  isCanonical: boolean;
  restPath: string;
}

export function extractLocaleFromPathname(
  pathname: string,
): ExtractedLocalePath | null {
  const trimmedLeading = pathname.replace(/^\/+/, "");
  if (!trimmedLeading) {
    return null;
  }

  const slashIndex = trimmedLeading.indexOf("/");
  const firstSegment =
    slashIndex === -1 ? trimmedLeading : trimmedLeading.slice(0, slashIndex);
  const canonical = matchCanonicalLocale(firstSegment);

  if (!canonical) {
    return null;
  }

  const rawRest = slashIndex === -1 ? "" : trimmedLeading.slice(slashIndex);
  const restPath = rawRest === "/" ? "" : normalizeTrailingSlash(rawRest);

  return {
    rawLocale: firstSegment,
    locale: canonical,
    isCanonical: firstSegment === canonical,
    restPath: restPath === "/" ? "" : restPath,
  };
}

function splitPathAndSuffix(path: string): {
  pathname: string;
  suffix: string;
} {
  const queryIndex = path.indexOf("?");
  const hashIndex = path.indexOf("#");

  let splitIndex = -1;
  if (queryIndex !== -1 && hashIndex !== -1) {
    splitIndex = Math.min(queryIndex, hashIndex);
  } else if (queryIndex !== -1) {
    splitIndex = queryIndex;
  } else if (hashIndex !== -1) {
    splitIndex = hashIndex;
  }

  if (splitIndex === -1) {
    return { pathname: path, suffix: "" };
  }

  return {
    pathname: path.slice(0, splitIndex),
    suffix: path.slice(splitIndex),
  };
}

function normalizeRelativeSubpath(path: string): {
  pathname: string;
  suffix: string;
} {
  const { pathname, suffix } = splitPathAndSuffix(path);
  const normalizedPathname = normalizeTrailingSlash(
    pathname.startsWith("/") ? pathname : `/${pathname}`,
  );
  return { pathname: normalizedPathname, suffix };
}

export function buildLocalizedPath(
  locale: SupportedLocale,
  path: string,
): string {
  const { pathname, suffix } = normalizeRelativeSubpath(path);

  if (pathname === "/") {
    return `/${locale}${suffix}`;
  }

  return `/${locale}${pathname}${suffix}`;
}

export function buildAppPath(
  locale: SupportedLocale,
  path: string,
): string {
  const { pathname, suffix } = normalizeRelativeSubpath(path);

  if (pathname === "/") {
    return `/${locale}/app${suffix}`;
  }

  return `/${locale}/app${pathname}${suffix}`;
}

export function replaceLocaleInUrl(
  pathname: string,
  search: string,
  hash: string,
  nextLocale: SupportedLocale,
): string {
  const extracted = extractLocaleFromPathname(pathname);
  const subpath = extracted ? extracted.restPath || "/" : pathname;
  return `${buildLocalizedPath(nextLocale, subpath)}${search}${hash}`;
}

export function buildCanonicalUrl(
  locale: SupportedLocale,
  subpath: string,
): string {
  return `${SITE_ORIGIN}${buildLocalizedPath(locale, subpath)}`;
}
