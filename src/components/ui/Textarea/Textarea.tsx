import { clsx } from "clsx";
import { Field } from "../Field";
import { formControlStyles } from "../FormControl";
import type { TextareaProps } from "./Textarea.types";

export function Textarea({
  label,
  hint,
  error,
  id,
  required,
  className,
  ...rest
}: TextareaProps) {
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
        <textarea
          className={clsx(formControlStyles.control, formControlStyles.textarea)}
          {...controlProps}
          {...rest}
        />
      )}
    </Field>
  );
}
