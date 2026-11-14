import { clsx } from "clsx";
import { Flex } from "./Flex";
import styles from "./LoadingState.module.css";
import { Spinner } from "./Spinner";

export interface LoadingStateProps {
  label?: string;
  size?: string;
  className?: string;
}

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
