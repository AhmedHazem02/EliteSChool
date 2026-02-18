'use client';

import { useRef } from 'react';

const RATE_LIMIT = 3;
const RATE_WINDOW = 10 * 60 * 1000; // 10 minutes

export function useRateLimit() {
  const attempts = useRef<number[]>([]);

  const canSubmit = (): boolean => {
    const now = Date.now();
    // Remove old attempts outside the window
    attempts.current = attempts.current.filter((t) => now - t < RATE_WINDOW);

    if (attempts.current.length >= RATE_LIMIT) {
      return false;
    }

    attempts.current.push(now);
    return true;
  };

  const remainingAttempts = (): number => {
    const now = Date.now();
    const recent = attempts.current.filter((t) => now - t < RATE_WINDOW);
    return Math.max(0, RATE_LIMIT - recent.length);
  };

  const resetAttempts = () => {
    attempts.current = [];
  };

  return { canSubmit, remainingAttempts, resetAttempts };
}
