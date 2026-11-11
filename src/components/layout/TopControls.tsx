import { Globe, Moon, Sun } from "lucide-react";
import { useI18n } from "../../i18n/I18nProvider";
import type { SupportedLocale } from "../../i18n/types";
import { useTheme } from "../../theme/ThemeProvider";
import { Button } from "../ui";

export function TopControls() {
  const { locale, setLocale, t } = useI18n();
  const { resolvedScheme, toggleScheme } = useTheme();

  const nextLocale: SupportedLocale = locale === "en-US" ? "bg-BG" : "en-US";
  const themeActionLabel =
    resolvedScheme === "dark"
      ? t.preferences.themeToggleToLight
      : t.preferences.themeToggleToDark;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--primitive-space-2)",
      }}
    >
      <Button
        variant="ghost"
        size="sm"
        aria-label={`${t.preferences.languageLabel}: ${t.preferences.languages[nextLocale]}`}
        onClick={() => setLocale(nextLocale)}
      >
        <Globe aria-hidden="true" size={16} />
        <span>{locale === "en-US" ? "BG" : "EN"}</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        aria-label={themeActionLabel}
        onClick={toggleScheme}
      >
        {resolvedScheme === "dark" ? (
          <Sun aria-hidden="true" size={18} />
        ) : (
          <Moon aria-hidden="true" size={18} />
        )}
      </Button>
    </div>
  );
}
