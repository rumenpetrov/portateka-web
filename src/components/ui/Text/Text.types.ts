import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

export type TextVariant =
  | "page-title"
  | "section-title"
  | "card-title"
  | "body"
  | "subtitle"
  | "caption";

export type TextTone =
  | "inherit"
  | "primary"
  | "secondary"
  | "muted"
  | "danger";

export type TextAlign = "start" | "center" | "end";

type DistributiveOmit<T, K extends PropertyKey> = T extends unknown
  ? Omit<T, K>
  : never;

interface TextOwnProps<C extends ElementType = "p"> {
  as?: C;
  variant?: TextVariant;
  tone?: TextTone;
  align?: TextAlign;
  className?: string;
  children?: ReactNode;
}

export type TextProps<C extends ElementType = "p"> = TextOwnProps<C> &
  DistributiveOmit<ComponentPropsWithoutRef<C>, keyof TextOwnProps<C>>;
