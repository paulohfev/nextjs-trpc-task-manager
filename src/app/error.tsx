"use client";

import { FeedbackMessage } from "@/components/FeedbackMessage";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <section className="flex flex-col items-start gap-4">
      <FeedbackMessage
        variant="error"
        message="Something went wrong while loading this page."
      />
      <button
        type="button"
        onClick={reset}
        className="rounded-md border border-black/20 px-3 py-1 text-sm hover:bg-black/5 dark:border-white/25 dark:hover:bg-white/10"
      >
        Try again
      </button>
    </section>
  );
}
