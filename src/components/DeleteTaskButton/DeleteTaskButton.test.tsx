import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DeleteTaskButton } from "@/components/DeleteTaskButton/DeleteTaskButton";
import { taskStore } from "@/server/taskStore";
import { seedTasks } from "@/test/tasks";

describe("DeleteTaskButton", () => {
  const onDeleted = jest.fn();
  const onError = jest.fn();

  function renderButton(taskId: string, taskTitle = "Task 1") {
    render(
      <DeleteTaskButton
        taskId={taskId}
        taskTitle={taskTitle}
        onDeleted={onDeleted}
        onError={onError}
      />,
    );
    return screen.getByRole("button", { name: "Delete" });
  }

  async function openDialog(button: HTMLElement) {
    await userEvent.click(button);
    return screen.getByRole("dialog", { name: "Delete task?" });
  }

  async function confirmDeletion(button: HTMLElement) {
    const dialog = await openDialog(button);
    await userEvent.click(
      within(dialog).getByRole("button", { name: "Delete task" }),
    );
  }

  it("should ask for confirmation in a dialog naming the task when clicked", async () => {
    const [task] = seedTasks(1);

    const dialog = await openDialog(renderButton(task.id, task.title));

    expect(dialog).toHaveAccessibleDescription(
      "Task 1 will be permanently deleted.",
    );
    expect(fetch).not.toHaveBeenCalled();
  });

  it("should close the dialog, keep the task and refocus the button when the user cancels", async () => {
    const [task] = seedTasks(1);
    const button = renderButton(task.id);
    const dialog = await openDialog(button);

    await userEvent.click(within(dialog).getByRole("button", { name: "Cancel" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(button).toHaveFocus();
    expect(fetch).not.toHaveBeenCalled();
    expect(onDeleted).not.toHaveBeenCalled();
    expect(taskStore.getById(task.id)).toEqual(task);
  });

  it("should delete the task and report it when the user confirms", async () => {
    const [task] = seedTasks(1);

    await confirmDeletion(renderButton(task.id));

    await waitFor(() => expect(onDeleted).toHaveBeenCalledWith(task.id));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(taskStore.getById(task.id)).toBeUndefined();
    expect(onError).not.toHaveBeenCalled();
  });

  it("should show a disabled deleting state when the request is in progress", async () => {
    jest.mocked(fetch).mockReturnValue(new Promise(() => {}));
    const [task] = seedTasks(1);

    await confirmDeletion(renderButton(task.id));

    expect(screen.getByRole("button", { name: "Deleting…" })).toBeDisabled();
  });

  it("should report the server's message and re-enable the button when the task does not exist", async () => {
    await confirmDeletion(renderButton("missing"));

    await waitFor(() =>
      expect(onError).toHaveBeenCalledWith('Task with id "missing" was not found.'),
    );
    expect(onDeleted).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Delete" })).toBeEnabled();
  });

  it("should report a connection problem when the request cannot reach the server", async () => {
    jest.mocked(fetch).mockRejectedValue(new TypeError("Failed to fetch"));
    const [task] = seedTasks(1);

    await confirmDeletion(renderButton(task.id));

    await waitFor(() =>
      expect(onError).toHaveBeenCalledWith(
        "Failed to delete the task. Check your connection.",
      ),
    );
  });
});
