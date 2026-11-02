import { initTRPC } from "@trpc/server";
import { cache } from "react";
import { z, ZodError } from "zod";

export const createTRPCContext = cache(async () => {
  return {};
});

type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create({
  // Expose field-level validation errors so the client can show them.
  errorFormatter({ shape, error }) {
    const zodError = error.cause instanceof ZodError ? error.cause : null;
    return {
      ...shape,
      // Replace the raw JSON dump of issues with a human-readable message.
      message: zodError
        ? zodError.issues.map((issue) => issue.message).join(" ")
        : shape.message,
      data: {
        ...shape.data,
        zodError: zodError ? z.flattenError(zodError) : null,
      },
    };
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;
