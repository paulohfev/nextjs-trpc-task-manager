import { render } from "@testing-library/react";
import { ToastProvider } from "@/components/Toast/ToastProvider";

// Renders inside the same providers the root layout uses.
export function renderWithProviders(ui: React.ReactElement) {
  return render(ui, { wrapper: ToastProvider });
}
