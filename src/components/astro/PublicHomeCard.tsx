import { ArrowRight, LogIn, UserPlus } from "lucide-react";
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
import { buildLocalizedPath } from "@/i18n/localeRouting";
import type { SupportedLocale, TranslationDictionary } from "@/i18n/types";
import styles from "@/spa/pages/HomePage/HomePage.module.css";

export interface PublicHomeCardProps {
  locale: SupportedLocale;
  t: TranslationDictionary;
}

export function PublicHomeCard({ locale, t }: PublicHomeCardProps) {
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

          <Flex
            direction="column"
            gap={2}
            className={styles.ctaGroup}
            data-auth-guest=""
          >
            <Button
              as="a"
              href={buildLocalizedPath(locale, "/app/sign-in")}
              variant="primary"
              fullWidth
            >
              <LogIn aria-hidden="true" size={18} />
              <span>{t.home.signInCta}</span>
            </Button>
            <Button
              as="a"
              href={buildLocalizedPath(locale, "/app/sign-up")}
              fullWidth
            >
              <UserPlus aria-hidden="true" size={18} />
              <span>{t.home.signUpCta}</span>
            </Button>
          </Flex>

          <Flex
            direction="column"
            className={styles.ctaGroup}
            data-auth-user=""
            hidden
          >
            <Button
              as="a"
              href={buildLocalizedPath(locale, "/app")}
              variant="primary"
              fullWidth
            >
              <span>{t.home.openAppCta}</span>
              <ArrowRight aria-hidden="true" size={18} />
            </Button>
          </Flex>
        </Flex>
      </CardContent>
    </Card>
  );
}
