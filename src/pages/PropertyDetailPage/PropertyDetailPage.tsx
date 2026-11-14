import { useState } from "react";
import { ArrowLeft, RefreshCw, Star, Trash2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import { useMeQuery, useUpdateMeMutation } from "@/api/auth.api";
import { isApiClientError } from "@/api/client";
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
  Modal,
  Skeleton,
  Text,
} from "@/components/ui";
import { useI18n } from "@/i18n/I18nProvider";
import type { ApiErrorShape } from "@/i18n/types";

export function PropertyDetailPage() {
  const { id = "" } = useParams<{ id: string }>();
  const { t, formatDate, translateApiError } = useI18n();
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
      <Flex direction="column" gap={5} role="status" aria-busy="true">
        <span className="visually-hidden">{t.common.loading}</span>

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
            </Flex>

            <Skeleton variant="text" width="14rem" height="2rem" />
            <Skeleton variant="text" width="16rem" height="0.875rem" />
          </Flex>

          <Flex wrap gap={2}>
            <Skeleton variant="rect" width="7.5rem" height="2rem" />
            <Skeleton variant="rect" width="6rem" height="2rem" />
          </Flex>
        </Flex>

        <Card>
          <CardHeader>
            <Text variant="card-title">
              {t.properties.detail.editSectionTitle}
            </Text>
          </CardHeader>
          <CardContent>
            <Flex direction="column" gap={4}>
              <Flex direction="column" gap={1}>
                <Skeleton variant="text" width="6rem" height="1rem" />
                <Skeleton variant="rect" width="100%" height="2.75rem" />
              </Flex>

              <Flex direction="column" gap={1}>
                <Skeleton variant="text" width="8rem" height="1rem" />
                <Skeleton variant="rect" width="100%" height="5.5rem" />
              </Flex>

              <Flex direction="column" gap={1}>
                <Skeleton variant="text" width="5rem" height="1rem" />
                <Skeleton variant="rect" width="100%" height="5.5rem" />
              </Flex>

              <Skeleton variant="rect" width="100%" height="2.75rem" />
            </Flex>
          </CardContent>
        </Card>
      </Flex>
    );
  }

  if (propertyQuery.isError || !propertyQuery.data) {
    const isNotFound =
      isApiClientError(propertyQuery.error) &&
      propertyQuery.error.status === 404;

    if (isNotFound) {
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

    return (
      <EmptyState
        title={t.common.errorTitle}
        description={translateApiError(
          propertyQuery.error as ApiErrorShape | undefined,
        )}
        action={
          <Flex wrap justify="center" gap={2}>
            <Button
              type="button"
              variant="primary"
              isLoading={propertyQuery.isFetching}
              onClick={() => {
                void propertyQuery.refetch();
              }}
            >
              <RefreshCw aria-hidden="true" size={16} />
              <span>{t.common.retry}</span>
            </Button>
            <Button as={Link} to="/properties" variant="secondary">
              <ArrowLeft aria-hidden="true" size={16} />
              <span>{t.common.back}</span>
            </Button>
          </Flex>
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
