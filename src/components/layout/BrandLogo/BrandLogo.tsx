import { useI18n } from "@/i18n/I18nProvider";
import { buildLocalizedPath } from "@/i18n/localeRouting";
import { BrandLogoView } from "./BrandLogoView";

export function BrandLogo() {
  const { locale, t } = useI18n();

  return (
    <BrandLogoView
      href={buildLocalizedPath(locale, "/")}
      name={t.app.name}
      betaBadge={t.app.betaBadge}
    />
  );
}
