import type { ReactNode } from "react";
import { Card, CardContent, Flex, Text } from "@/components/ui";
import styles from "./AuthCard.module.css";

export interface AuthCardProps {
  title: string;
  subtitle: string;
  footer?: ReactNode;
  children: ReactNode;
}

export function AuthCard({ title, subtitle, footer, children }: AuthCardProps) {
  return (
    <Card>
      <CardContent>
        <Flex direction="column" gap={1} className={styles.header}>
          <Text variant="section-title" as="h1">
            {title}
          </Text>
          <Text variant="subtitle" tone="secondary">
            {subtitle}
          </Text>
        </Flex>

        {children}

        {footer ? (
          <Text
            as="div"
            variant="subtitle"
            tone="secondary"
            align="center"
            className={styles.footer}
          >
            {footer}
          </Text>
        ) : null}
      </CardContent>
    </Card>
  );
}
