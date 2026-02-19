'use client';

import { cn } from '@/lib/utils';

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'gold' | 'burgundy' | 'navy';
}

/**
 * Card with animated gradient border glow on hover.
 * Creates a premium glassmorphism + glow effect.
 */
export default function GlowCard({
  children,
  className,
  glowColor = 'gold',
}: GlowCardProps) {
  const glowColorMap = {
    gold: 'from-gold/60 via-gold-light/40 to-gold/60',
    burgundy: 'from-burgundy/60 via-burgundy-light/40 to-burgundy/60',
    navy: 'from-navy/60 via-navy-light/40 to-navy/60',
  };

  return (
    <div className={cn('group relative rounded-2xl', className)}>
      {/* Animated gradient border (visible on hover) */}
      <div
        className={cn(
          'absolute -inset-[1px] rounded-2xl bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[1px]',
          glowColorMap[glowColor]
        )}
      />

      {/* Glow shadow (visible on hover) */}
      <div
        className={cn(
          'absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-xl',
          glowColor === 'gold' ? 'bg-gold' : glowColor === 'burgundy' ? 'bg-burgundy' : 'bg-navy'
        )}
      />

      {/* Card content */}
      <div className="relative rounded-2xl bg-white overflow-hidden">
        {children}
      </div>
    </div>
  );
}
