import { Spinner } from "@/components/Spinner";

export default function Loading() {
  return (
    <div
      role="status"
      className="flex items-center justify-center gap-2 py-8 text-sm opacity-70"
    >
      <Spinner />
      Loading…
    </div>
  );
}
