import { useRef, useState } from "react";
import type { inferRouterOutputs } from "@trpc/server";
import { TASKS_PAGE_SIZE } from "@/lib/constants";
import { getErrorMessage } from "@/lib/errors";
import type { AppRouter } from "@/server/routers/_app";
import { trpcClient } from "@/trpc/client";

export type TaskPage = inferRouterOutputs<AppRouter>["task"]["list"];

// Starts from the server-rendered first page and fetches the rest on demand.
export function useInfiniteTasks(initialPage: TaskPage) {
  const [tasks, setTasks] = useState(initialPage.items);
  const [nextCursor, setNextCursor] = useState(initialPage.nextCursor);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Guards against duplicate requests before the loading state re-renders.
  const isLoadingRef = useRef(false);

  async function loadMore() {
    if (!nextCursor || isLoadingRef.current) return;
    isLoadingRef.current = true;
    setIsLoadingMore(true);
    setError(null);
    try {
      const page = await trpcClient.task.list.query({
        limit: TASKS_PAGE_SIZE,
        cursor: nextCursor,
      });
      setTasks((current) => [...current, ...page.items]);
      setNextCursor(page.nextCursor);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load more tasks."));
    } finally {
      isLoadingRef.current = false;
      setIsLoadingMore(false);
    }
  }

  function removeTask(id: string) {
    setTasks((current) => current.filter((task) => task.id !== id));
  }

  return {
    tasks,
    hasMore: nextCursor !== null,
    isLoadingMore,
    error,
    loadMore,
    removeTask,
  };
}
