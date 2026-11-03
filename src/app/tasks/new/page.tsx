import { TaskForm } from "@/components/TaskForm/TaskForm";

export default function NewTaskPage() {
  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">New task</h1>
      <TaskForm />
    </section>
  );
}
