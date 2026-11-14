import { Field } from "../Field";
import { formControlStyles } from "../FormControl";
import styles from "./Input.module.css";
import type { InputProps } from "./Input.types";

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
          <input className={formControlStyles.control} {...controlProps} {...rest} />
          {endAdornment ? (
            <div className={styles.endAdornment}>{endAdornment}</div>
          ) : null}
        </div>
      )}
    </Field>
  );
}
