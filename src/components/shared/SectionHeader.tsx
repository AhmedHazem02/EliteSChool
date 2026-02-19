'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

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
        <motion.p
          className={cn(
            'text-sm font-semibold uppercase tracking-[0.2em] mb-3',
            light ? 'text-gold-light' : 'text-gold'
          )}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {subtitle}
        </motion.p>
      )}
      <motion.h2
        className={cn(
          'font-playfair text-2xl sm:text-3xl md:text-4xl font-bold leading-tight',
          light ? 'text-white' : 'text-navy'
        )}
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        {title}
      </motion.h2>
      {/* Animated gold divider */}
      <motion.div
        className={cn(
          'gold-divider-animated mt-5',
          centered && 'mx-auto'
        )}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.77, 0, 0.175, 1] }}
      />
    </div>
  );
}
