import { useEffect, useState, useSyncExternalStore } from "react";
import { Download } from "lucide-react";
import { Text } from "@/components/ui";
import { useI18n } from "@/i18n/I18nProvider";
import styles from "./Footer.module.css";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
}

interface NavigatorWithInstall extends Navigator {
  install?: () => Promise<void>;
}

type InstallStoreListener = () => void;

const installListeners = new Set<InstallStoreListener>();
let deferredInstallPrompt: BeforeInstallPromptEvent | null = null;
let isStandaloneOrInstalled = false;

function notifyInstallListeners(): void {
  for (const listener of installListeners) {
    listener();
  }
}

if (typeof window !== "undefined") {
  const standaloneMedia = window.matchMedia("(display-mode: standalone)");
  isStandaloneOrInstalled = standaloneMedia.matches;

  standaloneMedia.addEventListener("change", (event) => {
    isStandaloneOrInstalled = event.matches;
    notifyInstallListeners();
  });

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredInstallPrompt = event as BeforeInstallPromptEvent;
    notifyInstallListeners();
  });

  window.addEventListener("appinstalled", () => {
    deferredInstallPrompt = null;
    isStandaloneOrInstalled = true;
    notifyInstallListeners();
  });
}

function subscribeInstallState(listener: InstallStoreListener): () => void {
  installListeners.add(listener);
  return () => {
    installListeners.delete(listener);
  };
}

function getCanInstallSnapshot(): boolean {
  if (typeof window === "undefined" || isStandaloneOrInstalled) {
    return false;
  }
  const supportsWebInstall =
    typeof (Navigator.prototype as NavigatorWithInstall).install === "function";
  return supportsWebInstall || deferredInstallPrompt !== null;
}

function getServerCanInstallSnapshot(): boolean {
  return false;
}

export function Footer() {
  const { t } = useI18n();
  const [isInstalling, setIsInstalling] = useState(false);
  const canInstall = useSyncExternalStore(
    subscribeInstallState,
    getCanInstallSnapshot,
    getServerCanInstallSnapshot,
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const standalone = window.matchMedia("(display-mode: standalone)").matches;
    if (standalone && !isStandaloneOrInstalled) {
      isStandaloneOrInstalled = true;
      notifyInstallListeners();
    }
  }, []);

  const handleInstallClick = async () => {
    if (isInstalling) {
      return;
    }

    const nav = navigator as NavigatorWithInstall;
    const supportsWebInstall = typeof nav.install === "function";

    setIsInstalling(true);

    try {
      if (supportsWebInstall && nav.install) {
        await nav.install();
        isStandaloneOrInstalled = true;
        notifyInstallListeners();
      } else if (deferredInstallPrompt) {
        const promptEvent = deferredInstallPrompt;
        deferredInstallPrompt = null;
        notifyInstallListeners();

        await promptEvent.prompt();
        const { outcome } = await promptEvent.userChoice;
        if (outcome === "accepted") {
          isStandaloneOrInstalled = true;
          notifyInstallListeners();
        }
      }
    } catch (error) {
      const errorName =
        error instanceof Error ? error.name : undefined;
      if (errorName !== "AbortError") {
        console.error(error);
      }
    } finally {
      setIsInstalling(false);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <Text as="span" variant="caption" tone="muted">
          {t.footer.copyright(currentYear)}
        </Text>

        <button
          type="button"
          hidden={!canInstall}
          aria-disabled={isInstalling ? "true" : undefined}
          className={styles.installButton}
          onClick={() => {
            void handleInstallClick();
          }}
        >
          <Download aria-hidden="true" size={14} />
          <span>{t.footer.installApp}</span>
        </button>
      </div>
    </footer>
  );
}
