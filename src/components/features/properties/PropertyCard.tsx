import { ArrowRight, Star } from "lucide-react";
import type { PropertyItem } from "@/api/properties.api";
import { useI18n } from "@/i18n/I18nProvider";
import {
  Anchor,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui";
import { PreferredPropertyBadge } from "./PreferredPropertyBadge";

interface PropertyCardProps {
  property: PropertyItem;
  isPreferred: boolean;
  isUpdatingPreferred: boolean;
  onTogglePreferred: (propertyId: string, nextPreferred: boolean) => void;
}

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
        <div>
          <h2
            style={{
              fontSize: "var(--primitive-text-lg)",
              fontWeight: "var(--primitive-weight-semibold)",
            }}
          >
            <Anchor
              to={`/properties/${property.id}`}
              tone="primary"
              underline="none"
            >
              {property.name}
            </Anchor>
          </h2>
          <p
            style={{
              fontSize: "var(--primitive-text-xs)",
              color: "var(--theme-text-muted)",
              marginBlockStart: "var(--primitive-space-1)",
            }}
          >
            {t.properties.createdAtLabel}: {formatDate(property.createdAt)}
          </p>
        </div>

        <PreferredPropertyBadge isPreferred={isPreferred} />
      </CardHeader>

      <CardContent>
        {property.description ? (
          <p
            style={{
              color: "var(--theme-text-secondary)",
              fontSize: "var(--primitive-text-sm)",
              whiteSpace: "pre-wrap",
              overflowWrap: "anywhere",
            }}
          >
            {property.description}
          </p>
        ) : null}

        {property.notes ? (
          <p
            style={{
              color: "var(--theme-text-muted)",
              fontSize: "var(--primitive-text-xs)",
              marginBlockStart: "var(--primitive-space-3)",
              paddingBlockStart: "var(--primitive-space-2)",
              borderBlockStart: "1px dashed var(--theme-border-subtle)",
              whiteSpace: "pre-wrap",
              overflowWrap: "anywhere",
            }}
          >
            {property.notes}
          </p>
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
          as={Anchor}
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
