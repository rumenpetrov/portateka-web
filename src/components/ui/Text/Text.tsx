import type { ElementType } from "react";
import { clsx } from "clsx";
import styles from "./Text.module.css";
import type { TextAlign, TextProps, TextTone, TextVariant } from "./Text.types";

const DEFAULT_ELEMENT_BY_VARIANT: Record<TextVariant, ElementType> = {
  "page-title": "h1",
  "section-title": "h2",
  "card-title": "h2",
  body: "p",
  subtitle: "p",
  caption: "p",
};

const VARIANT_CLASSES: Record<TextVariant, string> = {
  "page-title": styles.pageTitle,
  "section-title": styles.sectionTitle,
  "card-title": styles.cardTitle,
  body: styles.body,
  subtitle: styles.subtitle,
  caption: styles.caption,
};

const TONE_CLASSES: Record<Exclude<TextTone, "inherit">, string> = {
  primary: styles.tonePrimary,
  secondary: styles.toneSecondary,
  muted: styles.toneMuted,
  danger: styles.toneDanger,
};

const ALIGN_CLASSES: Record<TextAlign, string> = {
  start: styles.alignStart,
  center: styles.alignCenter,
  end: styles.alignEnd,
};

export function Text<C extends ElementType = "p">({
  as,
  variant = "body",
  tone = "inherit",
  align,
  className,
  children,
  ...rest
}: TextProps<C>) {
  const Component = (as ?? DEFAULT_ELEMENT_BY_VARIANT[variant]) as ElementType;

  return (
    <Component
      className={clsx(
        VARIANT_CLASSES[variant],
        tone !== "inherit" && TONE_CLASSES[tone],
        align && ALIGN_CLASSES[align],
        className,
      )}
      {...rest}
    >
      {children}
    </Component>
  );
}
