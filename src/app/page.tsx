import { TaskList } from "@/components/TaskList";
import { mockTasks } from "@/lib/mockTasks";

export default function TasksPage() {
  // Placeholder: will be preloaded server-side via tRPC.
  const tasks = mockTasks;

  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Tasks</h1>
      <TaskList tasks={tasks} />
    </section>
  );
}
