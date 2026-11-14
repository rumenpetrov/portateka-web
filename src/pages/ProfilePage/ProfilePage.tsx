import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router";
import {
  useDeleteMeMutation,
  useMeQuery,
  useSignOut,
  useUpdateMeMutation,
} from "@/api/auth.api";
import { usePropertiesQuery } from "@/api/properties.api";
import { ChangePasswordForm } from "@/components/features/profile/ChangePasswordForm";
import { ProfileForm } from "@/components/features/profile/ProfileForm";
import { useNotifications } from "@/notifications/NotificationProvider";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  Flex,
  Input,
  Modal,
  Select,
  Skeleton,
  Text,
} from "@/components/ui";
import { useI18n } from "@/i18n/I18nProvider";
import { SUPPORTED_LOCALES } from "@/i18n/types";
import type { SupportedLocale } from "@/i18n/types";
import { useTheme } from "@/theme/ThemeProvider";
import type { ColorSchemePreference } from "@/theme/ThemeProvider";

export function ProfilePage() {
  const { locale, setLocale, t, formatDate } = useI18n();
  const { preference, setPreference } = useTheme();
  const { notifySuccess } = useNotifications();
  const navigate = useNavigate();
  const signOut = useSignOut();

  const meQuery = useMeQuery();
  const propertiesQuery = usePropertiesQuery();
  const deleteMeMutation = useDeleteMeMutation();
  const updateMeMutation = useUpdateMeMutation();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  if (meQuery.isPending || propertiesQuery.isPending) {
    return (
      <Flex direction="column" gap={6}>
        <div>
          <Text variant="page-title">{t.profile.title}</Text>
          <Text variant="subtitle" tone="secondary">
            {t.profile.subtitle}
          </Text>
        </div>

        <Flex direction="column" gap={6} role="status" aria-busy="true">
          <span className="visually-hidden">{t.common.loading}</span>

          <Card>
            <CardHeader>
              <Flex direction="column" gap={1}>
                <Skeleton variant="text" width="12rem" height="1.375rem" />
                <Skeleton variant="text" width="9rem" height="0.875rem" />
              </Flex>

              <Skeleton variant="circle" width="5.5rem" height="1.375rem" />
            </CardHeader>

            <CardContent>
              <Flex direction="column" gap={4}>
                <Flex direction="column" gap={1}>
                  <Skeleton variant="text" width="6rem" height="1rem" />
                  <Skeleton variant="rect" width="100%" height="2.75rem" />
                </Flex>

                <Flex direction="column" gap={1}>
                  <Skeleton variant="text" width="6rem" height="1rem" />
                  <Skeleton variant="rect" width="100%" height="2.75rem" />
                </Flex>

                <Flex direction="column" gap={1}>
                  <Skeleton variant="text" width="9rem" height="1rem" />
                  <Skeleton variant="rect" width="100%" height="2.75rem" />
                </Flex>

                <Skeleton variant="rect" width="100%" height="2.75rem" />
              </Flex>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Flex direction="column" gap={1}>
                <Skeleton variant="text" width="10rem" height="1.375rem" />
                <Skeleton variant="text" width="14rem" height="0.875rem" />
              </Flex>
            </CardHeader>

            <CardContent>
              <Flex direction="column" gap={4}>
                <Flex direction="column" gap={1}>
                  <Skeleton variant="text" width="8rem" height="1rem" />
                  <Skeleton variant="rect" width="100%" height="2.75rem" />
                </Flex>

                <Flex direction="column" gap={1}>
                  <Skeleton variant="text" width="7rem" height="1rem" />
                  <Skeleton variant="rect" width="100%" height="2.75rem" />
                </Flex>

                <Skeleton variant="rect" width="100%" height="2.75rem" />
              </Flex>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Flex direction="column" gap={4}>
                <Flex direction="column" gap={1}>
                  <Skeleton variant="text" width="5rem" height="1rem" />
                  <Skeleton variant="rect" width="100%" height="2.75rem" />
                </Flex>

                <Flex direction="column" gap={1}>
                  <Skeleton variant="text" width="5rem" height="1rem" />
                  <Skeleton variant="rect" width="100%" height="2.75rem" />
                </Flex>
              </Flex>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Flex direction="column" gap={1}>
                <Skeleton variant="text" width="8rem" height="1.375rem" />
                <Skeleton variant="text" width="16rem" height="0.875rem" />
              </Flex>
            </CardHeader>

            <CardContent>
              <Skeleton variant="rect" width="100%" height="2.75rem" />
            </CardContent>
          </Card>
        </Flex>
      </Flex>
    );
  }

  const user = meQuery.data;
  if (!user) {
    return null;
  }

  const isDeleteConfirmed = confirmText === t.profile.dangerZone.confirmKeyword;

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setConfirmText("");
  };

  const handleConfirmDeleteAccount = async () => {
    if (!isDeleteConfirmed) {
      return;
    }

    await deleteMeMutation.mutateAsync();
    handleCloseDeleteModal();
    signOut();
    notifySuccess(t.profile.dangerZone.deletedNotification);
    navigate("/", { replace: true });
  };

  return (
    <Flex direction="column" gap={6}>
      <div>
        <Text variant="page-title">{t.profile.title}</Text>
        <Text variant="subtitle" tone="secondary">
          {t.profile.subtitle}
        </Text>
      </div>

      <Card>
        <CardHeader>
          <Flex direction="column" gap={1}>
            <Text variant="card-title">{user.email}</Text>
            {user.createdAt ? (
              <Text variant="caption" tone="muted">
                {t.profile.memberSinceLabel}: {formatDate(user.createdAt)}
              </Text>
            ) : null}
          </Flex>

          <Badge variant={user.emailVerified ? "success" : "warning"}>
            {user.emailVerified
              ? t.profile.emailVerifiedBadge
              : t.profile.emailUnverifiedBadge}
          </Badge>
        </CardHeader>

        <CardContent>
          <ProfileForm
            user={user}
            properties={propertiesQuery.data ?? []}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Flex direction="column" gap={1}>
            <Text variant="card-title">{t.profile.changePassword.title}</Text>
            <Text variant="caption" tone="muted">
              {t.profile.changePassword.subtitle}
            </Text>
          </Flex>
        </CardHeader>

        <CardContent>
          <ChangePasswordForm />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Flex direction="column" gap={4}>
            <Select
              id="profile-language-select"
              label={t.preferences.languageLabel}
              value={locale}
              options={SUPPORTED_LOCALES.map((supportedLocale) => ({
                value: supportedLocale,
                label: t.preferences.languages[supportedLocale],
              }))}
              onChange={(e) => {
                const next = e.target.value as SupportedLocale;
                setLocale(next);
                updateMeMutation.mutate({ locale: next });
              }}
            />

            <Select
              id="profile-theme-select"
              label={t.preferences.themeLabel}
              value={preference}
              options={[
                { value: "system", label: t.preferences.themes.system },
                { value: "light", label: t.preferences.themes.light },
                { value: "dark", label: t.preferences.themes.dark },
              ]}
              onChange={(e) =>
                setPreference(e.target.value as ColorSchemePreference)
              }
            />
          </Flex>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Flex direction="column" gap={1}>
            <Text variant="card-title" tone="danger">
              {t.profile.dangerZone.title}
            </Text>
            <Text variant="caption" tone="muted">
              {t.profile.dangerZone.subtitle}
            </Text>
          </Flex>
        </CardHeader>

        <CardContent>
          <Button
            type="button"
            variant="danger"
            fullWidth
            onClick={() => setDeleteModalOpen(true)}
          >
            <Trash2 aria-hidden="true" size={16} />
            <span>{t.profile.dangerZone.deleteButton}</span>
          </Button>
        </CardContent>
      </Card>

      <Modal
        open={deleteModalOpen}
        title={t.profile.dangerZone.deleteModalTitle}
        closeLabel={t.common.close}
        onClose={handleCloseDeleteModal}
      >
        <Flex direction="column" gap={4}>
          <Text variant="subtitle" tone="secondary">
            {t.profile.dangerZone.deleteModalDescription}
          </Text>

          <Input
            id="profile-delete-confirm-input"
            type="text"
            autoComplete="off"
            spellCheck={false}
            label={t.profile.dangerZone.confirmInputLabel}
            placeholder={t.profile.dangerZone.confirmKeyword}
            value={confirmText}
            disabled={deleteMeMutation.isPending}
            onChange={(e) => setConfirmText(e.target.value)}
          />

          <Flex direction="column" gap={2}>
            <Button
              type="button"
              variant="danger"
              disabled={!isDeleteConfirmed}
              isLoading={deleteMeMutation.isPending}
              onClick={handleConfirmDeleteAccount}
            >
              <Trash2 aria-hidden="true" size={16} />
              <span>{t.profile.dangerZone.deleteConfirmButton}</span>
            </Button>
            <Button
              type="button"
              variant="secondary"
              disabled={deleteMeMutation.isPending}
              onClick={handleCloseDeleteModal}
            >
              {t.common.cancel}
            </Button>
          </Flex>
        </Flex>
      </Modal>
    </Flex>
  );
}
