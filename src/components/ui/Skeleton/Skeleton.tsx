import { clsx } from "clsx";
import type { CSSProperties } from "react";
import styles from "./Skeleton.module.css";
import type { SkeletonProps, SkeletonVariant } from "./Skeleton.types";

const VARIANT_CLASSES: Record<Exclude<SkeletonVariant, "text">, string> = {
  rect: styles.rect,
  circle: styles.circle,
};

export function Skeleton({
  variant = "text",
  width,
  height,
  className,
}: SkeletonProps) {
  const style: CSSProperties | undefined =
    width !== undefined || height !== undefined
      ? { inlineSize: width, blockSize: height }
      : undefined;

  return (
    <span
      aria-hidden="true"
      className={clsx(
        styles.skeleton,
        variant !== "text" && VARIANT_CLASSES[variant],
        className,
      )}
      style={style}
    />
  );
}
