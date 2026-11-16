import { useSyncExternalStore } from "react";
import { registerSW } from "virtual:pwa-register";

interface PwaUpdateSnapshot {
  needRefresh: boolean;
  isUpdating: boolean;
}

const SERVER_SNAPSHOT: PwaUpdateSnapshot = {
  needRefresh: false,
  isUpdating: false,
};

const UPDATE_CHECK_COOLDOWN_MS = 5000;

let snapshot: PwaUpdateSnapshot = {
  needRefresh: false,
  isUpdating: false,
};

const listeners = new Set<() => void>();
let updateSW: ((reloadPage?: boolean) => Promise<void>) | null = null;
let initialized = false;
let lastUpdateCheckAt = 0;

function setSnapshot(patch: Partial<PwaUpdateSnapshot>): void {
  snapshot = { ...snapshot, ...patch };
  for (const listener of listeners) {
    listener();
  }
}

function ensureInitialized(): void {
  if (initialized) {
    return;
  }
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return;
  }

  initialized = true;
  updateSW = registerSW({
    immediate: true,
    onNeedRefresh() {
      setSnapshot({ needRefresh: true });
    },
    onRegisteredSW(_swUrl, registration) {
      if (!registration) {
        return;
      }

      if (registration.waiting) {
        setSnapshot({ needRefresh: true });
      }

      const checkForUpdate = () => {
        const now = Date.now();
        if (now - lastUpdateCheckAt < UPDATE_CHECK_COOLDOWN_MS) {
          return;
        }
        lastUpdateCheckAt = now;
        void registration.update();
      };

      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") {
          checkForUpdate();
        }
      });

      window.addEventListener("focus", checkForUpdate);
    },
  });
}

function subscribe(listener: () => void): () => void {
  ensureInitialized();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): PwaUpdateSnapshot {
  return snapshot;
}

function getServerSnapshot(): PwaUpdateSnapshot {
  return SERVER_SNAPSHOT;
}

export function applyPwaUpdate(): void {
  if (!updateSW) {
    window.location.reload();
    return;
  }

  setSnapshot({ isUpdating: true });
  void updateSW(true);
}

export function dismissPwaUpdate(): void {
  setSnapshot({ needRefresh: false });
}

export function usePwaUpdate() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return {
    needRefresh: state.needRefresh,
    isUpdating: state.isUpdating,
    applyUpdate: applyPwaUpdate,
    dismissUpdate: dismissPwaUpdate,
  };
}
