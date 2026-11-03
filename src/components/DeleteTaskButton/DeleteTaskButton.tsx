"use client";

import { useRef, useState } from "react";
import { ConfirmDialog } from "@/components/ConfirmDialog/ConfirmDialog";
import { Spinner } from "@/components/Spinner";
import { getErrorMessage } from "@/lib/errors";
import { trpcClient } from "@/trpc/client";

export type DeleteTaskButtonProps = {
  taskId: string;
  taskTitle: string;
  onDeleted: (taskId: string) => void;
  onError: (message: string) => void;
};

export function DeleteTaskButton({
  taskId,
  taskTitle,
  onDeleted,
  onError,
}: DeleteTaskButtonProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  function handleCancel() {
    setIsConfirming(false);
    buttonRef.current?.focus();
  }

  async function handleConfirm() {
    setIsConfirming(false);
    setIsDeleting(true);
    try {
      await trpcClient.task.delete.mutate({ id: taskId });
      onDeleted(taskId);
    } catch (error) {
      onError(getErrorMessage(error, "Failed to delete the task."));
      setIsDeleting(false);
    }
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsConfirming(true)}
        disabled={isDeleting}
        className="inline-flex enabled:cursor-pointer items-center gap-1.5 rounded-md border border-red-600/40 px-2 py-1 text-sm text-red-600 hover:bg-red-600/10 disabled:opacity-50"
      >
        {isDeleting && <Spinner size="sm" />}
        {isDeleting ? "Deleting…" : "Delete"}
      </button>
      {isConfirming && (
        <ConfirmDialog
          title="Delete task?"
          description={
            <>
              <strong>{taskTitle}</strong> will be permanently deleted.
            </>
          }
          confirmLabel="Delete task"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </>
  );
}
