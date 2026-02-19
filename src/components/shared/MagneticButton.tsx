'use client';

import { useRef, useState, useCallback } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  as?: 'button' | 'div' | 'a';
  onClick?: () => void;
  href?: string;
}

/**
 * Magnetic button that subtly follows the cursor when hovered.
 * Creates a premium, interactive feel.
 */
export default function MagneticButton({
  children,
  className = '',
  strength = 0.3,
  as: Component = 'div',
  onClick,
  href,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const x = useSpring(0, { stiffness: 200, damping: 20 });
  const y = useSpring(0, { stiffness: 200, damping: 20 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      x.set((e.clientX - centerX) * strength);
      y.set((e.clientY - centerY) * strength);
    },
    [strength, x, y]
  );

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
    setHovered(false);
  }, [x, y]);

  const handleMouseEnter = useCallback(() => {
    setHovered(true);
  }, []);

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onClick={onClick}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}
