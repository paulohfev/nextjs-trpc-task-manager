import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TasksPage from "@/app/page";
import { taskStore } from "@/server/taskStore";
import { scrollToBottom } from "@/test/intersectionObserver";
import { renderWithProviders } from "@/test/render";
import { seedTasks } from "@/test/tasks";

// Renders the Server Component on the "server", then the result in the DOM.
async function renderTasksPage() {
  renderWithProviders(await TasksPage());
}

function getTaskTitles() {
  return screen
    .queryAllByRole("listitem")
    .map((item) => within(item).getByRole("heading").textContent);
}

function getTaskItem(title: string) {
  const item = screen.getByRole("heading", { name: title }).closest("li");
  if (!item) throw new Error(`No list item for "${title}"`);
  return item;
}

describe("Tasks page", () => {
  beforeEach(() => {
    jest.spyOn(window, "confirm").mockReturnValue(true);
  });

  describe("listing", () => {
    it("should render the first 10 tasks, newest first, when the page loads", async () => {
      seedTasks(15);

      await renderTasksPage();

      expect(getTaskTitles()).toEqual(
        Array.from({ length: 10 }, (_, i) => `Task ${15 - i}`),
      );
      // The first page came from the server render, not a client request.
      expect(fetch).not.toHaveBeenCalled();
    });

    it("should show an empty state when there are no tasks", async () => {
      await renderTasksPage();

      expect(
        screen.getByText("No tasks yet. Create your first one!"),
      ).toBeInTheDocument();
    });

    it("should load the next page when the user scrolls to the bottom", async () => {
      seedTasks(15);
      await renderTasksPage();

      scrollToBottom();

      expect(await screen.findByRole("heading", { name: "Task 1" })).toBeInTheDocument();
      expect(getTaskTitles()).toHaveLength(15);
    });

    it("should stop loading when every task has been loaded", async () => {
      seedTasks(15);
      await renderTasksPage();
      scrollToBottom();
      await screen.findByRole("heading", { name: "Task 1" });

      scrollToBottom();

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(getTaskTitles()).toHaveLength(15);
    });

    it("should show an error with a retry option when loading more tasks fails", async () => {
      seedTasks(15);
      await renderTasksPage();
      jest.mocked(fetch).mockRejectedValueOnce(new TypeError("Failed to fetch"));

      scrollToBottom();

      const alert = await screen.findByRole("alert");
      expect(alert).toHaveTextContent(
        "Failed to load more tasks. Check your connection.",
      );

      await userEvent.click(within(alert).getByRole("button", { name: "Try again" }));

      expect(await screen.findByRole("heading", { name: "Task 1" })).toBeInTheDocument();
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });

  describe("deleting", () => {
    it("should remove the task and show a success toast when the user confirms", async () => {
      seedTasks(3);
      await renderTasksPage();

      await userEvent.click(
        within(getTaskItem("Task 2")).getByRole("button", { name: "Delete" }),
      );

      await waitFor(() => expect(getTaskTitles()).toEqual(["Task 3", "Task 1"]));
      expect(screen.getByText("Task deleted.")).toBeInTheDocument();
      expect(taskStore.list({ limit: 10 })?.items).toHaveLength(2);
    });

    it("should keep the task when the user cancels the confirmation", async () => {
      jest.mocked(window.confirm).mockReturnValue(false);
      seedTasks(2);
      await renderTasksPage();

      await userEvent.click(
        within(getTaskItem("Task 2")).getByRole("button", { name: "Delete" }),
      );

      expect(getTaskTitles()).toEqual(["Task 2", "Task 1"]);
      expect(fetch).not.toHaveBeenCalled();
    });

    it("should show an error toast and keep the task when it was already deleted elsewhere", async () => {
      const [task] = seedTasks(1);
      await renderTasksPage();
      taskStore.delete(task.id);

      await userEvent.click(screen.getByRole("button", { name: "Delete" }));

      expect(await screen.findByRole("alert")).toHaveTextContent(
        `Task with id "${task.id}" was not found.`,
      );
      expect(getTaskTitles()).toEqual(["Task 1"]);
    });
  });
});
