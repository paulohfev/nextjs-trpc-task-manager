import type { FeedbackVariant } from "@/lib/types";

export type StatusIconProps = {
  variant: FeedbackVariant;
  className?: string;
};

// Heroicons (MIT) outline paths.
const paths: Record<FeedbackVariant, string> = {
  success: "M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  error:
    "M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z",
};

export function StatusIcon({ variant, className = "size-5" }: StatusIconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${className}`}
    >
      <path d={paths[variant]} />
    </svg>
  );
}
