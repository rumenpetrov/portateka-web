import { Link } from "react-router";
import { useAuthToken } from "@/api/auth.api";
import { Button, EmptyState } from "@/components/ui";
import { useI18n } from "@/i18n/I18nProvider";
import { buildLocalizedPath } from "@/i18n/localeRouting";

export function NotFoundPage() {
  const token = useAuthToken();
  const { locale, localizePath, t } = useI18n();

  return (
    <EmptyState
      title={t.notFound.title}
      description={t.notFound.description}
      action={
        token ? (
          <Button as={Link} to={localizePath("/")} variant="primary">
            {t.notFound.backHome}
          </Button>
        ) : (
          <Button
            as="a"
            href={buildLocalizedPath(locale, "/")}
            variant="primary"
          >
            {t.notFound.backHome}
          </Button>
        )
      }
    />
  );
}
