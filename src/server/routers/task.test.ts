import { appRouter } from "@/server/routers/_app";
import { taskStore } from "@/server/taskStore";
import { seedTasks } from "@/test/tasks";

const caller = appRouter.createCaller({});

describe("task router", () => {
  describe("create", () => {
    it("should save the task with trimmed text when the input is valid", async () => {
      const task = await caller.task.create({
        title: "  Buy milk  ",
        description: "  2 liters ",
      });

      expect(task).toMatchObject({ title: "Buy milk", description: "2 liters" });
      expect(taskStore.getById(task.id)).toEqual(task);
    });

    it("should reject with BAD_REQUEST when the title is blank", async () => {
      await expect(caller.task.create({ title: "   " })).rejects.toMatchObject({
        code: "BAD_REQUEST",
      });
    });

    it("should reject with BAD_REQUEST when the title is longer than 200 characters", async () => {
      await expect(
        caller.task.create({ title: "a".repeat(201) }),
      ).rejects.toMatchObject({ code: "BAD_REQUEST" });
    });
  });

  describe("list", () => {
    it("should return 10 tasks and a cursor when no limit is given", async () => {
      seedTasks(12);

      const page = await caller.task.list({});

      expect(page.items).toHaveLength(10);
      expect(page.nextCursor).toEqual(expect.any(String));
    });

    it("should reject with BAD_REQUEST when the cursor is invalid", async () => {
      await expect(
        caller.task.list({ cursor: "not-a-cursor" }),
      ).rejects.toMatchObject({
        code: "BAD_REQUEST",
        message: "Invalid pagination cursor.",
      });
    });

    it("should reject with BAD_REQUEST when the limit is above 50", async () => {
      await expect(caller.task.list({ limit: 51 })).rejects.toMatchObject({
        code: "BAD_REQUEST",
      });
    });
  });

  describe("getById", () => {
    it("should return the task when it exists", async () => {
      const [task] = seedTasks(1);

      await expect(caller.task.getById({ id: task.id })).resolves.toEqual(task);
    });

    it("should reject with NOT_FOUND when the task does not exist", async () => {
      await expect(caller.task.getById({ id: "missing" })).rejects.toMatchObject(
        { code: "NOT_FOUND", message: 'Task with id "missing" was not found.' },
      );
    });
  });

  describe("update", () => {
    it("should save the changes when the task exists", async () => {
      const [task] = seedTasks(1);

      const updated = await caller.task.update({
        id: task.id,
        title: "Renamed",
        description: "New details",
      });

      expect(updated).toEqual({
        ...task,
        title: "Renamed",
        description: "New details",
      });
    });

    it("should reject with NOT_FOUND when the task does not exist", async () => {
      await expect(
        caller.task.update({ id: "missing", title: "Title" }),
      ).rejects.toMatchObject({
        code: "NOT_FOUND",
        message: 'Task with id "missing" was not found.',
      });
    });

    it("should reject with BAD_REQUEST and keep the task unchanged when the new title is blank", async () => {
      const [task] = seedTasks(1);

      await expect(
        caller.task.update({ id: task.id, title: "" }),
      ).rejects.toMatchObject({ code: "BAD_REQUEST" });
      expect(taskStore.getById(task.id)).toEqual(task);
    });
  });

  describe("delete", () => {
    it("should remove the task when it exists", async () => {
      const [task] = seedTasks(1);

      await expect(caller.task.delete({ id: task.id })).resolves.toEqual({
        id: task.id,
      });
      expect(taskStore.getById(task.id)).toBeUndefined();
    });

    it("should reject with NOT_FOUND when the task does not exist", async () => {
      await expect(caller.task.delete({ id: "missing" })).rejects.toMatchObject({
        code: "NOT_FOUND",
      });
    });
  });
});
