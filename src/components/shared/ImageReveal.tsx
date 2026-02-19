'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ImageRevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'left' | 'right' | 'top' | 'bottom';
  delay?: number;
  duration?: number;
}

const clipPathMap = {
  left: {
    hidden: 'inset(0 100% 0 0)',
    visible: 'inset(0 0% 0 0)',
  },
  right: {
    hidden: 'inset(0 0 0 100%)',
    visible: 'inset(0 0 0 0%)',
  },
  top: {
    hidden: 'inset(0 0 100% 0)',
    visible: 'inset(0 0 0% 0)',
  },
  bottom: {
    hidden: 'inset(100% 0 0 0)',
    visible: 'inset(0% 0 0 0)',
  },
};

/**
 * Reveals children with a cinematic clip-path curtain effect.
 * Creates a premium image entrance.
 */
export default function ImageReveal({
  children,
  className,
  direction = 'left',
  delay = 0,
  duration = 0.8,
}: ImageRevealProps) {
  const clip = clipPathMap[direction];

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Reveal overlay (gold accent bar that sweeps across) */}
      <motion.div
        className="absolute inset-0 z-20 bg-gradient-to-r from-gold/80 to-gold-light/80"
        initial={{ clipPath: clip.visible }}
        whileInView={{ clipPath: clip.hidden }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{
          duration: duration * 0.6,
          delay: delay + duration * 0.5,
          ease: [0.77, 0, 0.175, 1], // Custom ease
        }}
      />

      {/* Content reveal */}
      <motion.div
        initial={{
          clipPath: clip.hidden,
          scale: 1.15,
        }}
        whileInView={{
          clipPath: clip.visible,
          scale: 1,
        }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{
          clipPath: {
            duration,
            delay,
            ease: [0.77, 0, 0.175, 1],
          },
          scale: {
            duration: duration * 1.5,
            delay,
            ease: [0.25, 0.46, 0.45, 0.94],
          },
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
