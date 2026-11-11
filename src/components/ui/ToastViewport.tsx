import { useEffect, useRef } from "react";

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

const TONE_ICONS: Record<ToastTone, string> = {
  info: "ℹ",
  success: "✓",
  error: "✕",
};

function ToastPopoverItem({
  item,
  onDismiss,
  dismissLabel,
}: {
  item: ToastItem;
  onDismiss: (id: string) => void;
  dismissLabel: string;
}) {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = popoverRef.current;
    if (!el) {
      return;
    }
    if (typeof el.showPopover === "function") {
      try {
        el.showPopover();
      } catch {
        // Already open or unsupported
      }
    }
  }, []);

  return (
    <div
      ref={popoverRef}
      id={`toast-${item.id}`}
      popover="manual"
      className={`ui-toast ui-toast--${item.tone}`}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "var(--primitive-space-2)",
          fontSize: "var(--primitive-text-sm)",
        }}
      >
        <span aria-hidden="true" style={{ fontWeight: 700 }}>
          {TONE_ICONS[item.tone]}
        </span>
        <span>{item.message}</span>
      </div>
      <button
        type="button"
        className="ui-btn ui-btn--ghost ui-btn--sm"
        aria-label={dismissLabel}
        onClick={() => onDismiss(item.id)}
      >
        ✕
      </button>
    </div>
  );
}

export function ToastViewport({
  toasts,
  onDismiss,
  regionLabel,
  dismissLabel,
  srAnnouncementLabel,
}: ToastViewportProps) {
  const latestToast = toasts[toasts.length - 1];

  useEffect(() => {
    if (!latestToast) {
      return;
    }
    // Use standard ariaNotify() when available, falling back to the pre-populated aria-live container below
    const docWithNotify = document as Document & {
      ariaNotify?: (message: string) => void;
    };
    if (typeof docWithNotify.ariaNotify === "function") {
      docWithNotify.ariaNotify(latestToast.message);
    }
  }, [latestToast]);

  return (
    <>
      <p className="visually-hidden">{srAnnouncementLabel}</p>
      <div className="visually-hidden" aria-live="assertive">
        {latestToast ? latestToast.message : ""}
      </div>

      <div role="region" aria-label={regionLabel} className="ui-toast-region">
        {toasts.map((item) => (
          <ToastPopoverItem
            key={item.id}
            item={item}
            onDismiss={onDismiss}
            dismissLabel={dismissLabel}
          />
        ))}
      </div>
    </>
  );
}
