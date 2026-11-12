import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: "article" | "section" | "div";
  children: ReactNode;
}

export function Card({
  as: Component = "section",
  className = "",
  children,
  ...rest
}: CardProps) {
  return (
    <Component className={`ui-card ${className}`.trim()} {...rest}>
      {children}
    </Component>
  );
}

export function CardHeader({
  className = "",
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`ui-card-header ${className}`.trim()} {...rest}>
      {children}
    </div>
  );
}

export function CardContent({
  className = "",
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`ui-card-content ${className}`.trim()} {...rest}>
      {children}
    </div>
  );
}

export function CardFooter({
  className = "",
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`ui-card-footer ${className}`.trim()} {...rest}>
      {children}
    </div>
  );
}
