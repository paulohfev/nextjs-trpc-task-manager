import "server-only";
import { randomUUID } from "node:crypto";
import type { Task } from "@/lib/types";

export type CreateTaskData = Pick<Task, "title" | "description">;
export type UpdateTaskData = Partial<CreateTaskData>;

export type ListTasksOptions = {
  limit: number;
  cursor?: string;
};

export type ListTasksResult = {
  items: Task[];
  nextCursor: string | null;
};

type TaskSortKey = Pick<Task, "creationDate" | "id">;

// Newest first; id breaks ties between tasks created in the same millisecond.
function compareTasks(a: TaskSortKey, b: TaskSortKey): number {
  if (a.creationDate !== b.creationDate) {
    return a.creationDate < b.creationDate ? 1 : -1;
  }
  return a.id < b.id ? 1 : a.id > b.id ? -1 : 0;
}

// The cursor encodes the sort key of the last returned task, so pagination
// keeps working even if that task is deleted between page requests.
function encodeCursor(task: Task): string {
  return `${task.creationDate}|${task.id}`;
}

function decodeCursor(cursor: string): TaskSortKey | null {
  const separator = cursor.indexOf("|");
  if (separator === -1) return null;
  return {
    creationDate: cursor.slice(0, separator),
    id: cursor.slice(separator + 1),
  };
}

class TaskStore {
  private tasks = new Map<string, Task>();

  list({ limit, cursor }: ListTasksOptions): ListTasksResult | null {
    const sorted = [...this.tasks.values()].sort(compareTasks);

    let start = 0;
    if (cursor) {
      const after = decodeCursor(cursor);
      if (!after) return null;
      start = sorted.findIndex((task) => compareTasks(task, after) > 0);
      if (start === -1) start = sorted.length;
    }

    const items = sorted.slice(start, start + limit);
    const hasMore = start + limit < sorted.length;
    return {
      items,
      nextCursor: hasMore ? encodeCursor(items[items.length - 1]) : null,
    };
  }

  getById(id: string): Task | undefined {
    return this.tasks.get(id);
  }

  create(data: CreateTaskData): Task {
    const task: Task = {
      id: randomUUID(),
      title: data.title,
      description: data.description || undefined,
      creationDate: new Date().toISOString(),
    };
    this.tasks.set(task.id, task);
    return task;
  }

  update(id: string, data: UpdateTaskData): Task | undefined {
    const existing = this.tasks.get(id);
    if (!existing) return undefined;

    const updated: Task = {
      ...existing,
      ...(data.title !== undefined && { title: data.title }),
      ...(data.description !== undefined && {
        description: data.description || undefined,
      }),
    };
    this.tasks.set(id, updated);
    return updated;
  }

  delete(id: string): Task | undefined {
    const existing = this.tasks.get(id);
    if (existing) this.tasks.delete(id);
    return existing;
  }
}

// Keep a single instance per server process: Next.js bundles route handlers and
// pages separately (each would otherwise get its own copy of this module), and
// dev hot reloads would otherwise wipe the data on every edit.
const globalForStore = globalThis as unknown as { taskStore?: TaskStore };

export const taskStore = (globalForStore.taskStore ??= new TaskStore());
