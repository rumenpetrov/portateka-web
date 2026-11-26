import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { useMeQuery } from "@/api/auth.api";
import { usePropertyQuery } from "@/api/properties.api";
import { WelcomeBetaCard } from "@/components/features/home/WelcomeBetaCard";
import {
  PropertyCard,
  PropertyCardSkeleton,
} from "@/components/features/properties/PropertyCard";
import { Button, Flex } from "@/components/ui";
import { useI18n } from "@/i18n/I18nProvider";
import styles from "./HomePage.module.css";

export function HomePage() {
  const { localizePath, t } = useI18n();
  const meQuery = useMeQuery();
  const preferredPropertyId = meQuery.data?.preferredPropertyId ?? null;
  const propertyQuery = usePropertyQuery(preferredPropertyId ?? "");

  const isLoadingPreferredProperty =
    meQuery.isPending ||
    (Boolean(preferredPropertyId) && propertyQuery.isPending);

  return (
    <Flex direction="column" gap={6}>
      <WelcomeBetaCard t={t}>
        <Flex direction="column" className={styles.ctaGroup}>
          <Button
            as={Link}
            to={localizePath("/properties")}
            variant="primary"
            fullWidth
          >
            <span>{t.home.goToProperties}</span>
            <ArrowRight aria-hidden="true" size={18} />
          </Button>
        </Flex>
      </WelcomeBetaCard>

      {isLoadingPreferredProperty ? (
        <div role="status" aria-busy="true">
          <span className="visually-hidden">{t.common.loading}</span>
          <PropertyCardSkeleton showToggleAction={false} />
        </div>
      ) : preferredPropertyId && propertyQuery.data ? (
        <PropertyCard property={propertyQuery.data} isPreferred />
      ) : null}
    </Flex>
  );
}
