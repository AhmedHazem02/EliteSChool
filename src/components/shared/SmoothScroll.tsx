'use client';

import { createContext, useContext, useCallback } from 'react';

// ─── Context ─────────────────────────────────────────────────────────────────
interface SmoothScrollAPI {
  /** Smoothly scroll to a Y position */
  scrollTo: (y: number) => void;
}

const SmoothScrollContext = createContext<SmoothScrollAPI | null>(null);

/** Hook to access smooth-scroll programmatic API. */
export function useSmoothScroll() {
  return useContext(SmoothScrollContext);
}

/**
 * Lightweight smooth-scroll context provider.
 * Uses the browser's native CSS scroll-behavior for smooth scrolling,
 * which runs off the main thread and doesn't block INP.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const scrollTo = useCallback((y: number) => {
    window.scrollTo({ top: y, behavior: 'smooth' });
  }, []);

  return (
    <SmoothScrollContext.Provider value={{ scrollTo }}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
