import { clsx } from "clsx";
import { Link } from "react-router";
import styles from "./Anchor.module.css";
import type { AnchorProps } from "./Anchor.types";

export function Anchor(props: AnchorProps) {
  const {
    tone = "accent",
    underline = "always",
    className,
    children,
  } = props;

  const anchorClassName = clsx(
    styles.anchor,
    props.as === "button" && styles.button,
    underline === "hover" && styles.underlineHover,
    underline === "none" && styles.underlineNone,
    tone === "primary" && styles.tonePrimary,
    tone === "secondary" && styles.toneSecondary,
    tone === "muted" && styles.toneMuted,
    tone === "inherit" && styles.toneInherit,
    className,
  );

  if (props.as === "button") {
    const {
      as: _as,
      type = "button",
      tone: _tone,
      underline: _underline,
      className: _className,
      children: _children,
      ...rest
    } = props;

    return (
      <button type={type} className={anchorClassName} {...rest}>
        {children}
      </button>
    );
  }

  if (typeof props.href === "string") {
    const {
      as: _as,
      href,
      target,
      rel,
      tone: _tone,
      underline: _underline,
      className: _className,
      children: _children,
      ...rest
    } = props;

    const resolvedRel =
      target === "_blank" && !rel ? "noopener noreferrer" : rel;

    return (
      <a href={href} target={target} rel={resolvedRel} className={anchorClassName} {...rest}>
        {children}
      </a>
    );
  }

  const {
    as: _as,
    tone: _tone,
    underline: _underline,
    className: _className,
    children: _children,
    ...rest
  } = props;

  return (
    <Link className={anchorClassName} {...rest}>
      {children}
    </Link>
  );
}
