import type { InputHTMLAttributes, ReactNode } from "react";
import { Field } from "./Field";
import controlStyles from "./FormControl.module.css";
import styles from "./Input.module.css";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
  endAdornment?: ReactNode;
}

export function Input({
  label,
  hint,
  error,
  endAdornment,
  id,
  required,
  className,
  ...rest
}: InputProps) {
  return (
    <Field
      label={label}
      hint={hint}
      error={error}
      id={id}
      required={required}
      className={className}
    >
      {(controlProps) => (
        <div className={styles.wrap}>
          <input className={controlStyles.control} {...controlProps} {...rest} />
          {endAdornment ? (
            <div className={styles.endAdornment}>{endAdornment}</div>
          ) : null}
        </div>
      )}
    </Field>
  );
}
