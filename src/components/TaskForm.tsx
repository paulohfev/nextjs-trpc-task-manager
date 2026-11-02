"use client";

import Link from "next/link";
import { FeedbackMessage } from "@/components/FeedbackMessage";
import { useTaskForm } from "@/hooks/useTaskForm";
import type { Task } from "@/lib/types";

export type TaskFormProps = {
  initialTask?: Task;
};

export function TaskForm({ initialTask }: TaskFormProps) {
  const {
    title,
    setTitle,
    description,
    setDescription,
    fieldErrors,
    formError,
    isSubmitting,
    handleSubmit,
  } = useTaskForm(initialTask);

  const submitLabel = initialTask ? "Save changes" : "Create task";

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {formError && <FeedbackMessage variant="error" message={formError} />}

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
          disabled={isSubmitting}
          aria-invalid={fieldErrors.title ? true : undefined}
          aria-describedby={fieldErrors.title ? "title-error" : undefined}
          className="rounded-md border border-black/20 bg-transparent px-3 py-2 disabled:opacity-60 dark:border-white/25"
        />
        {fieldErrors.title && (
          <p id="title-error" className="text-sm text-red-600">
            {fieldErrors.title}
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
          disabled={isSubmitting}
          aria-invalid={fieldErrors.description ? true : undefined}
          aria-describedby={
            fieldErrors.description ? "description-error" : undefined
          }
          className="rounded-md border border-black/20 bg-transparent px-3 py-2 disabled:opacity-60 dark:border-white/25"
        />
        {fieldErrors.description && (
          <p id="description-error" className="text-sm text-red-600">
            {fieldErrors.description}
          </p>
        )}
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-foreground px-4 py-2 text-sm text-background hover:opacity-90 disabled:opacity-60"
        >
          {isSubmitting ? "Saving…" : submitLabel}
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
