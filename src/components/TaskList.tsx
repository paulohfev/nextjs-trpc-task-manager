import { TaskCard } from "@/components/TaskCard";
import type { Task } from "@/lib/types";

export type TaskListProps = {
  tasks: Task[];
};

export function TaskList({ tasks }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <p className="py-8 text-center text-sm opacity-70">
        No tasks yet. Create your first one!
      </p>
    );
  }

  return (
    <>
      <ul className="flex flex-col gap-3">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </ul>
      {/* Placeholder: infinite scroll sentinel will trigger loading the next page. */}
      <p className="py-6 text-center text-sm opacity-60">Loading more tasks…</p>
    </>
  );
}
