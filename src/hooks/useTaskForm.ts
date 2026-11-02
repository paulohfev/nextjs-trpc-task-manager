import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { getErrorMessage, isTRPCClientError } from "@/lib/errors";
import { createTaskSchema } from "@/lib/taskSchemas";
import type { Task } from "@/lib/types";
import { trpcClient } from "@/trpc/client";

type TaskField = "title" | "description";
export type TaskFieldErrors = Partial<Record<TaskField, string>>;

function firstErrors(
  fieldErrors: Partial<Record<TaskField, string[]>>,
): TaskFieldErrors {
  return {
    title: fieldErrors.title?.[0],
    description: fieldErrors.description?.[0],
  };
}

// Creates a new task, or updates `initialTask` when editing.
export function useTaskForm(initialTask?: Task) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTask?.title ?? "");
  const [description, setDescription] = useState(
    initialTask?.description ?? "",
  );
  const [fieldErrors, setFieldErrors] = useState<TaskFieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    // Validate on the client first, with the same rules as the server.
    const parsed = createTaskSchema.safeParse({ title, description });
    if (!parsed.success) {
      setFieldErrors(firstErrors(z.flattenError(parsed.error).fieldErrors));
      setFormError(null);
      return;
    }

    setFieldErrors({});
    setFormError(null);
    setIsSubmitting(true);
    try {
      if (initialTask) {
        await trpcClient.task.update.mutate({
          id: initialTask.id,
          ...parsed.data,
        });
        router.push("/?status=updated");
      } else {
        await trpcClient.task.create.mutate(parsed.data);
        router.push("/?status=created");
      }
      // Stay in the submitting state while navigating away.
    } catch (error) {
      const serverFieldErrors = isTRPCClientError(error)
        ? error.data?.zodError?.fieldErrors
        : undefined;
      if (serverFieldErrors) setFieldErrors(firstErrors(serverFieldErrors));
      setFormError(getErrorMessage(error, "Failed to save the task."));
      setIsSubmitting(false);
    }
  }

  return {
    title,
    setTitle,
    description,
    setDescription,
    fieldErrors,
    formError,
    isSubmitting,
    handleSubmit,
  };
}
