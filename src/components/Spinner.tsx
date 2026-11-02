export type SpinnerProps = {
  size?: "sm" | "md";
};

const sizeClasses: Record<NonNullable<SpinnerProps["size"]>, string> = {
  sm: "size-3.5",
  md: "size-5",
};

// Decorative: always pair it with visible text that describes what's loading.
// Users who prefer reduced motion see a static ring instead of a spinning one.
export function Spinner({ size = "md" }: SpinnerProps) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 rounded-full border-2 border-current/20 border-t-current opacity-70 motion-safe:animate-spin ${sizeClasses[size]}`}
    />
  );
}
