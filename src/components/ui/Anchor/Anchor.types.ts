import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";
import type { LinkProps } from "react-router";

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
