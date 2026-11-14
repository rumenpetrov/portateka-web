import type { ReactNode } from "react";

export interface AuthCardProps {
  title: string;
  subtitle: string;
  footer?: ReactNode;
  children: ReactNode;
}
