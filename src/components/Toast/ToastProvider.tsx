"use client";

import { createContext, useCallback, useRef, useState } from "react";
import { Toast } from "@/components/Toast/Toast";
import type { FeedbackVariant } from "@/lib/types";

export type ToastOptions = {
  variant: FeedbackVariant;
  message: string;
};

type ToastItem = ToastOptions & { id: number };

export const ToastContext = createContext<
  ((toast: ToastOptions) => void) | null
>(null);

export type ToastProviderProps = {
  children: React.ReactNode;
};

// Lives in the root layout, so toasts survive client-side navigation.
export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const showToast = useCallback((toast: ToastOptions) => {
    const id = nextId.current++;
    setToasts((current) => [...current, { ...toast, id }]);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col items-end gap-2 sm:left-auto"
      >
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onDismiss={dismissToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
