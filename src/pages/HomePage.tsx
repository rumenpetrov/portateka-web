import { ArrowRight, LogIn, UserPlus } from "lucide-react";
import { useAuthToken } from "@/api/auth.api";
import {
  Alert,
  Anchor,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui";
import { useI18n } from "@/i18n/I18nProvider";

export function HomePage() {
  const { t } = useI18n();
  const token = useAuthToken();

  return (
    <Card>
      <CardHeader>
        <div>
          <div
            style={{
              marginBlockEnd: "var(--primitive-space-2)",
            }}
          >
            <Badge variant="warning" solid>
              {t.app.betaBadge}
            </Badge>
          </div>
          <h1
            style={{
              fontSize: "var(--primitive-text-2xl)",
              fontWeight: "var(--primitive-weight-bold)",
            }}
          >
            {t.home.title}
          </h1>
          <p
            style={{
              color: "var(--theme-text-secondary)",
              fontSize: "var(--primitive-text-sm)",
              marginBlockStart: "var(--primitive-space-1)",
            }}
          >
            {t.home.subtitle}
          </p>
        </div>
      </CardHeader>

      <CardContent>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--primitive-space-4)",
          }}
        >
          <Alert variant="warning">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--primitive-space-2)",
              }}
            >
              <strong>{t.home.betaWarningTitle}</strong>
              <p>{t.home.betaWarningMessage}</p>
              <p style={{ fontWeight: "var(--primitive-weight-medium)" }}>
                {t.home.betaDataLossNote}
              </p>
            </div>
          </Alert>

          {token ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginBlockStart: "var(--primitive-space-2)",
              }}
            >
              <Button
                as={Anchor}
                to="/properties"
                variant="primary"
                fullWidth
              >
                <span>{t.home.goToProperties}</span>
                <ArrowRight aria-hidden="true" size={18} />
              </Button>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--primitive-space-2)",
                marginBlockStart: "var(--primitive-space-2)",
              }}
            >
              <Button
                as={Anchor}
                to="/sign-in"
                variant="primary"
                fullWidth
              >
                <LogIn aria-hidden="true" size={18} />
                <span>{t.home.signInCta}</span>
              </Button>
              <Button as={Anchor} to="/sign-up" fullWidth>
                <UserPlus aria-hidden="true" size={18} />
                <span>{t.home.signUpCta}</span>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
