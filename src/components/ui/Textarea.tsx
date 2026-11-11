import { useId } from "react";
import type { TextareaHTMLAttributes } from "react";
import { AlertCircle } from "lucide-react";

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
  className = "",
  ...rest
}: TextareaProps) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;
  const hintId = `${textareaId}-hint`;
  const errorId = `${textareaId}-error`;

  const describedByIds: string[] = [];
  if (hint) {
    describedByIds.push(hintId);
  }
  if (error) {
    describedByIds.push(errorId);
  }

  return (
    <div className={`ui-field ${className}`.trim()}>
      <label htmlFor={textareaId} className="ui-label">
        <span>{label}</span>
        {required ? (
          <span aria-hidden="true" className="ui-required-mark">
            *
          </span>
        ) : null}
      </label>

      <textarea
        id={textareaId}
        required={required}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={
          describedByIds.length > 0 ? describedByIds.join(" ") : undefined
        }
        className="ui-control"
        {...rest}
      />

      {hint ? (
        <span id={hintId} className="ui-field-hint">
          {hint}
        </span>
      ) : null}

      {error ? (
        <span id={errorId} className="ui-field-error" role="alert">
          <AlertCircle aria-hidden="true" size={15} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </span>
      ) : null}
    </div>
  );
}
