import { useEffect, useState } from "react";
import { Plus, RefreshCw } from "lucide-react";
import { Link, useSearchParams } from "react-router";
import { useMeQuery, useUpdateMeMutation } from "@/api/auth.api";
import { usePropertiesQuery } from "@/api/properties.api";
import { PropertyCard } from "@/components/features/properties/PropertyCard";
import { useNotifications } from "@/notifications/NotificationProvider";
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  EmptyState,
  Flex,
  Pagination,
  Skeleton,
  Text,
} from "@/components/ui";
import { useI18n } from "@/i18n/I18nProvider";
import type { ApiErrorShape } from "@/i18n/types";
import {
  PROPERTIES_PAGE_LIMIT,
  parsePageParam,
} from "@/validators/paginationValidators";
import styles from "./PropertiesListPage.module.css";

const SKELETON_CARD_KEYS = [0, 1, 2] as const;

export function PropertiesListPage() {
  const { t, translateApiError } = useI18n();
  const { notifySuccess } = useNotifications();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parsePageParam(searchParams.get("page"));

  const meQuery = useMeQuery();
  const propertiesQuery = usePropertiesQuery({
    page,
    limit: PROPERTIES_PAGE_LIMIT,
  });
  const updateMeMutation = useUpdateMeMutation();

  const [updatingPropertyId, setUpdatingPropertyId] = useState<string | null>(
    null,
  );

  const properties = propertiesQuery.data?.data ?? [];
  const pagination = propertiesQuery.data?.pagination;

  useEffect(() => {
    if (propertiesQuery.isPlaceholderData || !pagination) {
      return;
    }

    if (pagination.totalPages === 0 && page > 1) {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.delete("page");
          return next;
        },
        { replace: true },
      );
      return;
    }

    if (pagination.totalPages > 0 && page > pagination.totalPages) {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (pagination.totalPages <= 1) {
            next.delete("page");
          } else {
            next.set("page", String(pagination.totalPages));
          }
          return next;
        },
        { replace: true },
      );
    }
  }, [page, pagination, propertiesQuery.isPlaceholderData, setSearchParams]);

  const handlePageChange = (nextPage: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (nextPage <= 1) {
        next.delete("page");
      } else {
        next.set("page", String(nextPage));
      }
      return next;
    });
  };

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

  const isLoading = propertiesQuery.isPending;
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

        <Button as={Link} to="/properties/new" variant="primary">
          <Plus aria-hidden="true" size={18} />
          <span>{t.properties.createButton}</span>
        </Button>
      </Flex>

      {isLoading ? (
        <div className={styles.grid} role="status" aria-busy="true">
          <span className="visually-hidden">{t.common.loading}</span>
          {SKELETON_CARD_KEYS.map((key) => (
            <Card key={key} as="article">
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
                <Skeleton variant="rect" width="7.5rem" height="2rem" />
                <Skeleton variant="rect" width="6.5rem" height="2rem" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : propertiesQuery.isError ? (
        <EmptyState
          title={t.common.errorTitle}
          description={translateApiError(
            propertiesQuery.error as ApiErrorShape | undefined,
          )}
          action={
            <Button
              type="button"
              variant="primary"
              isLoading={propertiesQuery.isFetching}
              onClick={() => {
                void propertiesQuery.refetch();
                if (meQuery.isError) {
                  void meQuery.refetch();
                }
              }}
            >
              <RefreshCw aria-hidden="true" size={16} />
              <span>{t.common.retry}</span>
            </Button>
          }
        />
      ) : properties.length === 0 ? (
        <EmptyState
          title={t.properties.emptyTitle}
          description={t.properties.emptyDescription}
          action={
            <Button as={Link} to="/properties/new" variant="primary">
              <Plus aria-hidden="true" size={18} />
              <span>{t.properties.createButton}</span>
            </Button>
          }
        />
      ) : (
        <>
          <div className={styles.grid}>
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

          {pagination ? (
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              disabled={propertiesQuery.isFetching}
              navigationLabel={t.common.pagination.navigationLabel}
              previousLabel={t.common.pagination.previous}
              nextLabel={t.common.pagination.next}
              pageIndicatorLabel={t.common.pagination.pageOf(
                pagination.page,
                pagination.totalPages,
              )}
              onPageChange={handlePageChange}
            />
          ) : null}
        </>
      )}
    </Flex>
  );
}
