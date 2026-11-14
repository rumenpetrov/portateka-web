import { useState } from "react";
import { Plus } from "lucide-react";
import { useMeQuery, useUpdateMeMutation } from "@/api/auth.api";
import { usePropertiesQuery } from "@/api/properties.api";
import { PropertyCard } from "@/components/features/properties/PropertyCard";
import { useNotifications } from "@/components/notifications/NotificationProvider";
import { Anchor, Button, EmptyState, Flex, LoadingState, Text } from "@/components/ui";
import { useI18n } from "@/i18n/I18nProvider";

export function PropertiesListPage() {
  const { t } = useI18n();
  const { notifySuccess } = useNotifications();
  const meQuery = useMeQuery();
  const propertiesQuery = usePropertiesQuery();
  const updateMeMutation = useUpdateMeMutation();

  const [updatingPropertyId, setUpdatingPropertyId] = useState<string | null>(
    null,
  );

  const handleTogglePreferred = async (
    propertyId: string,
    nextPreferred: boolean,
  ) => {
    setUpdatingPropertyId(propertyId);
    try {
      await updateMeMutation.mutateAsync({
        preferredPropertyId: nextPreferred ? propertyId : null,
      });
      notifySuccess(t.properties.preferredUpdatedNotification);
    } finally {
      setUpdatingPropertyId(null);
    }
  };

  if (propertiesQuery.isPending || meQuery.isPending) {
    return <LoadingState label={t.common.loading} />;
  }

  const properties = propertiesQuery.data ?? [];
  const preferredPropertyId = meQuery.data?.preferredPropertyId ?? null;

  return (
    <Flex direction="column" gap={6}>
      <Flex wrap align="center" justify="between" gap={3}>
        <div>
          <Text variant="page-title">{t.properties.listTitle}</Text>
          <Text variant="subtitle" tone="secondary">
            {t.properties.listSubtitle}
          </Text>
        </div>

        <Button as={Anchor} to="/properties/new" variant="primary">
          <Plus aria-hidden="true" size={18} />
          <span>{t.properties.createButton}</span>
        </Button>
      </Flex>

      {properties.length === 0 ? (
        <EmptyState
          title={t.properties.emptyTitle}
          description={t.properties.emptyDescription}
          action={
            <Button as={Anchor} to="/properties/new" variant="primary">
              <Plus aria-hidden="true" size={18} />
              <span>{t.properties.createButton}</span>
            </Button>
          }
        />
      ) : (
        <div className="property-grid">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              isPreferred={preferredPropertyId === property.id}
              isUpdatingPreferred={
                updateMeMutation.isPending && updatingPropertyId === property.id
              }
              onTogglePreferred={handleTogglePreferred}
            />
          ))}
        </div>
      )}
    </Flex>
  );
}
