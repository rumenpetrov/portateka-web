import type { HTMLAttributes, ReactNode } from "react";
import { clsx } from "clsx";
import styles from "./Card.module.css";

interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: "article" | "section" | "div";
  children: ReactNode;
}

export function Card({
  as: Component = "section",
  className,
  children,
  ...rest
}: CardProps) {
  return (
    <Component className={clsx(styles.card, className)} {...rest}>
      {children}
    </Component>
  );
}

export function CardHeader({
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx(styles.header, className)} {...rest}>
      {children}
    </div>
  );
}

export function CardContent({
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx(styles.content, className)} {...rest}>
      {children}
    </div>
  );
}

export function CardFooter({
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx(styles.footer, className)} {...rest}>
      {children}
    </div>
  );
}
