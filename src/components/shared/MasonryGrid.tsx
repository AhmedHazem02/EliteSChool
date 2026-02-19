'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { GalleryItem } from '@/types';

interface MasonryGridProps {
  items: GalleryItem[];
  locale: string;
  onItemClick?: (item: GalleryItem, index: number) => void;
  columns?: { default: number; md: number; lg: number };
}

export default function MasonryGrid({
  items,
  locale,
  onItemClick,
  columns = { default: 1, md: 2, lg: 3 },
}: MasonryGridProps) {
  return (
    <div
      className={cn(
        'gap-4',
        `columns-${columns.default}`,
        `md:columns-${columns.md}`,
        `lg:columns-${columns.lg}`,
        '[column-gap:1rem]'
      )}
    >
      {items.map((item, i) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: (i % 6) * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
          onClick={() => onItemClick?.(item, i)}
          className="break-inside-avoid mb-4 cursor-pointer overflow-hidden rounded-xl group"
        >
          <div className="relative overflow-hidden rounded-xl">
            <Image
              src={item.media_url}
              alt={locale === 'ar' ? (item.caption_ar ?? '') : (item.caption_en ?? '')}
              width={600}
              height={400}
              className="w-full h-auto object-cover transition-all duration-700 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            {/* Cinematic overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center pb-6">
              <div className="text-white text-center px-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <div className="w-8 h-px bg-gold mx-auto mb-2" />
                <p className="text-sm font-medium">
                  {locale === 'ar' ? item.caption_ar : item.caption_en}
                </p>
              </div>
            </div>
            {/* Gold corner accents on hover */}
            <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-gold/0 group-hover:border-gold/60 transition-all duration-500" />
            <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-gold/0 group-hover:border-gold/60 transition-all duration-500" />
            <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-gold/0 group-hover:border-gold/60 transition-all duration-500" />
            <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-gold/0 group-hover:border-gold/60 transition-all duration-500" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
