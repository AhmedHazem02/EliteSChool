'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SplitTextProps {
  children: string;
  className?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
  type?: 'chars' | 'words';
  animation?: 'fadeUp' | 'fadeIn' | 'slideUp' | 'scaleUp';
  once?: boolean;
}

const animations = {
  fadeUp: {
    hidden: { opacity: 0, y: 30, filter: 'blur(4px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  slideUp: {
    hidden: { opacity: 0, y: '100%' },
    visible: { opacity: 1, y: '0%' },
  },
  scaleUp: {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { opacity: 1, scale: 1 },
  },
};

/**
 * Splits text into characters or words and animates them individually.
 * Creates a premium text reveal effect.
 */
export default function SplitText({
  children,
  className,
  delay = 0,
  stagger = 0.03,
  duration = 0.5,
  type = 'chars',
  animation = 'fadeUp',
  once = true,
}: SplitTextProps) {
  const { hidden, visible } = animations[animation];

  const elements = useMemo(() => {
    if (type === 'words') {
      return children.split(' ').map((word, i) => ({
        key: `word-${i}`,
        text: word,
        isSpace: false,
      }));
    }

    return children.split('').map((char, i) => ({
      key: `char-${i}`,
      text: char,
      isSpace: char === ' ',
    }));
  }, [children, type]);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const childVariants = {
    hidden,
    visible: {
      ...visible,
      transition: {
        duration,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
      },
    },
  };

  return (
    <motion.span
      className={cn('inline-flex flex-wrap', className)}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.5 }}
    >
      {elements.map((el) => (
        <motion.span
          key={el.key}
          variants={childVariants}
          className="inline-block"
          style={el.isSpace ? { width: '0.3em' } : undefined}
        >
          {el.isSpace ? '\u00A0' : el.text}
          {type === 'words' && !el.isSpace ? '\u00A0' : ''}
        </motion.span>
      ))}
    </motion.span>
  );
}
