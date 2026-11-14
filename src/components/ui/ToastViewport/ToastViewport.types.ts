export type ToastTone = "info" | "success" | "error";

export interface ToastItem {
  id: string;
  tone: ToastTone;
  message: string;
}

export interface ToastViewportProps {
  toasts: readonly ToastItem[];
  onDismiss: (id: string) => void;
  regionLabel: string;
  dismissLabel: string;
  srAnnouncementLabel: string;
}
