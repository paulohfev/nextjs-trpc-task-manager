import { StatusIcon } from "@/components/StatusIcon";

export type ErrorStateProps = {
  title: string;
  description: string;
  // Action buttons/links shown under the description.
  children?: React.ReactNode;
};

// Full-page error panel, used by the route error and not-found pages.
export function ErrorState({ title, description, children }: ErrorStateProps) {
  return (
    <section className="flex flex-col items-center gap-3 rounded-lg border border-black/10 px-6 py-12 text-center dark:border-white/15">
      <span className="rounded-full bg-red-600/10 p-3 text-red-600 dark:text-red-400">
        <StatusIcon variant="error" className="size-7" />
      </span>
      <h1 className="text-lg font-semibold">{title}</h1>
      <p className="max-w-sm text-sm opacity-75">{description}</p>
      {children && <div className="mt-2 flex gap-2">{children}</div>}
    </section>
  );
}
