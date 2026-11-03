import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { apiFetch } from "@/test/apiFetch";
import {
  installMockIntersectionObserver,
  uninstallMockIntersectionObserver,
} from "@/test/intersectionObserver";
import { clearTasks } from "@/test/tasks";

// jsdom doesn't implement <dialog>'s modal methods; mimic their open state.
HTMLDialogElement.prototype.showModal ??= function (this: HTMLDialogElement) {
  this.setAttribute("open", "");
};
HTMLDialogElement.prototype.close ??= function (this: HTMLDialogElement) {
  this.removeAttribute("open");
};

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
