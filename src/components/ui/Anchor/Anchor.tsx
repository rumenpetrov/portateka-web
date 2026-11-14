import type { ComponentPropsWithoutRef, ElementType } from "react";
import { clsx } from "clsx";
import styles from "./Anchor.module.css";
import type { AnchorProps, AnchorTone, AnchorUnderline } from "./Anchor.types";

const TONE_CLASSES: Record<Exclude<AnchorTone, "accent">, string> = {
  primary: styles.tonePrimary,
  secondary: styles.toneSecondary,
  muted: styles.toneMuted,
  inherit: styles.toneInherit,
};

const UNDERLINE_CLASSES: Record<Exclude<AnchorUnderline, "always">, string> = {
  hover: styles.underlineHover,
  none: styles.underlineNone,
};

export function Anchor<C extends ElementType = "a">({
  as,
  tone = "accent",
  underline = "always",
  className,
  children,
  ...rest
}: AnchorProps<C>) {
  const Component = (as ?? "a") as ElementType;
  const classes = clsx(
    styles.anchor,
    Component === "button" && styles.button,
    underline !== "always" && UNDERLINE_CLASSES[underline],
    tone !== "accent" && TONE_CLASSES[tone],
    className,
  );

  if (Component === "button") {
    const buttonRest = rest as ComponentPropsWithoutRef<"button">;
    const { type = "button", ...otherButtonProps } = buttonRest;

    return (
      <button type={type} className={classes} {...otherButtonProps}>
        {children}
      </button>
    );
  }

  if (Component === "a") {
    const anchorRest = rest as ComponentPropsWithoutRef<"a">;
    const { target, rel, ...otherAnchorProps } = anchorRest;
    const resolvedRel =
      target === "_blank" && !rel ? "noopener noreferrer" : rel;

    return (
      <a
        target={target}
        rel={resolvedRel}
        className={classes}
        {...otherAnchorProps}
      >
        {children}
      </a>
    );
  }

  return (
    <Component className={classes} {...rest}>
      {children}
    </Component>
  );
}
