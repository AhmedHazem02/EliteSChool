'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type DecorationType = 'islamic-star' | 'geometric-grid' | 'corner-ornament' | 'divider-ornate';

interface GeometricDecorationProps {
  type: DecorationType;
  className?: string;
  color?: string;
  size?: number;
  animated?: boolean;
}

/**
 * Decorative SVG elements — Islamic/geometric patterns for visual depth.
 * Purely decorative, aria-hidden for accessibility.
 */
export default function GeometricDecoration({
  type,
  className,
  color = 'rgba(201, 168, 76, 0.15)',
  size = 120,
  animated = true,
}: GeometricDecorationProps) {
  const Wrapper = animated ? motion.div : 'div';
  const animProps = animated
    ? {
        initial: { opacity: 0, scale: 0.8 },
        whileInView: { opacity: 1, scale: 1 },
        viewport: { once: true },
        transition: { duration: 0.8, ease: 'easeOut' as const },
      }
    : {};

  return (
    <Wrapper
      className={cn('pointer-events-none select-none', className)}
      aria-hidden="true"
      {...animProps}
    >
      {type === 'islamic-star' && <IslamicStar size={size} color={color} />}
      {type === 'geometric-grid' && <GeometricGrid size={size} color={color} />}
      {type === 'corner-ornament' && <CornerOrnament size={size} color={color} />}
      {type === 'divider-ornate' && <OrnateDivider color={color} />}
    </Wrapper>
  );
}

function IslamicStar({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      {/* 8-pointed star (Rub el Hizb style) */}
      <g transform="translate(50,50)">
        <motion.rect
          x="-25" y="-25" width="50" height="50"
          stroke={color} strokeWidth="1" fill="none"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        />
        <motion.rect
          x="-25" y="-25" width="50" height="50"
          stroke={color} strokeWidth="1" fill="none"
          transform="rotate(45)"
          initial={{ rotate: 0 }}
          animate={{ rotate: -360 }}
          transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
        />
        <circle cx="0" cy="0" r="15" stroke={color} strokeWidth="0.5" fill="none" />
        <circle cx="0" cy="0" r="5" stroke={color} strokeWidth="0.5" fill="none" />
        {/* Cross lines */}
        <line x1="0" y1="-35" x2="0" y2="35" stroke={color} strokeWidth="0.3" />
        <line x1="-35" y1="0" x2="35" y2="0" stroke={color} strokeWidth="0.3" />
        <line x1="-25" y1="-25" x2="25" y2="25" stroke={color} strokeWidth="0.3" />
        <line x1="25" y1="-25" x2="-25" y2="25" stroke={color} strokeWidth="0.3" />
      </g>
    </svg>
  );
}

function GeometricGrid({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      {/* Interlocking hexagonal pattern */}
      {[0, 1, 2].map((row) =>
        [0, 1, 2].map((col) => {
          const cx = 20 + col * 40 + (row % 2 === 1 ? 20 : 0);
          const cy = 20 + row * 35;
          return (
            <g key={`${row}-${col}`}>
              <polygon
                points={hexPoints(cx, cy, 18)}
                stroke={color}
                strokeWidth="0.5"
                fill="none"
              />
              <polygon
                points={hexPoints(cx, cy, 10)}
                stroke={color}
                strokeWidth="0.3"
                fill="none"
              />
            </g>
          );
        })
      )}
    </svg>
  );
}

function hexPoints(cx: number, cy: number, r: number) {
  return Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
  }).join(' ');
}

function CornerOrnament({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      {/* Art deco corner bracket */}
      <path
        d="M5 75 L5 25 Q5 5 25 5 L75 5"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M10 70 L10 30 Q10 10 30 10 L70 10"
        stroke={color}
        strokeWidth="0.5"
        fill="none"
      />
      {/* Corner diamond */}
      <rect x="1" y="1" width="8" height="8" transform="rotate(45, 5, 5)" stroke={color} strokeWidth="0.8" fill="none" />
    </svg>
  );
}

function OrnateDivider({ color }: { color: string }) {
  return (
    <svg width="300" height="30" viewBox="0 0 300 30" fill="none" className="w-full max-w-xs">
      {/* Ornate horizontal divider */}
      <line x1="0" y1="15" x2="120" y2="15" stroke={color} strokeWidth="1" />
      <line x1="180" y1="15" x2="300" y2="15" stroke={color} strokeWidth="1" />
      {/* Central diamond */}
      <rect x="142" y="7" width="16" height="16" rx="1" transform="rotate(45, 150, 15)" stroke={color} strokeWidth="1" fill="none" />
      <rect x="146" y="11" width="8" height="8" rx="0.5" transform="rotate(45, 150, 15)" stroke={color} strokeWidth="0.5" fill="none" />
      {/* Side dots */}
      <circle cx="125" cy="15" r="2" fill={color} />
      <circle cx="175" cy="15" r="2" fill={color} />
      <circle cx="132" cy="15" r="1" fill={color} />
      <circle cx="168" cy="15" r="1" fill={color} />
    </svg>
  );
}
