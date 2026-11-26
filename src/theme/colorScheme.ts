export const COLOR_SCHEME_STORAGE_KEY = "color-scheme";
export const THEME_COLOR_LIGHT = "#faf8fc";
export const THEME_COLOR_DARK = "#111318";

export type ColorSchemePreference = "system" | "light" | "dark";
export type ResolvedColorScheme = "light" | "dark";

export function getSystemScheme(): ResolvedColorScheme {
  if (typeof window === "undefined") {
    return "light";
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function readStoredColorScheme(): ColorSchemePreference {
  try {
    const raw = localStorage.getItem(COLOR_SCHEME_STORAGE_KEY);
    if (raw === "light" || raw === "dark") {
      return raw;
    }
  } catch {
    // Ignore storage access errors
  }
  return "system";
}

export function resolveColorScheme(
  preference: ColorSchemePreference,
  systemScheme: ResolvedColorScheme,
): ResolvedColorScheme {
  if (preference === "system") {
    return systemScheme;
  }
  return preference;
}

export function syncMetaColorScheme(preference: ColorSchemePreference): void {
  if (typeof document === "undefined") {
    return;
  }

  let meta = document.querySelector<HTMLMetaElement>(
    'meta[name="color-scheme"]',
  );
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "color-scheme";
    document.head.appendChild(meta);
  }
  meta.content = preference === "system" ? "light dark" : preference;

  const lightThemeMeta = document.querySelector<HTMLMetaElement>(
    'meta[name="theme-color"][media="(prefers-color-scheme: light)"]',
  );
  const darkThemeMeta = document.querySelector<HTMLMetaElement>(
    'meta[name="theme-color"][media="(prefers-color-scheme: dark)"]',
  );
  if (lightThemeMeta) {
    lightThemeMeta.content =
      preference === "dark" ? THEME_COLOR_DARK : THEME_COLOR_LIGHT;
  }
  if (darkThemeMeta) {
    darkThemeMeta.content =
      preference === "light" ? THEME_COLOR_LIGHT : THEME_COLOR_DARK;
  }
}

export function persistColorScheme(next: ColorSchemePreference): void {
  syncMetaColorScheme(next);
  try {
    if (next === "system") {
      localStorage.removeItem(COLOR_SCHEME_STORAGE_KEY);
    } else {
      localStorage.setItem(COLOR_SCHEME_STORAGE_KEY, next);
    }
  } catch {
    // Ignore storage access errors
  }
}

// If toggling to the opposite of what is currently rendered matches the system preference,
// remove the stored override so the site returns to tracking the system default.
export function computeToggledColorScheme(
  preference: ColorSchemePreference,
  systemScheme: ResolvedColorScheme,
): ColorSchemePreference {
  const currentRendered = resolveColorScheme(preference, systemScheme);
  const target: ResolvedColorScheme =
    currentRendered === "dark" ? "light" : "dark";

  if (target === systemScheme) {
    return "system";
  }
  return target;
}
