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
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: (i % 6) * 0.05 }}
          onClick={() => onItemClick?.(item, i)}
          className="break-inside-avoid mb-4 cursor-pointer overflow-hidden rounded-xl group"
        >
          <div className="relative overflow-hidden">
            <Image
              src={item.media_url}
              alt={locale === 'ar' ? (item.caption_ar ?? '') : (item.caption_en ?? '')}
              width={600}
              height={400}
              className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-navy/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="text-white text-center px-4">
                <p className="text-sm font-medium">
                  {locale === 'ar' ? item.caption_ar : item.caption_en}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
