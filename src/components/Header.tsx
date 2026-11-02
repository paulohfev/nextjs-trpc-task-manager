import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-black/10 dark:border-white/15">
      <nav className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-semibold">
          Task Manager
        </Link>
        <Link
          href="/tasks/new"
          className="rounded-md bg-foreground px-3 py-1.5 text-sm text-background hover:opacity-90"
        >
          New task
        </Link>
      </nav>
    </header>
  );
}
