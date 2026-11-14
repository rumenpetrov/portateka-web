import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

export type AnchorTone = "accent" | "primary" | "secondary" | "muted" | "inherit";
export type AnchorUnderline = "always" | "hover" | "none";

type DistributiveOmit<T, K extends PropertyKey> = T extends unknown
  ? Omit<T, K>
  : never;

interface AnchorOwnProps<C extends ElementType = "a"> {
  as?: C;
  tone?: AnchorTone;
  underline?: AnchorUnderline;
  className?: string;
  children?: ReactNode;
}

export type AnchorProps<C extends ElementType = "a"> = AnchorOwnProps<C> &
  DistributiveOmit<ComponentPropsWithoutRef<C>, keyof AnchorOwnProps<C>>;
