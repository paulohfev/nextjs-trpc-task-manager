import { GET, POST } from "@/app/api/trpc/[trpc]/route";
import { seedTasks } from "@/test/tasks";

const BASE = "http://localhost/api/trpc";

async function query(path: string, input: unknown) {
  const url = `${BASE}/${path}?input=${encodeURIComponent(JSON.stringify(input))}`;
  const response = await GET(new Request(url));
  return { status: response.status, body: await response.json() };
}

async function mutate(path: string, input: unknown) {
  const response = await POST(
    new Request(`${BASE}/${path}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(input),
    }),
  );
  return { status: response.status, body: await response.json() };
}

describe("tRPC HTTP API", () => {
  it("should create, list, update and delete a task when called over HTTP", async () => {
    const created = await mutate("task.create", {
      title: "Write tests",
      description: "Cover the API",
    });
    expect(created.status).toBe(200);
    const task = created.body.result.data;
    expect(task).toMatchObject({ title: "Write tests", description: "Cover the API" });

    const listed = await query("task.list", { limit: 10 });
    expect(listed.body.result.data.items).toEqual([task]);

    const updated = await mutate("task.update", { id: task.id, title: "Write more tests" });
    expect(updated.body.result.data.title).toBe("Write more tests");

    const deleted = await mutate("task.delete", { id: task.id });
    expect(deleted.body.result.data).toEqual({ id: task.id });

    const afterDelete = await query("task.list", { limit: 10 });
    expect(afterDelete.body.result.data.items).toEqual([]);
  });

  it("should respond 400 with a readable message and field errors when the title is missing", async () => {
    const { status, body } = await mutate("task.create", { title: "" });

    expect(status).toBe(400);
    expect(body.error.message).toBe("Title is required.");
    expect(body.error.data.code).toBe("BAD_REQUEST");
    expect(body.error.data.zodError.fieldErrors).toEqual({
      title: ["Title is required."],
    });
  });

  it("should respond 404 with a meaningful message when updating a task that does not exist", async () => {
    const { status, body } = await mutate("task.update", {
      id: "missing",
      title: "Title",
    });

    expect(status).toBe(404);
    expect(body.error.message).toBe('Task with id "missing" was not found.');
  });

  it("should respond 404 when deleting a task that was already deleted", async () => {
    const [task] = seedTasks(1);
    await mutate("task.delete", { id: task.id });

    const { status, body } = await mutate("task.delete", { id: task.id });

    expect(status).toBe(404);
    expect(body.error.data.code).toBe("NOT_FOUND");
  });

  it("should return all tasks across pages when following nextCursor", async () => {
    seedTasks(5);

    const page1 = await query("task.list", { limit: 3 });
    const page2 = await query("task.list", {
      limit: 3,
      cursor: page1.body.result.data.nextCursor,
    });

    const titles = [...page1.body.result.data.items, ...page2.body.result.data.items].map(
      (task: { title: string }) => task.title,
    );
    expect(titles).toEqual(["Task 5", "Task 4", "Task 3", "Task 2", "Task 1"]);
    expect(page2.body.result.data.nextCursor).toBeNull();
  });
});
