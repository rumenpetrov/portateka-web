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
  Skeleton,
  Text,
} from "@/components/ui";
import { PreferredPropertyBadge } from "../PreferredPropertyBadge";
import styles from "./PropertyCard.module.css";
import type {
  PropertyCardProps,
  PropertyCardSkeletonProps,
} from "./PropertyCard.types";

export function PropertyCard({
  property,
  isPreferred,
  isUpdatingPreferred = false,
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
        {onTogglePreferred ? (
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
        ) : null}

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

export function PropertyCardSkeleton({
  showToggleAction = true,
}: PropertyCardSkeletonProps) {
  return (
    <Card as="article">
      <CardHeader>
        <Flex direction="column" gap={1}>
          <Skeleton variant="text" width="10rem" height="1.375rem" />
          <Skeleton variant="text" width="7.5rem" height="0.875rem" />
        </Flex>

        <Skeleton variant="circle" width="5rem" height="1.375rem" />
      </CardHeader>

      <CardContent>
        <Flex direction="column" gap={2}>
          <Skeleton variant="text" width="100%" height="1rem" />
          <Skeleton variant="text" width="75%" height="0.875rem" />
        </Flex>
      </CardContent>

      <CardFooter>
        {showToggleAction ? (
          <Skeleton variant="rect" width="7.5rem" height="2rem" />
        ) : null}
        <Skeleton variant="rect" width="6.5rem" height="2rem" />
      </CardFooter>
    </Card>
  );
}
