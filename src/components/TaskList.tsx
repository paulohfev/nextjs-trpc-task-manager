"use client";

import { useEffect, useState } from "react";
import {
  FeedbackMessage,
  type FeedbackMessageProps,
} from "@/components/FeedbackMessage";
import { Spinner } from "@/components/Spinner";
import { TaskCard } from "@/components/TaskCard";
import { useInfiniteTasks, type TaskPage } from "@/hooks/useInfiniteTasks";
import { useOnVisible } from "@/hooks/useOnVisible";

type Feedback = Pick<FeedbackMessageProps, "variant" | "message">;

export type TaskListProps = {
  initialPage: TaskPage;
  initialFeedback?: Feedback;
};

export function TaskList({ initialPage, initialFeedback }: TaskListProps) {
  const { tasks, hasMore, isLoadingMore, error, loadMore, removeTask } =
    useInfiniteTasks(initialPage);
  const [feedback, setFeedback] = useState<Feedback | null>(
    initialFeedback ?? null,
  );

  // Drop the one-time ?status=… param so a page reload doesn't show it again.
  useEffect(() => {
    if (initialFeedback) window.history.replaceState(null, "", "/");
  }, [initialFeedback]);

  // Re-check after each load/delete in case the sentinel is still on screen.
  const sentinelRef = useOnVisible<HTMLDivElement>(() => {
    if (!error) void loadMore();
  }, `${tasks.length}-${hasMore}`);

  function handleDeleted(taskId: string) {
    removeTask(taskId);
    setFeedback({ variant: "success", message: "Task deleted." });
  }

  function handleDeleteError(message: string) {
    setFeedback({ variant: "error", message });
  }

  return (
    <>
      {feedback && <FeedbackMessage {...feedback} />}

      {tasks.length === 0 && !hasMore ? (
        <p className="py-8 text-center text-sm opacity-70">
          No tasks yet. Create your first one!
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDeleted={handleDeleted}
              onDeleteError={handleDeleteError}
            />
          ))}
        </ul>
      )}

      {error && (
        <div className="flex flex-col items-center gap-2">
          <FeedbackMessage variant="error" message={error} />
          <button
            type="button"
            onClick={() => void loadMore()}
            className="rounded-md border border-black/20 px-3 py-1 text-sm hover:bg-black/5 dark:border-white/25 dark:hover:bg-white/10"
          >
            Try again
          </button>
        </div>
      )}

      {hasMore && (
        <div
          ref={sentinelRef}
          role="status"
          className="flex min-h-16 items-center justify-center gap-2 text-sm opacity-60"
        >
          {isLoadingMore && (
            <>
              <Spinner size="sm" />
              Loading more tasks…
            </>
          )}
        </div>
      )}
    </>
  );
}
