import { Star } from "lucide-react";
import { useI18n } from "../../../i18n/I18nProvider";
import { Badge } from "../../ui";

interface PreferredPropertyBadgeProps {
  isPreferred: boolean;
}

export function PreferredPropertyBadge({
  isPreferred,
}: PreferredPropertyBadgeProps) {
  const { t } = useI18n();

  if (!isPreferred) {
    return null;
  }

  return (
    <Badge variant="primary" solid>
      <Star aria-hidden="true" size={14} fill="currentColor" />
      <span>{t.properties.preferredBadge}</span>
    </Badge>
  );
}
