import { useState } from "react";
import { Plus } from "lucide-react";
import { Link } from "react-router";
import { useMeQuery, useUpdateMeMutation } from "@/api/auth.api";
import { usePropertiesQuery } from "@/api/properties.api";
import { PropertyCard } from "@/components/features/properties/PropertyCard";
import { useNotifications } from "@/components/notifications/NotificationProvider";
import { EmptyState, Spinner } from "@/components/ui";
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
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          paddingBlock: "var(--primitive-space-10)",
        }}
      >
        <Spinner label={t.common.loading} size="1.75rem" />
      </div>
    );
  }

  const properties = propertiesQuery.data ?? [];
  const preferredPropertyId = meQuery.data?.preferredPropertyId ?? null;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--primitive-space-6)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "var(--primitive-space-3)",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "var(--primitive-text-2xl)",
              fontWeight: "var(--primitive-weight-bold)",
            }}
          >
            {t.properties.listTitle}
          </h1>
          <p
            style={{
              color: "var(--theme-text-secondary)",
              fontSize: "var(--primitive-text-sm)",
            }}
          >
            {t.properties.listSubtitle}
          </p>
        </div>

        <Link to="/properties/new" className="ui-btn ui-btn--primary">
          <Plus aria-hidden="true" size={18} />
          <span>{t.properties.createButton}</span>
        </Link>
      </div>

      {properties.length === 0 ? (
        <EmptyState
          title={t.properties.emptyTitle}
          description={t.properties.emptyDescription}
          action={
            <Link to="/properties/new" className="ui-btn ui-btn--primary">
              <Plus aria-hidden="true" size={18} />
              <span>{t.properties.createButton}</span>
            </Link>
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
    </div>
  );
}
