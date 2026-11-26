import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import {
  COLOR_SCHEME_STORAGE_KEY,
  computeToggledColorScheme,
  getSystemScheme,
  persistColorScheme,
  readStoredColorScheme,
  resolveColorScheme,
  syncMetaColorScheme,
} from "./colorScheme";
import type { ColorSchemePreference, ResolvedColorScheme } from "./colorScheme";

export type { ColorSchemePreference, ResolvedColorScheme };

interface ThemeContextValue {
  preference: ColorSchemePreference;
  resolvedScheme: ResolvedColorScheme;
  setPreference: (next: ColorSchemePreference) => void;
  toggleScheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ColorSchemePreference>(
    readStoredColorScheme,
  );
  const [systemScheme, setSystemScheme] =
    useState<ResolvedColorScheme>(getSystemScheme);

  useEffect(() => {
    syncMetaColorScheme(preference);
  }, [preference]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleMediaChange = (event: MediaQueryListEvent) => {
      setSystemScheme(event.matches ? "dark" : "light");
    };

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === COLOR_SCHEME_STORAGE_KEY) {
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
    persistColorScheme(next);
  }, []);

  const resolvedScheme = resolveColorScheme(preference, systemScheme);

  const toggleScheme = useCallback(() => {
    setPreference(computeToggledColorScheme(preference, systemScheme));
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
