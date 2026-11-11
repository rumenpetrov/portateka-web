import type { ReactNode } from "react";

export interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="ui-empty-state">
      <h2
        style={{
          fontSize: "var(--primitive-text-lg)",
          fontWeight: "var(--primitive-weight-semibold)",
        }}
      >
        {title}
      </h2>
      {description ? (
        <p
          style={{
            color: "var(--theme-text-secondary)",
            fontSize: "var(--primitive-text-sm)",
            maxInlineSize: "30rem",
          }}
        >
          {description}
        </p>
      ) : null}
      {action ? (
        <div style={{ marginBlockStart: "var(--primitive-space-2)" }}>
          {action}
        </div>
      ) : null}
    </div>
  );
}
