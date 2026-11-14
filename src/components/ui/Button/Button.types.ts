import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

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
