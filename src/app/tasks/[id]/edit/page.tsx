import { notFound } from "next/navigation";
import { TaskForm } from "@/components/TaskForm";
import { mockTasks } from "@/lib/mockTasks";

type EditTaskPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditTaskPage({ params }: EditTaskPageProps) {
  const { id } = await params;
  // Placeholder: will fetch the task via tRPC.
  const task = mockTasks.find((t) => t.id === id);

  if (!task) {
    notFound();
  }

  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Edit task</h1>
      <TaskForm initialTask={task} />
    </section>
  );
}
