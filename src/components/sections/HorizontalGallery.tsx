'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import type { GalleryItem } from '@/types';
import { Camera } from 'lucide-react';

interface HorizontalGalleryProps {
  locale: string;
  items: GalleryItem[];
  title: string;
  subtitle: string;
}

export default function HorizontalGallery({ locale, items, title, subtitle }: HorizontalGalleryProps) {
  const displayItems = items.slice(0, 6);
  if (displayItems.length < 3) return null;

  return (
    <section className="section-padding bg-white relative overflow-hidden" aria-label="Gallery Showcase">
      {/* Decorative background blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-gold/4 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-navy/4 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">

        {/* ── Header ── */}
        <div className="text-center mb-14">
          {/* Eyebrow */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/30 bg-gold/5 mb-5"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Camera size={12} className="text-gold" />
            <span className="text-gold text-[11px] uppercase tracking-[0.25em] font-semibold">{subtitle}</span>
          </motion.div>

          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy font-playfair mb-4"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            {title}
          </motion.h2>

          {/* Decorative divider */}
          <motion.div
            className="flex items-center justify-center gap-3"
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="w-20 h-px bg-gradient-to-r from-transparent to-gold" />
            <div className="w-2 h-2 rotate-45 bg-gold" />
            <div className="w-20 h-px bg-gradient-to-l from-transparent to-gold" />
          </motion.div>
        </div>

        {/* ── Cards Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayItems.map((item, i) => {
            const caption = locale === 'ar' ? item.caption_ar : item.caption_en;
            const category = item.category;

            return (
              <motion.article
                key={item.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-luxury transition-all duration-500 border border-navy/5 hover:border-gold/20"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ delay: i * 0.08, duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
                whileHover={{ y: -4 }}
              >
                {/* ── Image ── */}
                <div className="relative aspect-[4/3] overflow-hidden bg-navy/5">
                  <Image
                    src={item.media_url}
                    alt={caption || `Gallery image ${i + 1}`}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />

                  {/* Subtle top vignette */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-transparent" />

                  {/* Category badge */}
                  {category && (
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-navy text-[10px] uppercase tracking-widest font-semibold shadow-sm border border-white/50 group-hover:bg-gold group-hover:text-white group-hover:border-gold transition-all duration-400">
                        {category}
                      </span>
                    </div>
                  )}

                  {/* Index counter */}
                  <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center border border-white/50 shadow-sm">
                    <span className="text-navy/60 text-[11px] font-bold tabular-nums leading-none">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Gold shimmer on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gold/0 via-transparent to-transparent group-hover:from-gold/10 transition-all duration-500" />
                </div>

                {/* ── Info ── */}
                <div className="p-4">
                  {/* Gold accent bar */}
                  <div className="w-8 h-0.5 bg-gold mb-3 group-hover:w-14 transition-all duration-400 rounded-full" />

                  {caption ? (
                    <p className="text-navy/70 text-sm leading-relaxed group-hover:text-navy transition-colors duration-300 line-clamp-2">
                      {caption}
                    </p>
                  ) : (
                    <p className="text-navy/30 text-sm italic">
                      {locale === 'ar' ? 'بدون وصف' : 'No caption'}
                    </p>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
