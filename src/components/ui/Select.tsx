import { useId } from "react";
import type { SelectHTMLAttributes } from "react";
import { AlertCircle } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: readonly SelectOption[];
  hint?: string;
  error?: string;
}

export function Select({
  label,
  options,
  hint,
  error,
  id,
  required,
  className = "",
  ...rest
}: SelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const hintId = `${selectId}-hint`;
  const errorId = `${selectId}-error`;

  const describedByIds: string[] = [];
  if (hint) {
    describedByIds.push(hintId);
  }
  if (error) {
    describedByIds.push(errorId);
  }

  return (
    <div className={`ui-field ${className}`.trim()}>
      <label htmlFor={selectId} className="ui-label">
        <span>{label}</span>
        {required ? (
          <span aria-hidden="true" className="ui-required-mark">
            *
          </span>
        ) : null}
      </label>

      <select
        id={selectId}
        required={required}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={
          describedByIds.length > 0 ? describedByIds.join(" ") : undefined
        }
        className="ui-control"
        {...rest}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

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
