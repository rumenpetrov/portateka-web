import { Link } from "react-router";
import { Button, EmptyState } from "@/components/ui";
import { useI18n } from "@/i18n/I18nProvider";

export function NotFoundPage() {
  const { t } = useI18n();

  return (
    <EmptyState
      title={t.notFound.title}
      description={t.notFound.description}
      action={
        <Button as={Link} to="/" variant="primary">
          {t.notFound.backHome}
        </Button>
      }
    />
  );
}
