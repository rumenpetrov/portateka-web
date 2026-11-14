import { useEffect, useId, useRef } from "react";
import type { MouseEvent, ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "./Button";
import { Flex } from "./Flex";
import styles from "./Modal.module.css";
import { Text } from "./Text";

export interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  closeLabel: string;
  children: ReactNode;
}

export function Modal({
  open,
  title,
  onClose,
  closeLabel,
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
      className={styles.modal}
      aria-labelledby={titleId}
      onClose={handleClose}
      onClick={handleBackdropClick}
      {...({ closedby: "any" } as Record<string, string>)}
    >
      <Flex align="center" justify="between" gap={3} className={styles.header}>
        <Text id={titleId} variant="card-title">
          {title}
        </Text>
        <form method="dialog">
          <Button
            type="submit"
            value="cancel"
            variant="ghost"
            size="sm"
            className={styles.closeButton}
            aria-label={closeLabel}
          >
            <X aria-hidden="true" size={18} />
          </Button>
        </form>
      </Flex>
      <div>{children}</div>
    </dialog>
  );
}
