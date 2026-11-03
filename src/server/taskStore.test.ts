import { TaskStore } from "@/server/taskStore";

const START = Date.UTC(2026, 0, 1);

describe("TaskStore", () => {
  let store: TaskStore;

  // Adds "Task 1" … "Task N" one second apart ("Task N" is the newest).
  function addTasks(count: number) {
    return Array.from({ length: count }, (_, i) => {
      jest.setSystemTime(START + i * 1000);
      return store.create({ title: `Task ${i + 1}` });
    });
  }

  function titles(result: ReturnType<TaskStore["list"]>) {
    return result?.items.map((task) => task.title);
  }

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(START);
    store = new TaskStore();
  });

  describe("create", () => {
    it("should assign a unique id and the current time when a task is created", () => {
      const first = store.create({ title: "First", description: "Details" });
      const second = store.create({ title: "Second" });

      expect(first).toEqual({
        id: expect.any(String),
        title: "First",
        description: "Details",
        creationDate: new Date(START).toISOString(),
      });
      expect(second.id).not.toBe(first.id);
    });

    it("should store no description when the description is an empty string", () => {
      const task = store.create({ title: "Task", description: "" });

      expect(task.description).toBeUndefined();
    });
  });

  describe("list", () => {
    it("should return tasks newest first when listing", () => {
      addTasks(3);

      expect(titles(store.list({ limit: 10 }))).toEqual([
        "Task 3",
        "Task 2",
        "Task 1",
      ]);
    });

    it("should return every page in order when following the cursors", () => {
      addTasks(5);

      const page1 = store.list({ limit: 2 });
      const page2 = store.list({ limit: 2, cursor: page1?.nextCursor ?? "" });
      const page3 = store.list({ limit: 2, cursor: page2?.nextCursor ?? "" });

      expect(titles(page1)).toEqual(["Task 5", "Task 4"]);
      expect(titles(page2)).toEqual(["Task 3", "Task 2"]);
      expect(titles(page3)).toEqual(["Task 1"]);
      expect(page3?.nextCursor).toBeNull();
    });

    it("should continue after the cursor when the cursor's task was deleted", () => {
      const tasks = addTasks(5);
      const page1 = store.list({ limit: 2 });

      store.delete(tasks[3].id); // "Task 4", the last item of page 1
      const page2 = store.list({ limit: 2, cursor: page1?.nextCursor ?? "" });

      expect(titles(page2)).toEqual(["Task 3", "Task 2"]);
    });

    it("should return null when the cursor is malformed", () => {
      addTasks(1);

      expect(store.list({ limit: 10, cursor: "not-a-cursor" })).toBeNull();
    });
  });

  describe("update", () => {
    it("should change only the provided fields when updating", () => {
      const task = store.create({ title: "Old title", description: "Keep me" });

      const updated = store.update(task.id, { title: "New title" });

      expect(updated).toEqual({ ...task, title: "New title" });
      expect(store.getById(task.id)).toEqual(updated);
    });

    it("should remove the description when it is updated to an empty string", () => {
      const task = store.create({ title: "Task", description: "Remove me" });

      expect(store.update(task.id, { description: "" })?.description).toBeUndefined();
    });

    it("should return undefined when the task does not exist", () => {
      expect(store.update("missing", { title: "Title" })).toBeUndefined();
    });
  });

  describe("delete", () => {
    it("should remove the task and return it when the task exists", () => {
      const task = store.create({ title: "Task" });

      expect(store.delete(task.id)).toEqual(task);
      expect(store.getById(task.id)).toBeUndefined();
    });

    it("should return undefined when the task does not exist", () => {
      expect(store.delete("missing")).toBeUndefined();
    });
  });
});
