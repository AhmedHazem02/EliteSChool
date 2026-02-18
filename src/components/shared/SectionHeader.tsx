'use client';

import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
  className?: string;
}

export default function SectionHeader({
  title,
  subtitle,
  centered = true,
  light = false,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn('mb-10 md:mb-14', centered && 'text-center', className)}>
      {subtitle && (
        <p className={cn(
          'text-sm font-semibold uppercase tracking-widest mb-2',
          light ? 'text-gold-light' : 'text-gold'
        )}>
          {subtitle}
        </p>
      )}
      <h2 className={cn(
        'font-playfair text-2xl sm:text-3xl md:text-4xl font-bold leading-tight',
        light ? 'text-white' : 'text-navy'
      )}>
        {title}
      </h2>
      {/* Gold underline */}
      <div className={cn(
        'gold-divider mt-4',
        centered && 'mx-auto'
      )} />
    </div>
  );
}
