'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { GalleryItem } from '@/types';

interface SwipeGalleryProps {
  items: GalleryItem[];
  locale: string;
  onItemClick?: (item: GalleryItem, index: number) => void;
}

export default function SwipeGallery({ items, locale, onItemClick }: SwipeGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('left');
  const startXRef = useRef<number | null>(null);
  const isDragging = useRef(false);

  const prev = useCallback(() => {
    setDirection('right');
    setActiveIndex((i) => (i - 1 + items.length) % items.length);
  }, [items.length]);

  const next = useCallback(() => {
    setDirection('left');
    setActiveIndex((i) => (i + 1) % items.length);
  }, [items.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
    isDragging.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startXRef.current !== null) {
      const diff = Math.abs(e.touches[0].clientX - startXRef.current);
      if (diff > 5) isDragging.current = true;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (startXRef.current === null) return;
    const diff = startXRef.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0
        ? (locale === 'ar' ? prev() : next())
        : (locale === 'ar' ? next() : prev());
    }
    startXRef.current = null;
  };

  const variants = {
    enter: (dir: 'left' | 'right') => ({
      x: dir === 'left' ? 300 : -300,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (dir: 'left' | 'right') => ({
      x: dir === 'left' ? -300 : 300,
      opacity: 0,
    }),
  };

  const item = items[activeIndex];

  return (
    <div className="relative overflow-hidden rounded-2xl select-none">
      {/* Main image */}
      <div
        className="relative aspect-video"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={() => {
          if (!isDragging.current) onItemClick?.(item, activeIndex);
        }}
      >
        <AnimatePresence custom={direction} mode="popLayout">
          <motion.div
            key={activeIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            <Image
              src={item.media_url}
              alt={locale === 'ar' ? (item.caption_ar ?? '') : (item.caption_en ?? '')}
              fill
              className="object-cover"
              sizes="100vw"
            />
          </motion.div>
        </AnimatePresence>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy/70 to-transparent pointer-events-none" />

        {/* Caption */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="text-white text-sm font-medium">
            {locale === 'ar' ? item.caption_ar : item.caption_en}
          </p>
          <p className="text-white/60 text-xs mt-1">
            {activeIndex + 1} / {items.length}
          </p>
        </div>
      </div>

      {/* Arrows (visible on non-touch) */}
      <button
        onClick={locale === 'ar' ? next : prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 hidden sm:flex items-center justify-center w-9 h-9 rounded-full bg-white/20 backdrop-blur text-white hover:bg-white/40 transition z-10"
        aria-label="Previous"
      >
        ‹
      </button>
      <button
        onClick={locale === 'ar' ? prev : next}
        className="absolute right-2 top-1/2 -translate-y-1/2 hidden sm:flex items-center justify-center w-9 h-9 rounded-full bg-white/20 backdrop-blur text-white hover:bg-white/40 transition z-10"
        aria-label="Next"
      >
        ›
      </button>

      {/* Dots */}
      <div className="flex justify-center gap-1.5 mt-3">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setDirection(i > activeIndex ? 'left' : 'right');
              setActiveIndex(i);
            }}
            className={cn(
              'w-2 h-2 rounded-full transition-all duration-300',
              i === activeIndex ? 'bg-gold w-4' : 'bg-navy/30'
            )}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
