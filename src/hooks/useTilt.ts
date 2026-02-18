'use client';

import { useRef, useCallback } from 'react';
import { isTouchDevice } from '@/lib/utils';

export function useTilt(maxTilt = 15) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    // Disable on touch devices
    if (isTouchDevice() || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    ref.current.style.transform = `perspective(1000px) rotateY(${x * maxTilt}deg) rotateX(${-y * maxTilt}deg) scale(1.02)`;
    ref.current.style.transition = 'transform 0.1s ease';
  }, [maxTilt]);

  const handleMouseLeave = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1)';
    ref.current.style.transition = 'transform 0.4s ease';
  }, []);

  return { ref, handleMouseMove, handleMouseLeave };
}
