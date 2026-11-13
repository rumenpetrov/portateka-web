import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { clsx } from "clsx";
import styles from "./Flex.module.css";

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

const DIRECTION_CLASSES: Record<FlexDirection, string> = {
  row: styles.directionRow,
  column: styles.directionColumn,
};

const ALIGN_CLASSES: Record<FlexAlign, string> = {
  start: styles.alignStart,
  center: styles.alignCenter,
  end: styles.alignEnd,
  stretch: styles.alignStretch,
  baseline: styles.alignBaseline,
};

const JUSTIFY_CLASSES: Record<FlexJustify, string> = {
  start: styles.justifyStart,
  center: styles.justifyCenter,
  end: styles.justifyEnd,
  between: styles.justifyBetween,
};

const GAP_CLASSES: Record<FlexGap, string> = {
  1: styles.gap1,
  2: styles.gap2,
  3: styles.gap3,
  4: styles.gap4,
  5: styles.gap5,
  6: styles.gap6,
  8: styles.gap8,
  10: styles.gap10,
  12: styles.gap12,
};

export function Flex<C extends ElementType = "div">({
  as,
  direction = "row",
  inline = false,
  wrap = false,
  align,
  justify,
  gap,
  className,
  children,
  ...rest
}: FlexProps<C>) {
  const Component = (as ?? "div") as ElementType;

  return (
    <Component
      className={clsx(
        inline ? styles.inline : styles.flex,
        DIRECTION_CLASSES[direction],
        wrap && styles.wrap,
        align && ALIGN_CLASSES[align],
        justify && JUSTIFY_CLASSES[justify],
        gap && GAP_CLASSES[gap],
        className,
      )}
      {...rest}
    >
      {children}
    </Component>
  );
}
