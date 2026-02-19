'use client';

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedCounterProps {
  end: number;
  suffix?: string;
  className?: string;
  duration?: number;
}

/**
 * Digit-flip slot-machine style counter.
 * Each digit column scrolls independently through 0-9 to reach its target value.
 */
export default function AnimatedCounter({
  end,
  suffix = '',
  className,
  duration = 2000,
}: AnimatedCounterProps) {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Format the number with commas
  const formatted = end.toLocaleString('en-US');

  return (
    <span ref={ref} className={cn('inline-flex items-baseline tabular-nums', className)}>
      {formatted.split('').map((char, i) => {
        const isDigit = /\d/.test(char);
        if (!isDigit) {
          // Comma or period — no animation
          return (
            <span key={`sep-${i}`} className="inline-block">
              {char}
            </span>
          );
        }
        const digit = parseInt(char);
        return (
          <DigitColumn
            key={`digit-${i}`}
            target={digit}
            active={inView}
            delay={i * 80}
            duration={duration}
          />
        );
      })}
      {suffix && <span className="ml-0.5">{suffix}</span>}
    </span>
  );
}

function DigitColumn({
  target,
  active,
  delay,
  duration,
}: {
  target: number;
  active: boolean;
  delay: number;
  duration: number;
}) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (!active) return;

    // Check reduced motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setOffset(target);
      return;
    }

    const timer = setTimeout(() => {
      // Scroll past full 0-9 sets for dramatic effect, then land on target
      setOffset(10 + target);
    }, delay);

    return () => clearTimeout(timer);
  }, [active, target, delay]);

  return (
    <span
      className="inline-block overflow-hidden relative"
      style={{ height: '1.15em', lineHeight: '1.15em' }}
    >
      <span
        className="inline-flex flex-col transition-transform ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          transform: `translateY(-${offset * (100 / 20)}%)`,
          transitionDuration: `${duration}ms`,
          transitionDelay: '0ms',
        }}
      >
        {/* Render 0-9 twice (20 total) so we can scroll through a full set */}
        {Array.from({ length: 20 }, (_, i) => (
          <span key={i} className="inline-block h-[1.15em] leading-[1.15em]">
            {i % 10}
          </span>
        ))}
      </span>
    </span>
  );
}
