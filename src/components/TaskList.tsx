"use client";

import { FeedbackMessage } from "@/components/FeedbackMessage";
import { Spinner } from "@/components/Spinner";
import { TaskCard } from "@/components/TaskCard";
import { useInfiniteTasks, type TaskPage } from "@/hooks/useInfiniteTasks";
import { useOnVisible } from "@/hooks/useOnVisible";
import { useToast } from "@/hooks/useToast";

export type TaskListProps = {
  initialPage: TaskPage;
};

export function TaskList({ initialPage }: TaskListProps) {
  const { tasks, hasMore, isLoadingMore, error, loadMore, removeTask } =
    useInfiniteTasks(initialPage);
  const showToast = useToast();

  // Re-check after each load/delete in case the sentinel is still on screen.
  const sentinelRef = useOnVisible<HTMLDivElement>(() => {
    if (!error) void loadMore();
  }, `${tasks.length}-${hasMore}`);

  function handleDeleted(taskId: string) {
    removeTask(taskId);
    showToast({ variant: "success", message: "Task deleted." });
  }

  function handleDeleteError(message: string) {
    showToast({ variant: "error", message });
  }

  return (
    <>
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
        <FeedbackMessage
          variant="error"
          message={error}
          action={
            <button
              type="button"
              onClick={() => void loadMore()}
              className="shrink-0 cursor-pointer rounded-md border border-current/30 px-2.5 py-1 text-xs font-medium hover:bg-current/10"
            >
              Try again
            </button>
          }
        />
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
