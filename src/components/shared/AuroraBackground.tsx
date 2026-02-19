'use client';

import { cn } from '@/lib/utils';

interface AuroraBackgroundProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'burgundy' | 'navy' | 'gold';
}

/**
 * Animated aurora/gradient mesh background.
 * Creates a luxury animated gradient effect.
 */
export default function AuroraBackground({
  children,
  className,
  variant = 'burgundy',
}: AuroraBackgroundProps) {
  const gradientClasses = {
    burgundy: 'from-burgundy via-burgundy-dark to-burgundy',
    navy: 'from-navy via-navy-dark to-navy',
    gold: 'from-gold-dark via-gold to-gold-light',
  };

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Base gradient */}
      <div className={cn('absolute inset-0 bg-gradient-to-br', gradientClasses[variant])} />

      {/* Aurora blob 1 */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[120px] animate-aurora-1"
        style={{
          background: variant === 'burgundy'
            ? 'radial-gradient(circle, rgba(201,168,76,0.5) 0%, transparent 70%)'
            : variant === 'navy'
            ? 'radial-gradient(circle, rgba(201,168,76,0.3) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(128,24,42,0.5) 0%, transparent 70%)',
          top: '-20%',
          left: '-10%',
        }}
      />

      {/* Aurora blob 2 */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full opacity-15 blur-[100px] animate-aurora-2"
        style={{
          background: variant === 'burgundy'
            ? 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(201,168,76,0.2) 0%, transparent 70%)',
          bottom: '-15%',
          right: '-5%',
        }}
      />

      {/* Aurora blob 3 */}
      <div
        className="absolute w-[400px] h-[400px] rounded-full opacity-10 blur-[80px] animate-aurora-3"
        style={{
          background: 'radial-gradient(circle, rgba(201,168,76,0.4) 0%, transparent 70%)',
          top: '30%',
          left: '40%',
        }}
      />

      {/* Noise texture overlay for depth */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
