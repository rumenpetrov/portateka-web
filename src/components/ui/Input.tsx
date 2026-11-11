import { useId } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";

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
  className = "",
  ...rest
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;

  const describedByIds: string[] = [];
  if (hint) {
    describedByIds.push(hintId);
  }
  if (error) {
    describedByIds.push(errorId);
  }

  return (
    <div className={`ui-field ${className}`.trim()}>
      <label htmlFor={inputId} className="ui-label">
        <span>{label}</span>
        {required ? (
          <span aria-hidden="true" className="ui-required-mark">
            *
          </span>
        ) : null}
      </label>

      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          inlineSize: "100%",
        }}
      >
        <input
          id={inputId}
          required={required}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={
            describedByIds.length > 0 ? describedByIds.join(" ") : undefined
          }
          className="ui-control"
          {...rest}
        />
        {endAdornment ? (
          <div
            style={{
              position: "absolute",
              insetInlineEnd: "var(--primitive-space-2)",
              display: "flex",
              alignItems: "center",
            }}
          >
            {endAdornment}
          </div>
        ) : null}
      </div>

      {hint ? (
        <span id={hintId} className="ui-field-hint">
          {hint}
        </span>
      ) : null}

      {error ? (
        <span id={errorId} className="ui-field-error" role="alert">
          <span aria-hidden="true">⚠</span>
          <span>{error}</span>
        </span>
      ) : null}
    </div>
  );
}
