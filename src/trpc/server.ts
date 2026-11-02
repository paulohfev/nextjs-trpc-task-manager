import "server-only";
import { appRouter } from "@/server/routers/_app";
import { createTRPCContext } from "@/server/trpc";

// Calls procedures directly from Server Components, without an HTTP round trip.
export const caller = appRouter.createCaller(createTRPCContext);
