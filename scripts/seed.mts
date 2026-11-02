// Seeds mock tasks into a running app through its tRPC API. The task store
// lives in the server's memory, so the server must be running first.
//
// Usage: npm run seed

import { createTRPCClient, httpLink, TRPCClientError } from "@trpc/client";
import type { AppRouter } from "@/server/routers/_app";

const TASK_COUNT = 25;
const baseUrl = "http://localhost:3000";

const words =
  "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat".split(
    " ",
  );

function randomWords(count: number): string {
  return Array.from(
    { length: count },
    () => words[Math.floor(Math.random() * words.length)],
  ).join(" ");
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

async function main() {
  const client = createTRPCClient<AppRouter>({
    links: [httpLink({ url: `${baseUrl}/api/trpc` })],
  });

  console.log(`Seeding ${TASK_COUNT} tasks into ${baseUrl}…`);
  // Sequential, so each task gets a distinct creation time and a stable order.
  for (let i = 1; i <= TASK_COUNT; i++) {
    await client.task.create.mutate({
      title: `${i}. ${capitalize(randomWords(4))}`,
      // Leave some descriptions empty to cover the optional field.
      description:
        i % 4 === 0 ? undefined : `${capitalize(randomWords(14))}.`,
    });
  }
  console.log(`Done: created ${TASK_COUNT} tasks.`);
}

main().catch((error: unknown) => {
  if (error instanceof TRPCClientError && !error.data) {
    console.error(
      `Could not reach ${baseUrl}. Start the app first (npm run dev).`,
    );
  } else {
    console.error(error instanceof Error ? error.message : error);
  }
  process.exitCode = 1;
});
