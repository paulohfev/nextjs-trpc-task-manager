import { TaskList } from "@/components/TaskList";
import { TASKS_PAGE_SIZE } from "@/lib/constants";
import { caller } from "@/trpc/server";

// Tasks live in memory and change at runtime, so render on every request.
export const dynamic = "force-dynamic";

// Messages for the redirect after a task is saved (see useTaskForm).
const statusMessages: Record<string, string> = {
  created: "Task created.",
  updated: "Task updated.",
};

type TasksPageProps = {
  searchParams: Promise<{ status?: string }>;
};

export default async function TasksPage({ searchParams }: TasksPageProps) {
  const { status } = await searchParams;
  const firstPage = await caller.task.list({ limit: TASKS_PAGE_SIZE });
  const statusMessage = status ? statusMessages[status] : undefined;

  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Tasks</h1>
      <TaskList
        initialPage={firstPage}
        initialFeedback={
          statusMessage
            ? { variant: "success", message: statusMessage }
            : undefined
        }
      />
    </section>
  );
}
