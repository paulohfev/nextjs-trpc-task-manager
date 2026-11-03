import { GET, POST } from "@/app/api/trpc/[trpc]/route";

// Stands in for the browser's `fetch`: sends the app's HTTP requests to the
// real tRPC route handler in-process, so tests exercise the actual backend.
export async function apiFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  // jsdom's AbortSignal isn't accepted by Node's Request; nothing aborts here.
  const request = new Request(new URL(String(input), "http://localhost"), {
    ...init,
    signal: undefined,
  });
  return request.method === "GET" ? GET(request) : POST(request);
}
