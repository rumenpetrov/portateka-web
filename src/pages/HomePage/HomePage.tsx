import { ArrowRight, LogIn, UserPlus } from "lucide-react";
import { Link } from "react-router";
import { useAuthToken } from "@/api/auth.api";
import {
  Alert,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  Flex,
  Text,
} from "@/components/ui";
import { useI18n } from "@/i18n/I18nProvider";
import styles from "./HomePage.module.css";

export function HomePage() {
  const { t } = useI18n();
  const token = useAuthToken();

  return (
    <Card>
      <CardHeader>
        <div>
          <div className={styles.headerBadge}>
            <Badge variant="warning" solid>
              {t.app.betaBadge}
            </Badge>
          </div>
          <Flex direction="column" gap={1}>
            <Text variant="page-title">{t.home.title}</Text>
            <Text variant="subtitle" tone="secondary">
              {t.home.subtitle}
            </Text>
          </Flex>
        </div>
      </CardHeader>

      <CardContent>
        <Flex direction="column" gap={4}>
          <Alert variant="warning">
            <Flex direction="column" gap={2}>
              <strong>{t.home.betaWarningTitle}</strong>
              <p>{t.home.betaWarningMessage}</p>
              <p>
                <strong>{t.home.betaDataLossNote}</strong>
              </p>
            </Flex>
          </Alert>

          {token ? (
            <Flex direction="column" className={styles.ctaGroup}>
              <Button
                as={Link}
                to="/properties"
                variant="primary"
                fullWidth
              >
                <span>{t.home.goToProperties}</span>
                <ArrowRight aria-hidden="true" size={18} />
              </Button>
            </Flex>
          ) : (
            <Flex direction="column" gap={2} className={styles.ctaGroup}>
              <Button
                as={Link}
                to="/sign-in"
                variant="primary"
                fullWidth
              >
                <LogIn aria-hidden="true" size={18} />
                <span>{t.home.signInCta}</span>
              </Button>
              <Button as={Link} to="/sign-up" fullWidth>
                <UserPlus aria-hidden="true" size={18} />
                <span>{t.home.signUpCta}</span>
              </Button>
            </Flex>
          )}
        </Flex>
      </CardContent>
    </Card>
  );
}
