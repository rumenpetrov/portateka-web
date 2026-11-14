import type { ReactNode } from "react";
import type { ToastTone } from "@/components/ui";
import type { ApiErrorShape } from "@/i18n/types";

export interface NotificationContextValue {
  notify: (tone: ToastTone, message: string) => void;
  notifySuccess: (message: string) => void;
  notifyError: (message: string) => void;
  notifyInfo: (message: string) => void;
  notifyApiError: (
    error: ApiErrorShape | null | undefined,
    options?: { isSignInAttempt?: boolean },
  ) => void;
  dismiss: (id: string) => void;
}

export type GlobalNotificationListener = (
  tone: ToastTone,
  message: string,
) => void;

export interface NotificationProviderProps {
  children: ReactNode;
}
