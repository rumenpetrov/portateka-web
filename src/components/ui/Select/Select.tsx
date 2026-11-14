import { Field } from "../Field";
import { formControlStyles } from "../FormControl";
import type { SelectProps } from "./Select.types";

export function Select({
  label,
  options,
  hint,
  error,
  id,
  required,
  className,
  ...rest
}: SelectProps) {
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
        <select className={formControlStyles.control} {...controlProps} {...rest}>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}
    </Field>
  );
}
