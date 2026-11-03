import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TaskForm } from "@/components/TaskForm/TaskForm";
import { renderWithProviders } from "@/test/render";
import { seedTasks } from "@/test/tasks";

const mockPush = jest.fn();
// Reads `mockPush` lazily: jest.mock is hoisted above its declaration.
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe("TaskForm", () => {
  function renderForm(...args: Parameters<typeof TaskForm>) {
    renderWithProviders(<TaskForm {...args[0]} />);
    return {
      title: screen.getByLabelText(/Title/),
      description: screen.getByLabelText("Description"),
    };
  }

  it("should show an error and not send a request when the title is empty", async () => {
    const { title } = renderForm({});

    await userEvent.click(screen.getByRole("button", { name: "Create task" }));

    expect(screen.getByText("Title is required.")).toBeInTheDocument();
    expect(title).toHaveAttribute("aria-invalid", "true");
    expect(title).toHaveAccessibleDescription("Title is required.");
    expect(fetch).not.toHaveBeenCalled();
  });

  it("should treat a title of only spaces as empty when submitting", async () => {
    const { title } = renderForm({});

    await userEvent.type(title, "   ");
    await userEvent.click(screen.getByRole("button", { name: "Create task" }));

    expect(screen.getByText("Title is required.")).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("should show an error when the title is longer than 200 characters", async () => {
    const { title } = renderForm({});

    await userEvent.click(title);
    await userEvent.paste("a".repeat(201));
    await userEvent.click(screen.getByRole("button", { name: "Create task" }));

    expect(
      screen.getByText("Title must be at most 200 characters."),
    ).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("should clear the error when the form is resubmitted with a valid title", async () => {
    const { title } = renderForm({});
    await userEvent.click(screen.getByRole("button", { name: "Create task" }));

    await userEvent.type(title, "Valid title");
    await userEvent.click(screen.getByRole("button", { name: "Create task" }));

    await waitFor(() => expect(mockPush).toHaveBeenCalledWith("/"));
    expect(screen.queryByText("Title is required.")).not.toBeInTheDocument();
  });

  it("should disable the form and show a saving state when the request is in progress", async () => {
    jest.mocked(fetch).mockReturnValue(new Promise(() => {}));
    const { title, description } = renderForm({});

    await userEvent.type(title, "New task");
    await userEvent.click(screen.getByRole("button", { name: "Create task" }));

    expect(screen.getByRole("button", { name: "Saving…" })).toBeDisabled();
    expect(title).toBeDisabled();
    expect(description).toBeDisabled();
  });

  it("should show a connection error and re-enable the form when the request fails", async () => {
    jest.mocked(fetch).mockRejectedValue(new TypeError("Failed to fetch"));
    const { title } = renderForm({});

    await userEvent.type(title, "New task");
    await userEvent.click(screen.getByRole("button", { name: "Create task" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Failed to save the task. Check your connection.",
    );
    expect(screen.getByRole("button", { name: "Create task" })).toBeEnabled();
    expect(title).toHaveValue("New task");
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("should prefill the fields and offer to save changes when editing a task", () => {
    const [task] = seedTasks(1);
    const { title, description } = renderForm({
      initialTask: { ...task, description: "Some details" },
    });

    expect(title).toHaveValue("Task 1");
    expect(description).toHaveValue("Some details");
    expect(screen.getByRole("button", { name: "Save changes" })).toBeInTheDocument();
  });
});
