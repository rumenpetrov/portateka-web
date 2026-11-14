import type { ReactNode } from "react";
import { Text } from "./Text";

export interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="ui-empty-state">
      <Text variant="card-title">{title}</Text>
      {description ? (
        <Text
          variant="subtitle"
          tone="secondary"
          style={{ maxInlineSize: "30rem" }}
        >
          {description}
        </Text>
      ) : null}
      {action ? (
        <div style={{ marginBlockStart: "var(--primitive-space-2)" }}>
          {action}
        </div>
      ) : null}
    </div>
  );
}
