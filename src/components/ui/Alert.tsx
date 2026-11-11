import type { HTMLAttributes, ReactNode } from "react";

export type AlertVariant = "info" | "success" | "warning" | "danger";

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  children: ReactNode;
}

const ICONS: Record<AlertVariant, string> = {
  info: "ℹ",
  success: "✓",
  warning: "⚠",
  danger: "✕",
};

export function Alert({
  variant = "info",
  className = "",
  children,
  ...rest
}: AlertProps) {
  const classes = [
    "ui-alert",
    variant !== "info" ? `ui-alert--${variant}` : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      role={variant === "danger" ? "alert" : "status"}
      className={classes}
      {...rest}
    >
      <span aria-hidden="true" style={{ fontWeight: 700 }}>
        {ICONS[variant]}
      </span>
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
}
