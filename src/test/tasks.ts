import type { Task } from "@/lib/types";
import { taskStore } from "@/server/taskStore";

export function clearTasks() {
  const all = taskStore.list({ limit: Number.MAX_SAFE_INTEGER });
  for (const task of all?.items ?? []) taskStore.delete(task.id);
}

// Adds "Task 1" … "Task N" one second apart, so "Task N" is the newest and the
// list order is deterministic.
export function seedTasks(count: number): Task[] {
  // Seeding is synchronous, so faking every timer briefly is harmless.
  jest.useFakeTimers();
  const tasks = Array.from({ length: count }, (_, i) => {
    jest.setSystemTime(Date.UTC(2026, 0, 1) + i * 1000);
    return taskStore.create({ title: `Task ${i + 1}` });
  });
  jest.useRealTimers();
  return tasks;
}
