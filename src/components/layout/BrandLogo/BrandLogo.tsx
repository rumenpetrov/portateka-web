import { useI18n } from "@/i18n/I18nProvider";
import { BrandLogoView } from "./BrandLogoView";

export function BrandLogo() {
  const { localizePath, t } = useI18n();

  return (
    <BrandLogoView
      href={localizePath("/")}
      name={t.app.name}
      betaBadge={t.app.betaBadge}
    />
  );
}
