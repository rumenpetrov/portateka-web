import { useId } from "react";
import type { ReactNode } from "react";
import { clsx } from "clsx";
import { AlertCircle } from "lucide-react";
import styles from "./Field.module.css";

export interface FieldControlProps {
  id: string;
  required?: boolean;
  "aria-invalid"?: "true";
  "aria-describedby"?: string;
}

export interface FieldProps {
  label: string;
  hint?: string;
  error?: string;
  id?: string;
  required?: boolean;
  className?: string;
  children: ReactNode | ((controlProps: FieldControlProps) => ReactNode);
}

export function Field({
  label,
  hint,
  error,
  id,
  required,
  className,
  children,
}: FieldProps) {
  const generatedId = useId();
  const controlId = id ?? generatedId;
  const hintId = `${controlId}-hint`;
  const errorId = `${controlId}-error`;

  const describedByIds: string[] = [];
  if (hint) {
    describedByIds.push(hintId);
  }
  if (error) {
    describedByIds.push(errorId);
  }

  const controlProps: FieldControlProps = {
    id: controlId,
    required,
    "aria-invalid": error ? "true" : undefined,
    "aria-describedby":
      describedByIds.length > 0 ? describedByIds.join(" ") : undefined,
  };

  return (
    <div className={clsx(styles.field, className)}>
      <label htmlFor={controlId} className={styles.label}>
        <span>{label}</span>
        {required ? (
          <span aria-hidden="true" className={styles.requiredMark}>
            *
          </span>
        ) : null}
      </label>

      {typeof children === "function" ? children(controlProps) : children}

      {hint ? (
        <span id={hintId} className={styles.hint}>
          {hint}
        </span>
      ) : null}

      {error ? (
        <span id={errorId} className={styles.error} role="alert">
          <AlertCircle aria-hidden="true" size={15} className={styles.errorIcon} />
          <span>{error}</span>
        </span>
      ) : null}
    </div>
  );
}
