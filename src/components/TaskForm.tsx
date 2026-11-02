"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { FeedbackMessage } from "@/components/FeedbackMessage";
import type { Task } from "@/lib/types";

export type TaskFormProps = {
  initialTask?: Task;
};

export function TaskForm({ initialTask }: TaskFormProps) {
  const isEditing = Boolean(initialTask);
  const [title, setTitle] = useState(initialTask?.title ?? "");
  const [description, setDescription] = useState(
    initialTask?.description ?? "",
  );
  const [titleError, setTitleError] = useState<string | null>(null);

  // Placeholder: will call the tRPC create/update mutation.
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim()) {
      setTitleError("Title is required.");
      return;
    }
    setTitleError(null);
    console.info("Submit task (not implemented yet)", { title, description });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="title" className="text-sm font-medium">
          Title <span className="text-red-600">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          aria-invalid={titleError ? true : undefined}
          aria-describedby={titleError ? "title-error" : undefined}
          className="rounded-md border border-black/20 bg-transparent px-3 py-2 dark:border-white/25"
        />
        {titleError && (
          <p id="title-error" className="text-sm text-red-600">
            {titleError}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className="rounded-md border border-black/20 bg-transparent px-3 py-2 dark:border-white/25"
        />
      </div>

      <FeedbackMessage
        variant="info"
        message="Saving is not connected to the backend yet."
      />

      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded-md bg-foreground px-4 py-2 text-sm text-background hover:opacity-90"
        >
          {isEditing ? "Save changes" : "Create task"}
        </button>
        <Link
          href="/"
          className="rounded-md border border-black/20 px-4 py-2 text-sm hover:bg-black/5 dark:border-white/25 dark:hover:bg-white/10"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
