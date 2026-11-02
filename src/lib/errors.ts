import { TRPCClientError } from "@trpc/client";
import type { AppRouter } from "@/server/routers/_app";

export function isTRPCClientError(
  error: unknown,
): error is TRPCClientError<AppRouter> {
  return error instanceof TRPCClientError;
}

// Turns any thrown value into a message that is safe to show to the user.
export function getErrorMessage(error: unknown, fallback: string): string {
  if (isTRPCClientError(error)) {
    // Network failures surface as generic fetch errors; make them readable.
    return error.data ? error.message : `${fallback} Check your connection.`;
  }
  return fallback;
}
