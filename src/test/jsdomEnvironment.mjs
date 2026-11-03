import { TestEnvironment } from "jest-environment-jsdom";

// jsdom lacks the Fetch API and streams that the tRPC route handler and client
// need, so expose Node's implementations alongside the DOM. AbortController and
// AbortSignal must come from Node too, so they match Node's Request.
const NODE_GLOBALS = [
  "fetch",
  "Request",
  "Response",
  "Headers",
  "AbortController",
  "AbortSignal",
  "ReadableStream",
  "WritableStream",
  "TransformStream",
  "TextEncoder",
  "TextDecoder",
];

export default class JsdomWithFetchEnvironment extends TestEnvironment {
  constructor(config, context) {
    super(config, context);
    for (const name of NODE_GLOBALS) {
      this.global[name] = globalThis[name];
    }
  }
}
