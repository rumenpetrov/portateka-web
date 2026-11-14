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
import { useNotifications } from "@/components/notifications/NotificationProvider";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  Flex,
  Input,
  LoadingState,
  Modal,
  Select,
  Text,
} from "@/components/ui";
import { useI18n } from "@/i18n/I18nProvider";
import { SUPPORTED_LOCALES } from "@/i18n/types";
import type { SupportedLocale } from "@/i18n/types";
import { useTheme } from "@/theme/ThemeProvider";
import type { ColorSchemePreference } from "@/theme/ThemeProvider";
import styles from "./ProfilePage.module.css";

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
    return <LoadingState label={t.common.loading} />;
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
        <Text
          variant="subtitle"
          tone="secondary"
          className={styles.modalDescription}
        >
          {t.profile.dangerZone.deleteModalDescription}
        </Text>

        <div className={styles.confirmField}>
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
        </div>

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
      </Modal>
    </Flex>
  );
}
