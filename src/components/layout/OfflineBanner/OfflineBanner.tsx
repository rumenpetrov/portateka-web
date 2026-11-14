import { useEffect, useSyncExternalStore } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { WifiOff } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import styles from "./OfflineBanner.module.css";

function subscribeOnlineStatus(callback: () => void): () => void {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

function getOnlineSnapshot(): boolean {
  if (typeof navigator === "undefined") {
    return true;
  }
  return navigator.onLine;
}

function getServerOnlineSnapshot(): boolean {
  return true;
}

export function OfflineBanner() {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const isOnline = useSyncExternalStore(
    subscribeOnlineStatus,
    getOnlineSnapshot,
    getServerOnlineSnapshot,
  );

  useEffect(() => {
    const handleOnline = () => {
      void queryClient.refetchQueries({ type: "active" });
    };

    window.addEventListener("online", handleOnline);
    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, [queryClient]);

  if (isOnline) {
    return null;
  }

  return (
    <div role="status" aria-live="polite" className={styles.banner}>
      <div className={styles.inner}>
        <WifiOff aria-hidden="true" size={16} className={styles.icon} />
        <span>{t.common.offlineBanner}</span>
      </div>
    </div>
  );
}
