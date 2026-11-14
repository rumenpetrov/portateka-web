import type { TextareaHTMLAttributes } from "react";
import { clsx } from "clsx";
import { Field } from "./Field";
import controlStyles from "./FormControl.module.css";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: string;
  error?: string;
}

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
          className={clsx(controlStyles.control, controlStyles.textarea)}
          {...controlProps}
          {...rest}
        />
      )}
    </Field>
  );
}
