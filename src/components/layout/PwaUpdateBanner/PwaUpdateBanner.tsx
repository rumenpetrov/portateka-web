import { RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui";
import { useI18n } from "@/i18n/I18nProvider";
import { usePwaUpdate } from "@/pwa/updateStore";
import styles from "./PwaUpdateBanner.module.css";

export function PwaUpdateBanner() {
  const { t } = useI18n();
  const { needRefresh, isUpdating, applyUpdate, dismissUpdate } =
    usePwaUpdate();

  if (!needRefresh) {
    return null;
  }

  return (
    <div role="status" aria-live="polite" className={styles.banner}>
      <div className={styles.inner}>
        <span className={styles.message}>
          <RefreshCw aria-hidden="true" size={16} className={styles.icon} />
          <span>{t.common.pwaUpdateBanner}</span>
        </span>

        <div className={styles.actions}>
          <Button
            type="button"
            variant="primary"
            size="sm"
            isLoading={isUpdating}
            onClick={applyUpdate}
          >
            {t.common.pwaUpdateRefresh}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={isUpdating}
            aria-label={t.common.pwaUpdateDismiss}
            onClick={dismissUpdate}
          >
            <X aria-hidden="true" size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
