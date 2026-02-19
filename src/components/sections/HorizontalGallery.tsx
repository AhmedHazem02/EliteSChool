'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import SectionHeader from '@/components/shared/SectionHeader';
import type { GalleryItem } from '@/types';

interface HorizontalGalleryProps {
  locale: string;
  items: GalleryItem[];
  title: string;
  subtitle: string;
}

/**
 * Horizontal scroll section — scrolls horizontally while user scrolls vertically.
 * Creates a cinema-reel showcase effect for gallery items.
 */
export default function HorizontalGallery({
  locale,
  items,
  title,
  subtitle,
}: HorizontalGalleryProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const displayItems = items.slice(0, 8);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // Translate the inner track from 0% to -(totalWidth - viewport)
  const x = useTransform(scrollYProgress, [0, 1], ['2%', '-75%']);

  if (displayItems.length < 3) return null;

  return (
    <section
      ref={sectionRef}
      className="relative bg-navy"
      // Height determines how long the pin lasts — more items = taller
      style={{ height: `${Math.max(200, displayItems.length * 50)}vh` }}
      data-scroll-container
    >
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen flex flex-col overflow-hidden">
        {/* Header */}
        <div className="pt-16 pb-8 px-6 text-center">
          <motion.p
            className="text-gold uppercase tracking-[0.3em] text-xs font-semibold mb-3"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {subtitle}
          </motion.p>
          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white font-playfair"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            {title}
          </motion.h2>
          <div className="gold-divider-animated mx-auto mt-4" />
        </div>

        {/* Horizontal track */}
        <div className="flex-1 flex items-center">
          <motion.div
            className="flex gap-6 px-8"
            style={{ x }}
          >
            {displayItems.map((item, i) => (
              <div
                key={item.id}
                className="relative flex-shrink-0 w-[70vw] md:w-[45vw] lg:w-[30vw] aspect-[3/4] rounded-2xl overflow-hidden group"
              >
                <Image
                  src={item.media_url}
                  alt={(locale === 'ar' ? item.caption_ar : item.caption_en) || ''}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 70vw, (max-width: 1024px) 45vw, 30vw"
                />
                {/* Cinematic overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                {/* Gold corners on hover */}
                <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-gold/0 group-hover:border-gold/60 transition-all duration-500 rounded-tl-sm" />
                <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-gold/0 group-hover:border-gold/60 transition-all duration-500 rounded-tr-sm" />
                <div className="absolute bottom-14 left-3 w-8 h-8 border-b-2 border-l-2 border-gold/0 group-hover:border-gold/60 transition-all duration-500 rounded-bl-sm" />
                <div className="absolute bottom-14 right-3 w-8 h-8 border-b-2 border-r-2 border-gold/0 group-hover:border-gold/60 transition-all duration-500 rounded-br-sm" />

                {/* Caption */}
                <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="w-8 h-0.5 bg-gold mb-2 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 delay-100" />
                  <p className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-150">
                    {locale === 'ar' ? item.caption_ar : item.caption_en}
                  </p>
                </div>

                {/* Index number */}
                <div className="absolute top-4 right-4 text-gold/30 text-6xl font-playfair font-bold select-none pointer-events-none">
                  {String(i + 1).padStart(2, '0')}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll progress indicator */}
        <div className="pb-8 px-8">
          <div className="max-w-xs mx-auto h-[2px] bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-gold-dark via-gold to-gold-light rounded-full"
              style={{ scaleX: scrollYProgress, transformOrigin: 'left' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
