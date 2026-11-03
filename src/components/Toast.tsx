"use client";

import { useEffect, useState } from "react";
import { StatusIcon } from "@/components/StatusIcon";
import type { FeedbackVariant } from "@/lib/types";

// Errors stay a bit longer so there's time to read them.
const DURATION_MS: Record<FeedbackVariant, number> = {
  success: 4000,
  error: 6000,
};
const EXIT_MS = 200;

const iconClasses: Record<FeedbackVariant, string> = {
  success: "text-green-600 dark:text-green-400",
  error: "text-red-600 dark:text-red-400",
};

export type ToastProps = {
  id: number;
  variant: FeedbackVariant;
  message: string;
  onDismiss: (id: number) => void;
};

export function Toast({ id, variant, message, onDismiss }: ToastProps) {
  const [isLeaving, setIsLeaving] = useState(false);

  // Start fading out after the display duration...
  useEffect(() => {
    const timer = setTimeout(() => setIsLeaving(true), DURATION_MS[variant]);
    return () => clearTimeout(timer);
  }, [variant]);

  // ...and remove the toast once the fade-out has finished.
  useEffect(() => {
    if (!isLeaving) return;
    const timer = setTimeout(() => onDismiss(id), EXIT_MS);
    return () => clearTimeout(timer);
  }, [isLeaving, id, onDismiss]);

  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={`pointer-events-auto flex w-full items-center gap-3 rounded-lg border border-black/10 bg-background px-4 py-3 text-sm shadow-lg transition duration-200 motion-safe:animate-toast-in sm:w-80 dark:border-white/15 ${
        isLeaving ? "opacity-0 motion-safe:translate-y-2" : ""
      }`}
    >
      <StatusIcon variant={variant} className={`size-5 ${iconClasses[variant]}`} />
      <p className="min-w-0 flex-1">{message}</p>
      <button
        type="button"
        onClick={() => setIsLeaving(true)}
        aria-label="Dismiss notification"
        className="-mr-1 cursor-pointer rounded p-1 opacity-60 hover:bg-black/5 hover:opacity-100 dark:hover:bg-white/10"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          className="size-4"
        >
          <path d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
