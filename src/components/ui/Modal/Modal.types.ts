import type { ReactNode } from "react";

export interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  closeLabel: string;
  children: ReactNode;
}
