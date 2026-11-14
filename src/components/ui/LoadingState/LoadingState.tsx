import { clsx } from "clsx";
import { Flex } from "../Flex";
import { Spinner } from "../Spinner";
import styles from "./LoadingState.module.css";
import type { LoadingStateProps } from "./LoadingState.types";

export function LoadingState({
  label,
  size = "1.75rem",
  className,
}: LoadingStateProps) {
  return (
    <Flex justify="center" className={clsx(styles.root, className)}>
      <Spinner label={label} size={size} />
    </Flex>
  );
}
