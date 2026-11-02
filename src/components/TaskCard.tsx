import Link from "next/link";
import { DeleteTaskButton } from "@/components/DeleteTaskButton";
import type { Task } from "@/lib/types";

export type TaskCardProps = {
  task: Task;
  onDeleted: (taskId: string) => void;
  onDeleteError: (message: string) => void;
};

export function TaskCard({ task, onDeleted, onDeleteError }: TaskCardProps) {
  return (
    <li className="flex items-start justify-between gap-4 rounded-md border border-black/10 p-4 dark:border-white/15">
      <div className="min-w-0">
        <h2 className="font-medium">{task.title}</h2>
        {task.description && (
          <p className="mt-1 text-sm opacity-80">{task.description}</p>
        )}
        <time
          dateTime={task.creationDate}
          className="mt-2 block text-xs opacity-60"
        >
          Created {new Date(task.creationDate).toLocaleString("en-US")}
        </time>
      </div>
      <div className="flex shrink-0 gap-2">
        <Link
          href={`/tasks/${task.id}/edit`}
          className="rounded-md border border-black/20 px-2 py-1 text-sm hover:bg-black/5 dark:border-white/25 dark:hover:bg-white/10"
        >
          Edit
        </Link>
        <DeleteTaskButton
          taskId={task.id}
          taskTitle={task.title}
          onDeleted={onDeleted}
          onError={onDeleteError}
        />
      </div>
    </li>
  );
}
