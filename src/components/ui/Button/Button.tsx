import type { ComponentPropsWithoutRef, ElementType } from "react";
import { clsx } from "clsx";
import { Spinner } from "../Spinner";
import styles from "./Button.module.css";
import type { ButtonProps, ButtonVariant } from "./Button.types";

const VARIANT_CLASSES: Record<Exclude<ButtonVariant, "secondary">, string> = {
  primary: styles.primary,
  ghost: styles.ghost,
  danger: styles.danger,
};

export function Button<C extends ElementType = "button">({
  as,
  variant = "secondary",
  size = "md",
  fullWidth = false,
  isLoading = false,
  className,
  children,
  ...rest
}: ButtonProps<C>) {
  const Component = (as ?? "button") as ElementType;
  const classes = clsx(
    styles.btn,
    variant !== "secondary" && VARIANT_CLASSES[variant],
    size === "sm" && styles.sm,
    fullWidth && styles.fullWidth,
    className,
  );

  if (Component === "button") {
    const buttonRest = rest as ComponentPropsWithoutRef<"button">;
    const { type = "button", disabled, ...otherButtonProps } = buttonRest;

    return (
      <button
        type={type}
        className={classes}
        disabled={disabled || isLoading}
        {...otherButtonProps}
      >
        {isLoading ? <Spinner size="1em" /> : null}
        <span className={styles.content}>{children}</span>
      </button>
    );
  }

  return (
    <Component
      className={classes}
      aria-busy={isLoading || undefined}
      {...rest}
    >
      {isLoading ? <Spinner size="1em" /> : null}
      <span className={styles.content}>{children}</span>
    </Component>
  );
}
