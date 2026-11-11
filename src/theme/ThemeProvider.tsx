import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";

export type ColorSchemePreference = "system" | "light" | "dark";
export type ResolvedColorScheme = "light" | "dark";

interface ThemeContextValue {
  preference: ColorSchemePreference;
  resolvedScheme: ResolvedColorScheme;
  setPreference: (next: ColorSchemePreference) => void;
  toggleScheme: () => void;
}

const STORAGE_KEY = "color-scheme";

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getSystemScheme(): ResolvedColorScheme {
  if (typeof window === "undefined") {
    return "light";
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function readStoredPreference(): ColorSchemePreference {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === "light" || raw === "dark") {
      return raw;
    }
  } catch {
    // Ignore storage access errors
  }
  return "system";
}

function syncMetaColorScheme(preference: ColorSchemePreference): void {
  if (typeof document === "undefined") {
    return;
  }
  let meta = document.querySelector<HTMLMetaElement>('meta[name="color-scheme"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "color-scheme";
    document.head.appendChild(meta);
  }
  meta.content = preference === "system" ? "light dark" : preference;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ColorSchemePreference>(
    readStoredPreference,
  );
  const [systemScheme, setSystemScheme] = useState<ResolvedColorScheme>(
    getSystemScheme,
  );

  useEffect(() => {
    syncMetaColorScheme(preference);
  }, [preference]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleMediaChange = (event: MediaQueryListEvent) => {
      setSystemScheme(event.matches ? "dark" : "light");
    };

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        const next: ColorSchemePreference =
          event.newValue === "light" || event.newValue === "dark"
            ? event.newValue
            : "system";
        setPreferenceState(next);
        syncMetaColorScheme(next);
      }
    };

    mediaQuery.addEventListener("change", handleMediaChange);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const setPreference = useCallback((next: ColorSchemePreference) => {
    setPreferenceState(next);
    syncMetaColorScheme(next);
    try {
      if (next === "system") {
        localStorage.removeItem(STORAGE_KEY);
      } else {
        localStorage.setItem(STORAGE_KEY, next);
      }
    } catch {
      // Ignore storage access errors
    }
  }, []);

  const resolvedScheme: ResolvedColorScheme =
    preference === "system" ? systemScheme : preference;

  // Follow modern-web-guidance dark-mode-toggle rule:
  // If toggling to the opposite of what is currently rendered matches the system preference,
  // remove the stored override so the site returns to tracking the system default.
  const toggleScheme = useCallback(() => {
    const currentRendered = preference === "system" ? systemScheme : preference;
    const target: ResolvedColorScheme =
      currentRendered === "dark" ? "light" : "dark";

    if (target === systemScheme) {
      setPreference("system");
    } else {
      setPreference(target);
    }
  }, [preference, systemScheme, setPreference]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      preference,
      resolvedScheme,
      setPreference,
      toggleScheme,
    }),
    [preference, resolvedScheme, setPreference, toggleScheme],
  );

  return <ThemeContext value={value}>{children}</ThemeContext>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
