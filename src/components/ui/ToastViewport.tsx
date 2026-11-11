import { useEffect, useRef } from "react";
import { CheckCircle2, Info, X, XCircle } from "lucide-react";

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

function ToastToneIcon({ tone }: { tone: ToastTone }) {
  const iconProps = {
    "aria-hidden": true as const,
    size: 18,
    style: { flexShrink: 0 },
  };

  switch (tone) {
    case "success": {
      return <CheckCircle2 {...iconProps} />;
    }
    case "error": {
      return <XCircle {...iconProps} />;
    }
    case "info": {
      return <Info {...iconProps} />;
    }
  }
}

export function ToastViewport({
  toasts,
  onDismiss,
  regionLabel,
  dismissLabel,
  srAnnouncementLabel,
}: ToastViewportProps) {
  const regionRef = useRef<HTMLDivElement>(null);
  const latestToast = toasts[toasts.length - 1];

  useEffect(() => {
    const el = regionRef.current;
    if (!el || typeof el.showPopover !== "function") {
      return;
    }

    try {
      if (toasts.length > 0 && !el.matches(":popover-open")) {
        el.showPopover();
      } else if (toasts.length === 0 && el.matches(":popover-open")) {
        el.hidePopover();
      }
    } catch {
      // Ignore state errors
    }
  }, [toasts.length]);

  useEffect(() => {
    if (!latestToast) {
      return;
    }
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

      <div
        ref={regionRef}
        popover="manual"
        role="region"
        aria-label={regionLabel}
        className="ui-toast-region"
      >
        {toasts.map((item) => (
          <div
            key={item.id}
            id={`toast-${item.id}`}
            className={`ui-toast ui-toast--${item.tone}`}
          >
            <div className="ui-toast-content">
              <ToastToneIcon tone={item.tone} />
              <span>{item.message}</span>
            </div>
            <button
              type="button"
              className="ui-toast-close"
              aria-label={dismissLabel}
              onClick={() => onDismiss(item.id)}
            >
              <X aria-hidden="true" size={16} />
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
