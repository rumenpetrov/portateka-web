import type { HTMLAttributes, ReactNode } from "react";
import { clsx } from "clsx";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  XCircle,
} from "lucide-react";
import styles from "./Alert.module.css";

export type AlertVariant = "info" | "success" | "warning" | "danger";

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  children: ReactNode;
}

const VARIANT_CLASSES: Record<Exclude<AlertVariant, "info">, string> = {
  success: styles.success,
  warning: styles.warning,
  danger: styles.danger,
};

function AlertIcon({ variant }: { variant: AlertVariant }) {
  const iconProps = {
    "aria-hidden": true as const,
    size: 18,
    className: styles.icon,
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
  className,
  children,
  ...rest
}: AlertProps) {
  return (
    <div
      role={variant === "danger" ? "alert" : "status"}
      className={clsx(
        styles.alert,
        variant !== "info" && VARIANT_CLASSES[variant],
        className,
      )}
      {...rest}
    >
      <AlertIcon variant={variant} />
      <div className={styles.content}>{children}</div>
    </div>
  );
}
