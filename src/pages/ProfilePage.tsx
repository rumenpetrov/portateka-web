import { useMeQuery } from "@/api/auth.api";
import { usePropertiesQuery } from "@/api/properties.api";
import { ChangePasswordForm } from "@/components/features/profile/ChangePasswordForm";
import { ProfileForm } from "@/components/features/profile/ProfileForm";
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  Select,
  Spinner,
} from "@/components/ui";
import { useI18n } from "@/i18n/I18nProvider";
import type { SupportedLocale } from "@/i18n/types";
import { useTheme } from "@/theme/ThemeProvider";
import type { ColorSchemePreference } from "@/theme/ThemeProvider";

export function ProfilePage() {
  const { locale, setLocale, t, formatDate } = useI18n();
  const { preference, setPreference } = useTheme();
  const meQuery = useMeQuery();
  const propertiesQuery = usePropertiesQuery();

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
            options={[
              { value: "en-US", label: t.preferences.languages["en-US"] },
              { value: "bg-BG", label: t.preferences.languages["bg-BG"] },
            ]}
            onChange={(e) => setLocale(e.target.value as SupportedLocale)}
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
    </div>
  );
}
