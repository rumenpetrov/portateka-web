import { Globe, Moon, Sun } from "lucide-react";
import { Button, Flex } from "@/components/ui";
import type { SupportedLocale } from "@/i18n/types";

export interface PublicTopControlsViewProps {
  nextLocaleUrl?: string;
  nextLocale?: SupportedLocale;
  nextLocaleShortCode?: string;
  nextLocaleAriaLabel?: string;
  themeToggleToDarkLabel: string;
  themeToggleToLightLabel: string;
}

export function PublicTopControlsView({
  nextLocaleUrl,
  nextLocale,
  nextLocaleShortCode,
  nextLocaleAriaLabel,
  themeToggleToDarkLabel,
  themeToggleToLightLabel,
}: PublicTopControlsViewProps) {
  return (
    <Flex align="center" gap={2}>
      {nextLocaleUrl &&
      nextLocale &&
      nextLocaleShortCode &&
      nextLocaleAriaLabel ? (
        <Button
          as="a"
          href={nextLocaleUrl}
          hrefLang={nextLocale}
          variant="ghost"
          size="sm"
          aria-label={nextLocaleAriaLabel}
        >
          <Globe aria-hidden="true" size={16} />
          <span>{nextLocaleShortCode}</span>
        </Button>
      ) : null}

      <Button
        variant="ghost"
        size="sm"
        data-theme-toggle=""
        data-label-to-dark={themeToggleToDarkLabel}
        data-label-to-light={themeToggleToLightLabel}
        aria-label={themeToggleToDarkLabel}
      >
        <span data-theme-icon="light" hidden style={{ display: "inline-flex" }}>
          <Sun aria-hidden="true" size={18} />
        </span>
        <span data-theme-icon="dark" style={{ display: "inline-flex" }}>
          <Moon aria-hidden="true" size={18} />
        </span>
      </Button>
    </Flex>
  );
}
