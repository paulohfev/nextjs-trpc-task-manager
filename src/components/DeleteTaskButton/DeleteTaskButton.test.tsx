import { render, screen, waitFor } from "@testing-library/react";
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

  beforeEach(() => {
    jest.spyOn(window, "confirm").mockReturnValue(true);
  });

  it("should ask for confirmation with the task title when clicked", async () => {
    const [task] = seedTasks(1);

    await userEvent.click(renderButton(task.id, task.title));

    expect(window.confirm).toHaveBeenCalledWith('Delete "Task 1"?');
  });

  it("should not delete the task when the user cancels the confirmation", async () => {
    jest.mocked(window.confirm).mockReturnValue(false);
    const [task] = seedTasks(1);

    await userEvent.click(renderButton(task.id));

    expect(fetch).not.toHaveBeenCalled();
    expect(onDeleted).not.toHaveBeenCalled();
    expect(taskStore.getById(task.id)).toEqual(task);
  });

  it("should delete the task and report it when the user confirms", async () => {
    const [task] = seedTasks(1);

    await userEvent.click(renderButton(task.id));

    await waitFor(() => expect(onDeleted).toHaveBeenCalledWith(task.id));
    expect(taskStore.getById(task.id)).toBeUndefined();
    expect(onError).not.toHaveBeenCalled();
  });

  it("should show a disabled deleting state when the request is in progress", async () => {
    jest.mocked(fetch).mockReturnValue(new Promise(() => {}));
    const [task] = seedTasks(1);

    await userEvent.click(renderButton(task.id));

    expect(screen.getByRole("button", { name: "Deleting…" })).toBeDisabled();
  });

  it("should report the server's message and re-enable the button when the task does not exist", async () => {
    await userEvent.click(renderButton("missing"));

    await waitFor(() =>
      expect(onError).toHaveBeenCalledWith('Task with id "missing" was not found.'),
    );
    expect(onDeleted).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Delete" })).toBeEnabled();
  });

  it("should report a connection problem when the request cannot reach the server", async () => {
    jest.mocked(fetch).mockRejectedValue(new TypeError("Failed to fetch"));
    const [task] = seedTasks(1);

    await userEvent.click(renderButton(task.id));

    await waitFor(() =>
      expect(onError).toHaveBeenCalledWith(
        "Failed to delete the task. Check your connection.",
      ),
    );
  });
});
