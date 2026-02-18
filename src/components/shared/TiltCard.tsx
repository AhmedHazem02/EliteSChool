'use client';

import { useTilt } from '@/hooks/useTilt';
import { cn } from '@/lib/utils';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
}

export default function TiltCard({ children, className, maxTilt = 12 }: TiltCardProps) {
  const { ref, handleMouseMove, handleMouseLeave } = useTilt(maxTilt);

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn('will-change-transform', className)}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </div>
  );
}
