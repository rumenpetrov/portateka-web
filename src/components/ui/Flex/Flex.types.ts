import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

export type FlexDirection = "row" | "column";
export type FlexAlign = "start" | "center" | "end" | "stretch" | "baseline";
export type FlexJustify = "start" | "center" | "end" | "between";
export type FlexGap = 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;

type DistributiveOmit<T, K extends PropertyKey> = T extends unknown
  ? Omit<T, K>
  : never;

interface FlexOwnProps<C extends ElementType = "div"> {
  as?: C;
  direction?: FlexDirection;
  inline?: boolean;
  wrap?: boolean;
  align?: FlexAlign;
  justify?: FlexJustify;
  gap?: FlexGap;
  className?: string;
  children?: ReactNode;
}

export type FlexProps<C extends ElementType = "div"> = FlexOwnProps<C> &
  DistributiveOmit<ComponentPropsWithoutRef<C>, keyof FlexOwnProps<C>>;
