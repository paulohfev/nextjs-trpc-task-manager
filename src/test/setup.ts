import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { apiFetch } from "@/test/apiFetch";
import {
  installMockIntersectionObserver,
  uninstallMockIntersectionObserver,
} from "@/test/intersectionObserver";
import { clearTasks } from "@/test/tasks";

const realFetch = globalThis.fetch;

beforeEach(() => {
  globalThis.fetch = jest.fn(apiFetch);
  installMockIntersectionObserver();
});

afterEach(() => {
  cleanup();
  jest.useRealTimers();
  globalThis.fetch = realFetch;
  uninstallMockIntersectionObserver();
  jest.restoreAllMocks();
  jest.clearAllMocks();
  clearTasks();
});
