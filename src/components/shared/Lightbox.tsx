'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { GalleryItem } from '@/types';

interface LightboxProps {
  items: GalleryItem[];
  initialIndex: number;
  onClose: () => void;
  locale: string;
}

export default function Lightbox({ items, initialIndex, onClose, locale }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const current = items[currentIndex];

  const prev = useCallback(() => {
    setCurrentIndex((i) => (i > 0 ? i - 1 : items.length - 1));
  }, [items.length]);

  const next = useCallback(() => {
    setCurrentIndex((i) => (i < items.length - 1 ? i + 1 : 0));
  }, [items.length]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose, prev, next]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[80] bg-black/95 flex items-center justify-center"
        onClick={onClose}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 end-4 w-11 h-11 flex items-center justify-center text-white hover:text-gold transition-colors z-10"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Prev */}
        {items.length > 1 && (
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute start-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center text-white hover:text-gold transition-colors z-10"
            aria-label="Previous"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>
        )}

        {/* Image */}
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="relative max-w-5xl max-h-[80vh] w-full mx-16"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative w-full h-full max-h-[75vh] flex items-center justify-center">
            <Image
              src={current.media_url}
              alt={locale === 'ar' ? (current.caption_ar ?? '') : (current.caption_en ?? '')}
              width={1200}
              height={800}
              className="object-contain max-h-[75vh] rounded-lg"
            />
          </div>
          {(current.caption_en || current.caption_ar) && (
            <p className="text-center text-white/70 text-sm mt-3">
              {locale === 'ar' ? current.caption_ar : current.caption_en}
            </p>
          )}
        </motion.div>

        {/* Next */}
        {items.length > 1 && (
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute end-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center text-white hover:text-gold transition-colors z-10"
            aria-label="Next"
          >
            <ChevronRight className="w-7 h-7" />
          </button>
        )}

        {/* Counter */}
        {items.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-sm">
            {currentIndex + 1} / {items.length}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
