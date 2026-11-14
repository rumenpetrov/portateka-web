import type { FieldsetHTMLAttributes } from "react";
import { clsx } from "clsx";
import styles from "./Fieldset.module.css";

export type FieldsetProps = FieldsetHTMLAttributes<HTMLFieldSetElement>;

export function Fieldset({ className, ...rest }: FieldsetProps) {
  return <fieldset className={clsx(styles.fieldset, className)} {...rest} />;
}
