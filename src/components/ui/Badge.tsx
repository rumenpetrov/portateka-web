import type { HTMLAttributes, ReactNode } from "react";
import { clsx } from "clsx";
import styles from "./Badge.module.css";

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

const VARIANT_CLASSES: Record<Exclude<BadgeVariant, "default">, string> = {
  primary: styles.primary,
  success: styles.success,
  warning: styles.warning,
  danger: styles.danger,
};

export function Badge({
  variant = "default",
  solid = false,
  className,
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={clsx(
        styles.badge,
        variant !== "default" && VARIANT_CLASSES[variant],
        solid && styles.solid,
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
