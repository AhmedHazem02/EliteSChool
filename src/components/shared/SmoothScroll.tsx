'use client';

import { createContext, useContext, useEffect, useRef, useCallback } from 'react';

// ─── Context ─────────────────────────────────────────────────────────────────
interface SmoothScrollAPI {
  /** Smoothly scroll to a Y position */
  scrollTo: (y: number) => void;
}

const SmoothScrollContext = createContext<SmoothScrollAPI | null>(null);

/** Hook to access smooth-scroll programmatic API (returns null on touch). */
export function useSmoothScroll() {
  return useContext(SmoothScrollContext);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Normalize deltaY across deltaMode (pixel / line / page). */
function normalizeDelta(e: WheelEvent): number {
  let d = e.deltaY;
  if (e.deltaMode === 1) d *= 40;              // DOM_DELTA_LINE → px
  if (e.deltaMode === 2) d *= window.innerHeight; // DOM_DELTA_PAGE → px
  return d;
}

function maxScroll() {
  return document.documentElement.scrollHeight - window.innerHeight;
}

// ─── Component ───────────────────────────────────────────────────────────────
const EASE = 0.08;   // Lower = smoother/slower catch-up
const THRESHOLD = 0.5; // px – stop animating when within this range

/**
 * Premium smooth-scroll provider with inertia/momentum.
 * Custom implementation — no external dependency.
 *
 * • Intercepts wheel events (passive:false + preventDefault) so native scroll
 *   never fires — eliminates double-scroll jitter.
 * • Exposes a React context so other components (BackToTop, anchor links) can
 *   trigger smooth scroll without conflicting.
 * • Stops the RAF loop when idle to save CPU/battery.
 * • Falls back to native smooth scroll on touch devices.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const rafId = useRef(0);
  const current = useRef(0);
  const target = useRef(0);
  const running = useRef(false);

  /* ── animation loop (starts on-demand, auto-stops when settled) ── */
  const tick = useCallback(() => {
    current.current = lerp(current.current, target.current, EASE);

    if (Math.abs(current.current - target.current) > THRESHOLD) {
      window.scrollTo(0, current.current);
      rafId.current = requestAnimationFrame(tick);
    } else {
      // Snap & stop
      current.current = target.current;
      window.scrollTo(0, current.current);
      running.current = false;
    }
  }, []);

  const startLoop = useCallback(() => {
    if (!running.current) {
      running.current = true;
      rafId.current = requestAnimationFrame(tick);
    }
  }, [tick]);

  const clamp = useCallback(() => {
    target.current = Math.max(0, Math.min(target.current, maxScroll()));
  }, []);

  /* ── public API exposed via context ── */
  const scrollTo = useCallback(
    (y: number) => {
      target.current = Math.max(0, Math.min(y, maxScroll()));
      startLoop();
    },
    [startLoop],
  );

  /* ── attach / detach listeners ── */
  useEffect(() => {
    const isTouch =
      'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (isTouch) return; // native scroll is fine on touch

    current.current = window.scrollY;
    target.current = window.scrollY;

    const handleWheel = (e: WheelEvent) => {
      // Don't intercept inside opt-out containers (e.g. horizontal gallery)
      const el = e.target as HTMLElement;
      if (el.closest('[data-scroll-container]')) return;

      e.preventDefault(); // prevent native scroll — we handle it
      target.current += normalizeDelta(e);
      clamp();
      startLoop();
    };

    /**
     * Sync on scroll events NOT caused by our loop (keyboard nav,
     * scrollbar drag, anchor links, programmatic scrollTo from 3rd-party).
     * When the loop is idle, any scroll event must be external.
     */
    const handleScroll = () => {
      if (!running.current) {
        current.current = window.scrollY;
        target.current = window.scrollY;
      }
    };

    const handleResize = () => clamp();

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(rafId.current);
    };
  }, [tick, clamp, startLoop]);

  return (
    <SmoothScrollContext.Provider value={{ scrollTo }}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
