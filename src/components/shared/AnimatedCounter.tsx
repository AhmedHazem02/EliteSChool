'use client';

import { useRef } from 'react';
import { useCountUp } from '@/hooks/useCountUp';
import { cn } from '@/lib/utils';

interface AnimatedCounterProps {
  end: number;
  suffix?: string;
  className?: string;
  duration?: number;
}

export default function AnimatedCounter({
  end,
  suffix = '',
  className,
  duration = 2000,
}: AnimatedCounterProps) {
  const { count, ref } = useCountUp(end, duration);

  return (
    <span ref={ref as React.RefObject<HTMLSpanElement>} className={cn('tabular-nums', className)}>
      {count.toLocaleString('en-US')}{suffix}
    </span>
  );
}
