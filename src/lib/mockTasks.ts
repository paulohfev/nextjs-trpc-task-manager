import type { Task } from "@/lib/types";

// Placeholder data until the tRPC backend is wired up.
export const mockTasks: Task[] = [
  {
    id: "1",
    title: "Lorem ipsum dolor sit amet",
    description:
      "Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    creationDate: "2026-11-02T10:00:00.000Z",
  },
  {
    id: "2",
    title: "Ut enim ad minim veniam",
    description:
      "Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    creationDate: "2026-11-02T11:00:00.000Z",
  },
  {
    id: "3",
    title: "Duis aute irure dolor",
    creationDate: "2026-11-02T12:00:00.000Z",
  },
];
