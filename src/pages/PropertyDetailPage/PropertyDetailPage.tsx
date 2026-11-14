import { useState } from "react";
import { ArrowLeft, Star, Trash2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import { useMeQuery, useUpdateMeMutation } from "@/api/auth.api";
import {
  useDeletePropertyMutation,
  usePropertyQuery,
  useUpdatePropertyMutation,
} from "@/api/properties.api";
import { PreferredPropertyBadge } from "@/components/features/properties/PreferredPropertyBadge";
import { PropertyForm } from "@/components/features/properties/PropertyForm";
import type { PropertyFormValues } from "@/components/features/properties/PropertyForm";
import { useNotifications } from "@/notifications/NotificationProvider";
import {
  Anchor,
  Button,
  Card,
  CardContent,
  CardHeader,
  EmptyState,
  Flex,
  LoadingState,
  Modal,
  Text,
} from "@/components/ui";
import { useI18n } from "@/i18n/I18nProvider";

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
    return <LoadingState label={t.common.loading} />;
  }

  if (propertyQuery.isError || !propertyQuery.data) {
    return (
      <EmptyState
        title={t.errors.topLevel.NOT_FOUND.property}
        action={
          <Button as={Link} to="/properties" variant="primary">
            <ArrowLeft aria-hidden="true" size={16} />
            <span>{t.common.back}</span>
          </Button>
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
    <Flex direction="column" gap={5}>
      <Flex wrap align="start" justify="between" gap={3}>
        <Flex direction="column" gap={1}>
          <Flex align="center" gap={2}>
            <Anchor as={Link} to="/properties" tone="secondary">
              <Flex as="span" inline align="center" gap={1}>
                <ArrowLeft aria-hidden="true" size={16} />
                <Text as="span" variant="subtitle">
                  {t.nav.properties}
                </Text>
              </Flex>
            </Anchor>
            <PreferredPropertyBadge isPreferred={isPreferred} />
          </Flex>

          <Text variant="page-title">{property.name}</Text>

          <Text variant="caption" tone="muted">
            {t.properties.createdAtLabel}: {formatDate(property.createdAt)} ·{" "}
            {t.properties.updatedAtLabel}: {formatDate(property.updatedAt)}
          </Text>
        </Flex>

        <Flex wrap gap={2}>
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
        </Flex>
      </Flex>

      <Card>
        <CardHeader>
          <Text variant="card-title">{t.properties.detail.editSectionTitle}</Text>
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
        <Flex direction="column" gap={5}>
          <Text variant="subtitle" tone="secondary">
            {t.properties.detail.deleteModalDescription}
          </Text>

          <Flex direction="column" gap={2}>
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
          </Flex>
        </Flex>
      </Modal>
    </Flex>
  );
}
