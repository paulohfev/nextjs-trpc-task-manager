"use client";

import { useState } from "react";
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
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (!window.confirm(`Delete "${taskTitle}"?`)) return;

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
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className="inline-flex enabled:cursor-pointer items-center gap-1.5 rounded-md border border-red-600/40 px-2 py-1 text-sm text-red-600 hover:bg-red-600/10 disabled:opacity-50"
    >
      {isDeleting && <Spinner size="sm" />}
      {isDeleting ? "Deleting…" : "Delete"}
    </button>
  );
}
