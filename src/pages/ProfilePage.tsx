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
  Input,
  Modal,
  Select,
  Spinner,
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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--primitive-space-6)",
      }}
    >
      <div>
        <h1
          style={{
            fontSize: "var(--primitive-text-2xl)",
            fontWeight: "var(--primitive-weight-bold)",
          }}
        >
          {t.profile.title}
        </h1>
        <p
          style={{
            color: "var(--theme-text-secondary)",
            fontSize: "var(--primitive-text-sm)",
          }}
        >
          {t.profile.subtitle}
        </p>
      </div>

      <Card>
        <CardHeader>
          <div>
            <h2
              style={{
                fontSize: "var(--primitive-text-lg)",
                fontWeight: "var(--primitive-weight-semibold)",
              }}
            >
              {user.email}
            </h2>
            {user.createdAt ? (
              <p
                style={{
                  fontSize: "var(--primitive-text-xs)",
                  color: "var(--theme-text-muted)",
                  marginBlockStart: "var(--primitive-space-1)",
                }}
              >
                {t.profile.memberSinceLabel}: {formatDate(user.createdAt)}
              </p>
            ) : null}
          </div>

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
          <div>
            <h2
              style={{
                fontSize: "var(--primitive-text-lg)",
                fontWeight: "var(--primitive-weight-semibold)",
              }}
            >
              {t.profile.changePassword.title}
            </h2>
            <p
              style={{
                fontSize: "var(--primitive-text-xs)",
                color: "var(--theme-text-muted)",
                marginBlockStart: "var(--primitive-space-1)",
              }}
            >
              {t.profile.changePassword.subtitle}
            </p>
          </div>
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
          <div>
            <h2
              style={{
                fontSize: "var(--primitive-text-lg)",
                fontWeight: "var(--primitive-weight-semibold)",
                color: "var(--theme-danger)",
              }}
            >
              {t.profile.dangerZone.title}
            </h2>
            <p
              style={{
                fontSize: "var(--primitive-text-xs)",
                color: "var(--theme-text-muted)",
                marginBlockStart: "var(--primitive-space-1)",
              }}
            >
              {t.profile.dangerZone.subtitle}
            </p>
          </div>
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
        <p
          style={{
            color: "var(--theme-text-secondary)",
            fontSize: "var(--primitive-text-sm)",
            marginBlockEnd: "var(--primitive-space-4)",
          }}
        >
          {t.profile.dangerZone.deleteModalDescription}
        </p>

        <div style={{ marginBlockEnd: "var(--primitive-space-5)" }}>
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

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--primitive-space-2)",
          }}
        >
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
        </div>
      </Modal>
    </div>
  );
}
