import { Link } from "react-router";
import { Button, EmptyState } from "@/components/ui";
import { useI18n } from "@/i18n/I18nProvider";

export function NotFoundPage() {
  const { localizePath, t } = useI18n();

  return (
    <EmptyState
      title={t.notFound.title}
      description={t.notFound.description}
      action={
        <Button as={Link} to={localizePath("/")} variant="primary">
          {t.notFound.backHome}
        </Button>
      }
    />
  );
}
