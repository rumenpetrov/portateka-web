import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";
import { clsx } from "clsx";
import { Link } from "react-router";
import type { LinkProps } from "react-router";
import styles from "./Anchor.module.css";

export type AnchorTone = "accent" | "primary" | "secondary" | "muted" | "inherit";
export type AnchorUnderline = "always" | "hover" | "none";

interface AnchorBaseProps {
  tone?: AnchorTone;
  underline?: AnchorUnderline;
  children?: ReactNode;
  className?: string;
}

type AnchorAsLinkProps = AnchorBaseProps &
  Omit<LinkProps, "className" | "children"> & {
    as?: never;
    href?: never;
  };

type AnchorAsExternalProps = AnchorBaseProps &
  Omit<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    "className" | "children" | "href"
  > & {
    as?: "a";
    href: string;
    to?: never;
  };

type AnchorAsButtonProps = AnchorBaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    as: "button";
    to?: never;
    href?: never;
  };

export type AnchorProps =
  | AnchorAsLinkProps
  | AnchorAsExternalProps
  | AnchorAsButtonProps;

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
