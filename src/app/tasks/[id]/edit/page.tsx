import { TRPCError } from "@trpc/server";
import { notFound } from "next/navigation";
import { TaskForm } from "@/components/TaskForm/TaskForm";
import { caller } from "@/trpc/server";

type EditTaskPageProps = {
  params: Promise<{ id: string }>;
};

async function getTask(id: string) {
  try {
    return await caller.task.getById({ id });
  } catch (error) {
    if (error instanceof TRPCError && error.code === "NOT_FOUND") notFound();
    throw error;
  }
}

export default async function EditTaskPage({ params }: EditTaskPageProps) {
  const { id } = await params;
  const task = await getTask(id);

  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Edit task</h1>
      <TaskForm initialTask={task} />
    </section>
  );
}
