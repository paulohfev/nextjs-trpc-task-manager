import { act, fireEvent, render, screen } from "@testing-library/react";
import { ToastProvider, type ToastOptions } from "@/components/Toast/ToastProvider";
import { useToast } from "@/hooks/useToast";

function ShowToastButton({ variant, message }: ToastOptions) {
  const showToast = useToast();
  return (
    <button type="button" onClick={() => showToast({ variant, message })}>
      Show toast
    </button>
  );
}

function renderToastTrigger(toast: ToastOptions) {
  render(
    <ToastProvider>
      <ShowToastButton {...toast} />
    </ToastProvider>,
  );
  fireEvent.click(screen.getByRole("button", { name: "Show toast" }));
}

// Moves time forward in small steps so React can re-render between timers,
// as it would in real time (the fade-out timer starts after a re-render).
function advance(ms: number) {
  for (let elapsed = 0; elapsed < ms; elapsed += 100) {
    act(() => {
      jest.advanceTimersByTime(Math.min(100, ms - elapsed));
    });
  }
}

describe("ToastProvider", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  it("should show the message when a toast is triggered", () => {
    renderToastTrigger({ variant: "success", message: "Task created." });

    expect(screen.getByRole("status")).toHaveTextContent("Task created.");
  });

  it("should announce error toasts as alerts when an error toast is triggered", () => {
    renderToastTrigger({ variant: "error", message: "Could not delete." });

    expect(screen.getByRole("alert")).toHaveTextContent("Could not delete.");
  });

  it("should hide a success toast when about 4 seconds have passed", () => {
    renderToastTrigger({ variant: "success", message: "Task created." });

    advance(3900);
    expect(screen.getByText("Task created.")).toBeInTheDocument();

    advance(400);
    expect(screen.queryByText("Task created.")).not.toBeInTheDocument();
  });

  it("should keep an error toast visible longer when the toast is an error", () => {
    renderToastTrigger({ variant: "error", message: "Could not delete." });

    advance(4500);
    expect(screen.getByText("Could not delete.")).toBeInTheDocument();

    advance(2000);
    expect(screen.queryByText("Could not delete.")).not.toBeInTheDocument();
  });

  it("should hide the toast when the dismiss button is clicked", () => {
    renderToastTrigger({ variant: "success", message: "Task created." });

    fireEvent.click(screen.getByRole("button", { name: "Dismiss notification" }));
    advance(300);

    expect(screen.queryByText("Task created.")).not.toBeInTheDocument();
  });

  it("should show several toasts at once when triggered repeatedly", () => {
    renderToastTrigger({ variant: "success", message: "Task deleted." });
    fireEvent.click(screen.getByRole("button", { name: "Show toast" }));

    expect(screen.getAllByText("Task deleted.")).toHaveLength(2);
  });

  it("should throw a helpful error when useToast is used outside a ToastProvider", () => {
    // React logs the thrown render error; keep the test output clean.
    jest.spyOn(console, "error").mockImplementation(() => {});

    expect(() =>
      render(<ShowToastButton variant="success" message="Hi" />),
    ).toThrow("useToast must be used inside <ToastProvider>.");
  });
});
