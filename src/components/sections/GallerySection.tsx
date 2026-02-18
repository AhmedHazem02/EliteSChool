'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import SectionHeader from '@/components/shared/SectionHeader';
import MasonryGrid from '@/components/shared/MasonryGrid';
import Lightbox from '@/components/shared/Lightbox';
import ScrollReveal from '@/components/shared/ScrollReveal';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { GALLERY_CATEGORIES_DATA } from '@/lib/constants';
import type { GalleryItem } from '@/types';
import Link from 'next/link';

interface GallerySectionProps {
  locale: string;
  items: GalleryItem[];
}

export default function GallerySection({ locale, items }: GallerySectionProps) {
  const t = useTranslations('gallery');
  const [activeCategory, setActiveCategory] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = activeCategory === 'all'
    ? items
    : items.filter((item) => item.category === activeCategory);

  const handleOpen = useCallback((item: GalleryItem, index: number) => {
    setLightboxIndex(index);
  }, []);

  const allCategories = [
    { value: 'all', labelEn: 'All', labelAr: 'الكل' },
    ...GALLERY_CATEGORIES_DATA,
  ];

  return (
    <section className="section-padding bg-off-white" aria-label="Gallery">
      <div className="container mx-auto px-4">
        <SectionHeader title={t('title')} subtitle={t('subtitle')} />

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 justify-center mt-8 mb-10">
          {allCategories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={cn(
                'px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200',
                activeCategory === cat.value
                  ? 'bg-navy text-white shadow-navy'
                  : 'bg-white text-navy/60 hover:text-navy border border-navy/10'
              )}
            >
              {locale === 'ar' ? cat.labelAr : cat.labelEn}
            </button>
          ))}
        </div>

        {/* Grid */}
        <MasonryGrid
          items={filtered.slice(0, 9)}
          locale={locale}
          onItemClick={handleOpen}
          columns={{ default: 1, md: 2, lg: 3 }}
        />

        <div className="text-center mt-10">
          <Link href={`/${locale}/gallery`}>
            <Button variant="outline" size="lg">{t('view_all')}</Button>
          </Link>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          items={filtered}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          locale={locale}
        />
      )}
    </section>
  );
}
