import Link from "next/link";
import { ErrorState } from "@/components/ErrorState";

export default function NotFound() {
  return (
    <ErrorState
      title="Not found"
      description="This page or task doesn't exist. It may have been deleted."
    >
      <Link
        href="/"
        className="rounded-md bg-foreground px-4 py-2 text-sm text-background hover:opacity-90"
      >
        Back to tasks
      </Link>
    </ErrorState>
  );
}
