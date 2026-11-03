import { TaskList } from "@/components/TaskList";
import { TASKS_PAGE_SIZE } from "@/lib/constants";
import { caller } from "@/trpc/server";

// Tasks live in memory and change at runtime, so render on every request.
export const dynamic = "force-dynamic";

export default async function TasksPage() {
  const firstPage = await caller.task.list({ limit: TASKS_PAGE_SIZE });

  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Tasks</h1>
      <TaskList initialPage={firstPage} />
    </section>
  );
}
