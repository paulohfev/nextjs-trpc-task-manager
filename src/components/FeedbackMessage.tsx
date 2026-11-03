import { StatusIcon } from "@/components/StatusIcon";
import type { FeedbackVariant } from "@/lib/types";

export type FeedbackMessageProps = {
  variant: FeedbackVariant;
  message: string;
  // Optional control shown on the right, e.g. a "Try again" button.
  action?: React.ReactNode;
};

const variantClasses: Record<FeedbackVariant, string> = {
  success:
    "border-green-600/25 bg-green-600/5 text-green-800 dark:text-green-300",
  error: "border-red-600/25 bg-red-600/5 text-red-800 dark:text-red-300",
};

// Inline message for errors that need to stay visible next to their context.
export function FeedbackMessage({
  variant,
  message,
  action,
}: FeedbackMessageProps) {
  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-sm ${variantClasses[variant]}`}
    >
      <StatusIcon variant={variant} />
      <p className="min-w-0 flex-1">{message}</p>
      {action}
    </div>
  );
}
