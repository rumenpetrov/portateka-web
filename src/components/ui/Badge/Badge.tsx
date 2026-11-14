import { clsx } from "clsx";
import styles from "./Badge.module.css";
import type { BadgeProps, BadgeVariant } from "./Badge.types";

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
