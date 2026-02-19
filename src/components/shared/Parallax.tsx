'use client';

import { useScroll, useTransform, motion } from 'framer-motion';
import { useRef } from 'react';
import { cn } from '@/lib/utils';

interface ParallaxProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
  direction?: 'up' | 'down';
}

/**
 * Parallax wrapper that moves children at a different scroll speed.
 * speed > 0 = moves slower than scroll (background feel)
 * speed < 0 = moves faster than scroll
 */
export default function Parallax({
  children,
  speed = 0.3,
  className,
  direction = 'up',
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const multiplier = direction === 'up' ? -1 : 1;
  const y = useTransform(scrollYProgress, [0, 1], [100 * speed * multiplier, -100 * speed * multiplier]);

  return (
    <div ref={ref} className={cn('overflow-hidden', className)}>
      <motion.div style={{ y }}>
        {children}
      </motion.div>
    </div>
  );
}
