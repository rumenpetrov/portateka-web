import type { CSSProperties } from "react";
import { Flex } from "./Flex";
import styles from "./Spinner.module.css";

interface SpinnerProps {
  label?: string;
  size?: string;
}

export function Spinner({ label, size }: SpinnerProps) {
  const style: CSSProperties | undefined = size
    ? { inlineSize: size, blockSize: size }
    : undefined;

  return (
    <Flex as="span" inline align="center" role="status">
      <span aria-hidden="true" className={styles.spinner} style={style} />
      {label ? <span className="visually-hidden">{label}</span> : null}
    </Flex>
  );
}
