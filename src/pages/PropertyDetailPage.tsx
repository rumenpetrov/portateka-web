import { useState } from "react";
import { ArrowLeft, Star, Trash2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import { useMeQuery, useUpdateMeMutation } from "../api/auth.api";
import {
  useDeletePropertyMutation,
  usePropertyQuery,
  useUpdatePropertyMutation,
} from "../api/properties.api";
import { PreferredPropertyBadge } from "../components/features/properties/PreferredPropertyBadge";
import { PropertyForm } from "../components/features/properties/PropertyForm";
import type { PropertyFormValues } from "../components/features/properties/PropertyForm";
import { useNotifications } from "../components/notifications/NotificationProvider";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  EmptyState,
  Modal,
  Spinner,
} from "../components/ui";
import { useI18n } from "../i18n/I18nProvider";

export function PropertyDetailPage() {
  const { id = "" } = useParams<{ id: string }>();
  const { t, formatDate } = useI18n();
  const { notifySuccess } = useNotifications();
  const navigate = useNavigate();

  const propertyQuery = usePropertyQuery(id);
  const meQuery = useMeQuery();
  const updatePropertyMutation = useUpdatePropertyMutation(id);
  const deletePropertyMutation = useDeletePropertyMutation();
  const updateMeMutation = useUpdateMeMutation();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  if (propertyQuery.isPending) {
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

  if (propertyQuery.isError || !propertyQuery.data) {
    return (
      <EmptyState
        title={t.errors.topLevel.NOT_FOUND.property}
        action={
          <Link to="/properties" className="ui-btn ui-btn--primary">
            <ArrowLeft aria-hidden="true" size={16} />
            <span>{t.common.back}</span>
          </Link>
        }
      />
    );
  }

  const property = propertyQuery.data;
  const isPreferred = meQuery.data?.preferredPropertyId === property.id;

  const handleUpdate = async (
    values: PropertyFormValues,
    applyServerErrors: (err: unknown) => void,
  ) => {
    try {
      await updatePropertyMutation.mutateAsync(values);
      notifySuccess(t.properties.detail.updatedNotification);
      navigate("/properties", { replace: true });
    } catch (err) {
      applyServerErrors(err);
    }
  };

  const handleTogglePreferred = async () => {
    await updateMeMutation.mutateAsync({
      preferredPropertyId: isPreferred ? null : property.id,
    });
    notifySuccess(t.properties.preferredUpdatedNotification);
  };

  const handleConfirmDelete = async () => {
    await deletePropertyMutation.mutateAsync(property.id);
    setDeleteModalOpen(false);
    notifySuccess(t.properties.detail.deletedNotification);
    navigate("/properties", { replace: true });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--primitive-space-5)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "var(--primitive-space-3)",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--primitive-space-2)",
              marginBlockEnd: "var(--primitive-space-1)",
            }}
          >
            <Link
              to="/properties"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "var(--primitive-space-1)",
                fontSize: "var(--primitive-text-sm)",
                color: "var(--theme-text-secondary)",
              }}
            >
              <ArrowLeft aria-hidden="true" size={16} />
              <span>{t.nav.properties}</span>
            </Link>
            <PreferredPropertyBadge isPreferred={isPreferred} />
          </div>

          <h1
            style={{
              fontSize: "var(--primitive-text-2xl)",
              fontWeight: "var(--primitive-weight-bold)",
            }}
          >
            {property.name}
          </h1>

          <p
            style={{
              fontSize: "var(--primitive-text-xs)",
              color: "var(--theme-text-muted)",
              marginBlockStart: "var(--primitive-space-1)",
            }}
          >
            {t.properties.createdAtLabel}: {formatDate(property.createdAt)} ·{" "}
            {t.properties.updatedAtLabel}: {formatDate(property.updatedAt)}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "var(--primitive-space-2)",
          }}
        >
          <Button
            variant="secondary"
            size="sm"
            isLoading={updateMeMutation.isPending}
            onClick={handleTogglePreferred}
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
            variant="danger"
            size="sm"
            onClick={() => setDeleteModalOpen(true)}
          >
            <Trash2 aria-hidden="true" size={16} />
            <span>{t.properties.detail.deleteButton}</span>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <h2
            style={{
              fontSize: "var(--primitive-text-lg)",
              fontWeight: "var(--primitive-weight-semibold)",
            }}
          >
            {t.properties.detail.editSectionTitle}
          </h2>
        </CardHeader>
        <CardContent>
          <PropertyForm
            initialValues={{
              name: property.name,
              description: property.description,
              notes: property.notes,
            }}
            submitLabel={t.properties.detail.saveChanges}
            isSubmitting={updatePropertyMutation.isPending}
            onSubmit={handleUpdate}
          />
        </CardContent>
      </Card>

      <Modal
        open={deleteModalOpen}
        title={t.properties.detail.deleteModalTitle}
        closeLabel={t.common.close}
        onClose={() => setDeleteModalOpen(false)}
      >
        <p
          style={{
            color: "var(--theme-text-secondary)",
            fontSize: "var(--primitive-text-sm)",
            marginBlockEnd: "var(--primitive-space-5)",
          }}
        >
          {t.properties.detail.deleteModalDescription}
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--primitive-space-2)",
          }}
        >
          <Button
            variant="danger"
            isLoading={deletePropertyMutation.isPending}
            onClick={handleConfirmDelete}
          >
            <Trash2 aria-hidden="true" size={16} />
            <span>{t.properties.detail.deleteConfirmButton}</span>
          </Button>
          <Button
            variant="secondary"
            onClick={() => setDeleteModalOpen(false)}
          >
            {t.common.cancel}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
