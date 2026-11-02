import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@/server/routers/_app";

// Browser-side tRPC client. Use it from event handlers and effects;
// Server Components should use `caller` from `@/trpc/server` instead.
export const trpcClient = createTRPCClient<AppRouter>({
  links: [httpBatchLink({ url: "/api/trpc" })],
});
