import type { ReactNode } from "react";
import {
  Alert,
  Badge,
  Card,
  CardContent,
  CardHeader,
  Flex,
  Text,
} from "@/components/ui";
import type { TranslationDictionary } from "@/i18n/types";
import styles from "./WelcomeBetaCard.module.css";

export interface WelcomeBetaCardProps {
  t: TranslationDictionary;
  children: ReactNode;
}

export function WelcomeBetaCard({ t, children }: WelcomeBetaCardProps) {
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

          {children}
        </Flex>
      </CardContent>
    </Card>
  );
}
