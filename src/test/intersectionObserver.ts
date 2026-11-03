import { act } from "@testing-library/react";

// jsdom has no IntersectionObserver; this stand-in lets tests decide when
// observed elements become visible.
const observers = new Set<MockIntersectionObserver>();

class MockIntersectionObserver {
  readonly root = null;
  readonly rootMargin = "";
  readonly thresholds: number[] = [];
  private readonly elements = new Set<Element>();
  private readonly callback: IntersectionObserverCallback;

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
    observers.add(this);
  }

  observe(element: Element) {
    this.elements.add(element);
  }

  unobserve(element: Element) {
    this.elements.delete(element);
  }

  disconnect() {
    this.elements.clear();
    observers.delete(this);
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  reveal() {
    const entries = [...this.elements].map(
      (target) => ({ target, isIntersecting: true }) as IntersectionObserverEntry,
    );
    if (entries.length > 0) {
      this.callback(entries, this as unknown as IntersectionObserver);
    }
  }
}

const realIntersectionObserver = globalThis.IntersectionObserver;

export function installMockIntersectionObserver() {
  observers.clear();
  globalThis.IntersectionObserver =
    MockIntersectionObserver as unknown as typeof IntersectionObserver;
}

export function uninstallMockIntersectionObserver() {
  observers.clear();
  globalThis.IntersectionObserver = realIntersectionObserver;
}

// Simulates the user scrolling until every observed element is in view.
export function scrollToBottom() {
  act(() => {
    for (const observer of [...observers]) observer.reveal();
  });
}
