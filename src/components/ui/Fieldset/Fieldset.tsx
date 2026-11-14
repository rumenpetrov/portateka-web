import { clsx } from "clsx";
import styles from "./Fieldset.module.css";
import type { FieldsetProps } from "./Fieldset.types";

export function Fieldset({ className, ...rest }: FieldsetProps) {
  return <fieldset className={clsx(styles.fieldset, className)} {...rest} />;
}
