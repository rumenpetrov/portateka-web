import { Link } from "react-router";
import { useI18n } from "../../i18n/I18nProvider";

export function BrandLogo() {
  const { t } = useI18n();

  return (
    <Link to="/" className="brand-logo">
      <span className="brand-logo-text">{t.app.name}</span>
      <span className="brand-logo-badge">{t.app.betaBadge}</span>
    </Link>
  );
}
