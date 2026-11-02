export type FeedbackMessageProps = {
  variant: "success" | "error" | "info";
  message: string;
};

const variantClasses: Record<FeedbackMessageProps["variant"], string> = {
  success: "border-green-600/30 bg-green-600/10 text-green-700 dark:text-green-400",
  error: "border-red-600/30 bg-red-600/10 text-red-700 dark:text-red-400",
  info: "border-blue-600/30 bg-blue-600/10 text-blue-700 dark:text-blue-400",
};

export function FeedbackMessage({ variant, message }: FeedbackMessageProps) {
  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={`rounded-md border px-3 py-2 text-sm ${variantClasses[variant]}`}
    >
      {message}
    </div>
  );
}
