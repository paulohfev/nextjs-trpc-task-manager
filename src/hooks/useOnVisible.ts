import { useEffect, useRef } from "react";

// Calls `onVisible` whenever the returned ref's element is in view. Changing
// `resetKey` re-checks visibility, e.g. when content above the element changes
// but the element never left the viewport.
export function useOnVisible<T extends Element>(
  onVisible: () => void,
  resetKey?: unknown,
) {
  const ref = useRef<T>(null);
  const callbackRef = useRef(onVisible);
  callbackRef.current = onVisible;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) callbackRef.current();
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [resetKey]);

  return ref;
}
