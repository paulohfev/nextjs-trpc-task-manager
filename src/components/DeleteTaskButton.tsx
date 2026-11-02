"use client";

import { useState } from "react";

export type DeleteTaskButtonProps = {
  taskId: string;
};

export function DeleteTaskButton({ taskId }: DeleteTaskButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  // Placeholder: will call the tRPC delete mutation and report success/error.
  async function handleDelete() {
    setIsDeleting(true);
    console.info(`Delete task ${taskId} (not implemented yet)`);
    setIsDeleting(false);
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className="rounded-md border border-red-600/40 px-2 py-1 text-sm text-red-600 hover:bg-red-600/10 disabled:opacity-50"
    >
      {isDeleting ? "Deleting…" : "Delete"}
    </button>
  );
}
