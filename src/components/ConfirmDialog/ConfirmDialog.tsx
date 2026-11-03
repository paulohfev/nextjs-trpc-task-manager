"use client";

import { useEffect, useId, useRef } from "react";

export type ConfirmDialogProps = {
  title: string;
  description: React.ReactNode;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
};

// Confirmation modal built on the native <dialog>, which traps focus, makes
// the page behind it inert and closes on Escape. Render it only while open.
export function ConfirmDialog({
  title,
  description,
  confirmLabel,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    // Start on the safe choice, since confirming is destructive.
    cancelRef.current?.focus();
    return () => dialog.close();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      // Escape key: let React state decide when the dialog closes.
      onCancel={(event) => {
        event.preventDefault();
        onCancel();
      }}
      // Clicks on the backdrop target the <dialog> itself.
      onClick={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-sm rounded-lg border border-black/10 bg-background p-0 text-foreground shadow-xl backdrop:bg-black/40 motion-safe:animate-dialog-in dark:border-white/15"
    >
      <div className="flex flex-col gap-2 p-5">
        <h2 id={titleId} className="text-base font-semibold">
          {title}
        </h2>
        <p id={descriptionId} className="text-sm opacity-75">
          {description}
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            className="cursor-pointer rounded-md border border-black/20 px-3 py-1.5 text-sm hover:bg-black/5 dark:border-white/25 dark:hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="cursor-pointer rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}
