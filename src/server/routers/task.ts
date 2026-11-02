import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { publicProcedure, router } from "@/server/trpc";
import { taskStore } from "@/server/taskStore";
import {
  createTaskSchema,
  taskIdSchema,
  updateTaskSchema,
} from "@/lib/taskSchemas";

function taskNotFound(id: string): TRPCError {
  return new TRPCError({
    code: "NOT_FOUND",
    message: `Task with id "${id}" was not found.`,
  });
}

export const taskRouter = router({
  list: publicProcedure
    .input(
      z.object({
        limit: z.number().int().min(1).max(50).default(10),
        cursor: z.string().nullish(),
      }),
    )
    .query(({ input }) => {
      const result = taskStore.list({
        limit: input.limit,
        cursor: input.cursor ?? undefined,
      });
      if (!result) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid pagination cursor.",
        });
      }
      return result;
    }),

  getById: publicProcedure
    .input(z.object({ id: taskIdSchema }))
    .query(({ input }) => {
      const task = taskStore.getById(input.id);
      if (!task) throw taskNotFound(input.id);
      return task;
    }),

  create: publicProcedure
    .input(createTaskSchema)
    .mutation(({ input }) => taskStore.create(input)),

  update: publicProcedure
    .input(updateTaskSchema)
    .mutation(({ input }) => {
      const { id, ...data } = input;
      const task = taskStore.update(id, data);
      if (!task) throw taskNotFound(id);
      return task;
    }),

  delete: publicProcedure
    .input(z.object({ id: taskIdSchema }))
    .mutation(({ input }) => {
      const task = taskStore.delete(input.id);
      if (!task) throw taskNotFound(input.id);
      return { id: task.id };
    }),
});
