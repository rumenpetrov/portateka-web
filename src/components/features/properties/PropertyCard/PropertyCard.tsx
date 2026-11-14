import { ArrowRight, Star } from "lucide-react";
import { Link } from "react-router";
import { useI18n } from "@/i18n/I18nProvider";
import {
  Anchor,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  Flex,
  Text,
} from "@/components/ui";
import { PreferredPropertyBadge } from "../PreferredPropertyBadge";
import styles from "./PropertyCard.module.css";
import type { PropertyCardProps } from "./PropertyCard.types";

export function PropertyCard({
  property,
  isPreferred,
  isUpdatingPreferred,
  onTogglePreferred,
}: PropertyCardProps) {
  const { t, formatDate } = useI18n();

  return (
    <Card as="article">
      <CardHeader>
        <Flex direction="column" gap={1}>
          <Text variant="card-title">
            <Anchor
              as={Link}
              to={`/properties/${property.id}`}
              tone="primary"
              underline="none"
            >
              {property.name}
            </Anchor>
          </Text>
          <Text variant="caption" tone="muted">
            {t.properties.createdAtLabel}: {formatDate(property.createdAt)}
          </Text>
        </Flex>

        <PreferredPropertyBadge isPreferred={isPreferred} />
      </CardHeader>

      <CardContent>
        {property.description ? (
          <Text
            variant="subtitle"
            tone="secondary"
            className={styles.description}
          >
            {property.description}
          </Text>
        ) : null}

        {property.notes ? (
          <Text
            variant="caption"
            tone="muted"
            className={styles.notes}
          >
            {property.notes}
          </Text>
        ) : null}
      </CardContent>

      <CardFooter>
        <Button
          variant="ghost"
          size="sm"
          isLoading={isUpdatingPreferred}
          onClick={() => onTogglePreferred(property.id, !isPreferred)}
        >
          <Star
            aria-hidden="true"
            size={16}
            fill={isPreferred ? "currentColor" : "none"}
          />
          <span>
            {isPreferred
              ? t.properties.clearPreferredButton
              : t.properties.setPreferredButton}
          </span>
        </Button>

        <Button
          as={Link}
          to={`/properties/${property.id}`}
          variant="primary"
          size="sm"
        >
          <span>{t.properties.viewDetailsButton}</span>
          <ArrowRight aria-hidden="true" size={16} />
        </Button>
      </CardFooter>
    </Card>
  );
}
