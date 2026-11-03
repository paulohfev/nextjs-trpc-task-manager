"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ErrorState } from "@/components/ErrorState";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorState
      title="Something went wrong"
      description="We couldn't load this page. Please try again in a moment."
    >
      <button
        type="button"
        onClick={reset}
        className="cursor-pointer rounded-md bg-foreground px-4 py-2 text-sm text-background hover:opacity-90"
      >
        Try again
      </button>
      <Link
        href="/"
        className="rounded-md border border-black/20 px-4 py-2 text-sm hover:bg-black/5 dark:border-white/25 dark:hover:bg-white/10"
      >
        Back to tasks
      </Link>
    </ErrorState>
  );
}
