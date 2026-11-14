import type { ReactNode } from "react";
import { Text } from "./Text";
import styles from "./EmptyState.module.css";

export interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className={styles.emptyState}>
      <Text variant="card-title">{title}</Text>
      {description ? (
        <Text
          variant="subtitle"
          tone="secondary"
          className={styles.description}
        >
          {description}
        </Text>
      ) : null}
      {action ? <div className={styles.action}>{action}</div> : null}
    </div>
  );
}
