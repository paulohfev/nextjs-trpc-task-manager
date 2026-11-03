import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConfirmDialog } from "@/components/ConfirmDialog/ConfirmDialog";

describe("ConfirmDialog", () => {
  const onConfirm = jest.fn();
  const onCancel = jest.fn();

  function renderDialog() {
    render(
      <ConfirmDialog
        title="Delete task?"
        description="This cannot be undone."
        confirmLabel="Delete task"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />,
    );
    return screen.getByRole("dialog", { name: "Delete task?" });
  }

  it("should show an open dialog described by its message when rendered", () => {
    const dialog = renderDialog();

    expect(dialog).toHaveAttribute("open");
    expect(dialog).toHaveAccessibleDescription("This cannot be undone.");
  });

  it("should focus the cancel button when the dialog opens", () => {
    renderDialog();

    expect(screen.getByRole("button", { name: "Cancel" })).toHaveFocus();
  });

  it("should call onConfirm when the confirm button is clicked", async () => {
    renderDialog();

    await userEvent.click(screen.getByRole("button", { name: "Delete task" }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onCancel).not.toHaveBeenCalled();
  });

  it("should call onCancel when the cancel button is clicked", async () => {
    renderDialog();

    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("should call onCancel when the user presses Escape", () => {
    const dialog = renderDialog();

    // Browsers fire `cancel` on the dialog when Escape is pressed.
    fireEvent(dialog, new Event("cancel", { cancelable: true }));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("should call onCancel when the user clicks the backdrop", async () => {
    const dialog = renderDialog();

    // Backdrop clicks land on the <dialog> element itself.
    await userEvent.click(dialog);

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("should stay open when the user clicks inside the dialog content", async () => {
    renderDialog();

    await userEvent.click(screen.getByText("This cannot be undone."));

    expect(onCancel).not.toHaveBeenCalled();
  });
});
