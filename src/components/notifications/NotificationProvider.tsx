import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import { ToastViewport } from "../ui/ToastViewport";
import type { ToastItem, ToastTone } from "../ui/ToastViewport";
import {
  getActiveDictionary,
  translateApiErrorFromShape,
  useI18n,
} from "../../i18n/I18nProvider";
import type { ApiErrorShape } from "../../i18n/types";

interface NotificationContextValue {
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

const NotificationContext = createContext<NotificationContextValue | null>(
  null,
);

type GlobalNotificationListener = (tone: ToastTone, message: string) => void;

let globalListener: GlobalNotificationListener | null = null;

/**
 * Allows abstract infrastructure layers (such as React Query's QueryCache / MutationCache)
 * to dispatch localized notifications without tightly coupling to React component trees.
 */
export function dispatchGlobalApiErrorNotification(
  error: ApiErrorShape | null | undefined,
  options?: { isSignInAttempt?: boolean },
): void {
  if (!globalListener) {
    return;
  }
  const dictionary = getActiveDictionary();
  const message = translateApiErrorFromShape(error, dictionary, options);
  globalListener("error", message);
}

const AUTO_DISMISS_MS = 5000;

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { t, translateApiError } = useI18n();
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const notify = useCallback(
    (tone: ToastTone, message: string) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev, { id, tone, message }]);

      window.setTimeout(() => {
        dismiss(id);
      }, AUTO_DISMISS_MS);
    },
    [dismiss],
  );

  useEffect(() => {
    globalListener = notify;
    return () => {
      if (globalListener === notify) {
        globalListener = null;
      }
    };
  }, [notify]);

  const notifySuccess = useCallback(
    (message: string) => {
      notify("success", message);
    },
    [notify],
  );

  const notifyError = useCallback(
    (message: string) => {
      notify("error", message);
    },
    [notify],
  );

  const notifyInfo = useCallback(
    (message: string) => {
      notify("info", message);
    },
    [notify],
  );

  const notifyApiError = useCallback(
    (
      error: ApiErrorShape | null | undefined,
      options?: { isSignInAttempt?: boolean },
    ) => {
      const message = translateApiError(error, options);
      notify("error", message);
    },
    [notify, translateApiError],
  );

  const value = useMemo<NotificationContextValue>(
    () => ({
      notify,
      notifySuccess,
      notifyError,
      notifyInfo,
      notifyApiError,
      dismiss,
    }),
    [
      notify,
      notifySuccess,
      notifyError,
      notifyInfo,
      notifyApiError,
      dismiss,
    ],
  );

  return (
    <NotificationContext value={value}>
      {children}
      <ToastViewport
        toasts={toasts}
        onDismiss={dismiss}
        regionLabel={t.common.notificationsRegion}
        dismissLabel={t.common.dismissNotification}
        srAnnouncementLabel={t.common.srAnnouncements}
      />
    </NotificationContext>
  );
}

export function useNotifications(): NotificationContextValue {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider",
    );
  }
  return context;
}
