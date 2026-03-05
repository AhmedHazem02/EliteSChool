'use client';

import { useState, useEffect, useRef } from 'react';

export function useInView(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  // Memoize primitive option values to avoid re-creating the observer every render
  const threshold = options?.threshold;
  const rootMargin = options?.rootMargin;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          // Stop observing after first intersection (once: true behavior)
          observer.unobserve(el);
        }
      },
      {
        threshold: (threshold as number | number[]) ?? 0.1,
        rootMargin: rootMargin ?? undefined,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return { ref, inView };
}
