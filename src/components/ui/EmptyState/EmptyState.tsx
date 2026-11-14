import { Text } from "../Text";
import styles from "./EmptyState.module.css";
import type { EmptyStateProps } from "./EmptyState.types";

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
