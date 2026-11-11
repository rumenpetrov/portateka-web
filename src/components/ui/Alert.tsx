import type { HTMLAttributes, ReactNode } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  XCircle,
} from "lucide-react";

export type AlertVariant = "info" | "success" | "warning" | "danger";

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  children: ReactNode;
}

function AlertIcon({ variant }: { variant: AlertVariant }) {
  const iconProps = {
    "aria-hidden": true as const,
    size: 18,
    style: { flexShrink: 0, marginBlockStart: "0.125rem" },
  };

  switch (variant) {
    case "success": {
      return <CheckCircle2 {...iconProps} />;
    }
    case "warning": {
      return <AlertTriangle {...iconProps} />;
    }
    case "danger": {
      return <XCircle {...iconProps} />;
    }
    case "info": {
      return <Info {...iconProps} />;
    }
  }
}

export function Alert({
  variant = "info",
  className = "",
  children,
  ...rest
}: AlertProps) {
  const classes = [
    "ui-alert",
    variant !== "info" ? `ui-alert--${variant}` : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      role={variant === "danger" ? "alert" : "status"}
      className={classes}
      {...rest}
    >
      <AlertIcon variant={variant} />
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
}
