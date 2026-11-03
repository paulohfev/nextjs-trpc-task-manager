import { useContext } from "react";
import { ToastContext } from "@/components/ToastProvider";

// Returns `showToast({ variant, message })` for short-lived status messages.
export function useToast() {
  const showToast = useContext(ToastContext);
  if (!showToast) {
    throw new Error("useToast must be used inside <ToastProvider>.");
  }
  return showToast;
}
