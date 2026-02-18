'use client';

import { useState, useCallback } from 'react';
import MasonryGrid from '@/components/shared/MasonryGrid';
import Lightbox from '@/components/shared/Lightbox';
import { GALLERY_CATEGORIES_DATA } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { GalleryItem } from '@/types';

interface GalleryClientFilterProps {
  items: GalleryItem[];
  locale: string;
}

export default function GalleryClientFilter({ items, locale }: GalleryClientFilterProps) {
  const [category, setCategory] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = category === 'all' ? items : items.filter(i => i.category === category);
  const isAR = locale === 'ar';

  const allCats = [
    { value: 'all', labelEn: 'All', labelAr: 'الكل' },
    ...GALLERY_CATEGORIES_DATA,
  ];

  const handleOpen = useCallback((_item: GalleryItem, index: number) => {
    setLightboxIndex(index);
  }, []);

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-2 justify-center mb-10">
        {allCats.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setCategory(cat.value)}
            className={cn(
              'px-4 py-1.5 rounded-full text-sm font-medium transition-all',
              category === cat.value ? 'bg-navy text-white' : 'bg-white text-navy/60 hover:text-navy border border-navy/10'
            )}
          >
            {isAR ? cat.labelAr : cat.labelEn}
          </button>
        ))}
      </div>

      <MasonryGrid
        items={filtered}
        locale={locale}
        onItemClick={handleOpen}
        columns={{ default: 1, md: 2, lg: 3 }}
      />

      {lightboxIndex !== null && (
        <Lightbox
          items={filtered}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          locale={locale}
        />
      )}
    </div>
  );
}
