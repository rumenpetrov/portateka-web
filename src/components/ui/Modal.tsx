import { useEffect, useId, useRef } from "react";
import type { MouseEvent, ReactNode } from "react";

export interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  closeLabel?: string;
  children: ReactNode;
}

export function Modal({
  open,
  title,
  onClose,
  closeLabel = "Close",
  children,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  const handleClose = () => {
    const dialog = dialogRef.current;
    if (dialog) {
      dialog.returnValue = "";
    }
    onClose();
  };

  // Fallback for browsers that do not yet support declarative `closedby="any"`
  const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    const dialog = dialogRef.current;
    if (!dialog || "closedBy" in HTMLDialogElement.prototype) {
      return;
    }
    if (event.target !== dialog) {
      return;
    }
    const rect = dialog.getBoundingClientRect();
    const isInsideDialog =
      rect.top <= event.clientY &&
      event.clientY <= rect.top + rect.height &&
      rect.left <= event.clientX &&
      event.clientX <= rect.left + rect.width;

    if (!isInsideDialog) {
      dialog.close();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="ui-modal"
      aria-labelledby={titleId}
      onClose={handleClose}
      onClick={handleBackdropClick}
      {...({ closedby: "any" } as Record<string, string>)}
    >
      <div className="ui-card-header">
        <h2
          id={titleId}
          style={{
            fontSize: "var(--primitive-text-lg)",
            fontWeight: "var(--primitive-weight-semibold)",
          }}
        >
          {title}
        </h2>
        <form method="dialog">
          <button
            type="submit"
            value="cancel"
            className="ui-btn ui-btn--ghost ui-btn--sm"
            aria-label={closeLabel}
          >
            ✕
          </button>
        </form>
      </div>
      <div>{children}</div>
    </dialog>
  );
}
