import type { CSSProperties } from "react";

interface SpinnerProps {
  label?: string;
  size?: string;
}

export function Spinner({ label = "Loading", size }: SpinnerProps) {
  const style: CSSProperties | undefined = size
    ? { inlineSize: size, blockSize: size }
    : undefined;

  return (
    <span role="status" style={{ display: "inline-flex", alignItems: "center" }}>
      <span aria-hidden="true" className="ui-spinner" style={style} />
      <span className="visually-hidden">{label}</span>
    </span>
  );
}
