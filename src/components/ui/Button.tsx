import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { clsx } from "clsx";
import styles from "./Button.module.css";
import { Spinner } from "./Spinner";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md";

type DistributiveOmit<T, K extends PropertyKey> = T extends unknown
  ? Omit<T, K>
  : never;

interface ButtonOwnProps<C extends ElementType = "button"> {
  as?: C;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  className?: string;
  children: ReactNode;
}

export type ButtonProps<C extends ElementType = "button"> = ButtonOwnProps<C> &
  DistributiveOmit<ComponentPropsWithoutRef<C>, keyof ButtonOwnProps<C>>;

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
    "ui-btn",
    variant !== "secondary" && `ui-btn--${variant}`,
    size === "sm" && "ui-btn--sm",
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
