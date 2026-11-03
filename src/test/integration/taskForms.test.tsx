import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NewTaskPage from "@/app/tasks/new/page";
import EditTaskPage from "@/app/tasks/[id]/edit/page";
import { taskStore } from "@/server/taskStore";
import { renderWithProviders } from "@/test/render";
import { seedTasks } from "@/test/tasks";

const mockPush = jest.fn();
const mockNotFound = jest.fn(() => {
  throw new Error("NEXT_NOT_FOUND");
});
// Reads the mocks lazily: jest.mock is hoisted above their declarations.
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  notFound: () => mockNotFound(),
}));

async function renderEditPage(id: string) {
  renderWithProviders(await EditTaskPage({ params: Promise.resolve({ id }) }));
}

describe("New task page", () => {
  it("should save the task, show a toast and return to the list when the form is submitted", async () => {
    renderWithProviders(<NewTaskPage />);

    await userEvent.type(screen.getByLabelText(/Title/), "  Buy groceries ");
    await userEvent.type(screen.getByLabelText("Description"), "Milk and eggs");
    await userEvent.click(screen.getByRole("button", { name: "Create task" }));

    await waitFor(() => expect(mockPush).toHaveBeenCalledWith("/"));
    expect(screen.getByText("Task created.")).toBeInTheDocument();
    expect(taskStore.list({ limit: 10 })?.items).toEqual([
      expect.objectContaining({
        title: "Buy groceries",
        description: "Milk and eggs",
      }),
    ]);
  });

  it("should not save anything when the title is missing", async () => {
    renderWithProviders(<NewTaskPage />);

    await userEvent.type(screen.getByLabelText("Description"), "No title");
    await userEvent.click(screen.getByRole("button", { name: "Create task" }));

    expect(screen.getByText("Title is required.")).toBeInTheDocument();
    expect(taskStore.list({ limit: 10 })?.items).toEqual([]);
    expect(mockPush).not.toHaveBeenCalled();
  });
});

describe("Edit task page", () => {
  it("should prefill the form with the task when the page loads", async () => {
    const [task] = seedTasks(1);
    taskStore.update(task.id, { description: "Original details" });

    await renderEditPage(task.id);

    expect(screen.getByRole("heading", { name: "Edit task" })).toBeInTheDocument();
    expect(screen.getByLabelText(/Title/)).toHaveValue("Task 1");
    expect(screen.getByLabelText("Description")).toHaveValue("Original details");
  });

  it("should save the changes, show a toast and return to the list when the form is submitted", async () => {
    const [task] = seedTasks(1);
    await renderEditPage(task.id);

    const title = screen.getByLabelText(/Title/);
    await userEvent.clear(title);
    await userEvent.type(title, "Renamed task");
    await userEvent.click(screen.getByRole("button", { name: "Save changes" }));

    await waitFor(() => expect(mockPush).toHaveBeenCalledWith("/"));
    expect(screen.getByText("Task updated.")).toBeInTheDocument();
    expect(taskStore.getById(task.id)?.title).toBe("Renamed task");
  });

  it("should remove the description when the user clears it and saves", async () => {
    const [task] = seedTasks(1);
    taskStore.update(task.id, { description: "Remove me" });
    await renderEditPage(task.id);

    await userEvent.clear(screen.getByLabelText("Description"));
    await userEvent.click(screen.getByRole("button", { name: "Save changes" }));

    await waitFor(() => expect(mockPush).toHaveBeenCalledWith("/"));
    expect(taskStore.getById(task.id)?.description).toBeUndefined();
  });

  it("should show the not-found page when the task does not exist", async () => {
    await expect(renderEditPage("missing")).rejects.toThrow("NEXT_NOT_FOUND");
    expect(mockNotFound).toHaveBeenCalled();
  });

  it("should show the server error and stay on the page when the task was deleted before saving", async () => {
    const [task] = seedTasks(1);
    await renderEditPage(task.id);
    taskStore.delete(task.id);

    await userEvent.click(screen.getByRole("button", { name: "Save changes" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      `Task with id "${task.id}" was not found.`,
    );
    expect(screen.getByRole("button", { name: "Save changes" })).toBeEnabled();
    expect(mockPush).not.toHaveBeenCalled();
  });
});
