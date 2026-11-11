import type { HTMLAttributes, ReactNode } from "react";

export type BadgeVariant =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "danger";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  solid?: boolean;
  children: ReactNode;
}

export function Badge({
  variant = "default",
  solid = false,
  className = "",
  children,
  ...rest
}: BadgeProps) {
  const classes = [
    "ui-badge",
    variant !== "default" ? `ui-badge--${variant}` : "",
    solid ? "ui-badge--solid" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={classes} {...rest}>
      {children}
    </span>
  );
}
