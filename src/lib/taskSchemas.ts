import { z } from "zod";

// Shared by the tRPC router and the task form so both validate the same way.
export const taskTitleSchema = z
  .string({ error: "Title is required." })
  .trim()
  .min(1, "Title is required.")
  .max(200, "Title must be at most 200 characters.");

export const taskDescriptionSchema = z
  .string()
  .trim()
  .max(2000, "Description must be at most 2000 characters.");

export const taskIdSchema = z.string().min(1, "Task id is required.");

export const createTaskSchema = z.object({
  title: taskTitleSchema,
  description: taskDescriptionSchema.optional(),
});

export const updateTaskSchema = z.object({
  id: taskIdSchema,
  title: taskTitleSchema.optional(),
  description: taskDescriptionSchema.optional(),
});
