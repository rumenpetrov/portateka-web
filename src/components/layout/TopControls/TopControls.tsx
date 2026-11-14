import { Globe, Moon, Sun } from "lucide-react";
import { useAuthToken, useUpdateMeMutation } from "@/api/auth.api";
import { useI18n } from "@/i18n/I18nProvider";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "@/i18n/types";
import type { SupportedLocale } from "@/i18n/types";
import { useTheme } from "@/theme/ThemeProvider";
import { Button, Flex } from "@/components/ui";

export function TopControls() {
  const { locale, setLocale, t } = useI18n();
  const { resolvedScheme, toggleScheme } = useTheme();
  const token = useAuthToken();
  const updateMeMutation = useUpdateMeMutation();

  const currentLocaleIndex = SUPPORTED_LOCALES.indexOf(locale);
  const nextLocale: SupportedLocale =
    SUPPORTED_LOCALES[(currentLocaleIndex + 1) % SUPPORTED_LOCALES.length] ??
    DEFAULT_LOCALE;
  const nextLocaleShortCode =
    nextLocale.split("-")[0]?.toUpperCase() ?? nextLocale;
  const themeActionLabel =
    resolvedScheme === "dark"
      ? t.preferences.themeToggleToLight
      : t.preferences.themeToggleToDark;

  const handleToggleLocale = () => {
    setLocale(nextLocale);
    if (token) {
      updateMeMutation.mutate({ locale: nextLocale });
    }
  };

  return (
    <Flex align="center" gap={2}>
      <Button
        variant="ghost"
        size="sm"
        aria-label={`${t.preferences.languageLabel}: ${t.preferences.languages[nextLocale]}`}
        onClick={handleToggleLocale}
      >
        <Globe aria-hidden="true" size={16} />
        <span>{nextLocaleShortCode}</span>
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
    </Flex>
  );
}
