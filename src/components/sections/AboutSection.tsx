'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import SectionHeader from '@/components/shared/SectionHeader';
import ScrollReveal from '@/components/shared/ScrollReveal';
import ImageReveal from '@/components/shared/ImageReveal';
import MagneticButton from '@/components/shared/MagneticButton';
import GeometricDecoration from '@/components/shared/GeometricDecoration';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

const highlights = [
  { en: 'Founded in 1999 with a legacy of academic excellence', ar: 'تأسست عام 1999 بإرث من التميز الأكاديمي' },
  { en: 'Multiple international curricula in one campus', ar: 'مناهج دولية متعددة في حرم واحد' },
  { en: 'State-of-the-art facilities and modern classrooms', ar: 'مرافق حديثة وفصول دراسية متطورة' },
  { en: 'Holistic development: academic, social & emotional', ar: 'تنمية شاملة: أكاديمية واجتماعية وعاطفية' },
];

interface AboutSectionProps {
  locale: string;
  imageUrl?: string | null;
}

export default function AboutSection({ locale, imageUrl }: AboutSectionProps) {
  const t = useTranslations('about');
  const isRTL = locale === 'ar';

  return (
    <section className="section-padding bg-white relative overflow-hidden" aria-label="About">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 pattern-lines pointer-events-none" />

      {/* Geometric decorations */}
      <GeometricDecoration type="geometric-grid" className="absolute top-12 right-12 opacity-20 hidden xl:block" size={100} />
      <GeometricDecoration type="corner-ornament" className="absolute bottom-8 left-8 opacity-20 hidden xl:block rotate-180" size={70} />

      <div className="container mx-auto px-4 relative z-10">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center ${isRTL ? 'lg:flex-row-reverse' : ''}`}>
          {/* Image with cinematic reveal */}
          <ScrollReveal direction={isRTL ? 'right' : 'left'}>
            <div className="relative">
              <ImageReveal direction={isRTL ? 'right' : 'left'} delay={0.2}>
                <div className="relative z-10 rounded-3xl overflow-hidden shadow-luxury aspect-[4/3]">
                  <Image
                    src={imageUrl || '/about-school.jpg'}
                    alt="Elite Schools Campus"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  {/* Subtle overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
                </div>
              </ImageReveal>

              {/* Gold accent box — animated */}
              <motion.div
                className="absolute -bottom-6 -right-6 w-40 h-40 bg-gold/10 rounded-3xl -z-10 border border-gold/20"
                animate={{ rotate: [0, 2, -2, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                className="absolute -top-4 -left-4 w-24 h-24 bg-navy/5 rounded-2xl -z-10"
                animate={{ rotate: [0, -3, 3, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
              />

              {/* Year badge — enhanced with glow */}
              <motion.div
                className="absolute top-6 left-6 bg-gradient-to-br from-gold to-gold-dark text-white rounded-2xl px-4 py-2 text-center shadow-gold icon-glow z-20"
                whileHover={{ scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <p className="text-2xl font-bold font-playfair">1999</p>
                <p className="text-xs uppercase tracking-wider">Est.</p>
              </motion.div>

              {/* Decorative corner ornament */}
              <div className="absolute -bottom-3 -left-3 w-8 h-8 border-l-2 border-b-2 border-gold/30 rounded-bl-lg z-0" />
              <div className="absolute -top-3 -right-3 w-8 h-8 border-r-2 border-t-2 border-gold/30 rounded-tr-lg z-0" />
            </div>
          </ScrollReveal>

          {/* Text */}
          <ScrollReveal direction={isRTL ? 'left' : 'right'}>
            <div>
              <SectionHeader
                title={t('title')}
                subtitle={t('subtitle')}
                centered={false}
              />

              <p className="text-navy/70 leading-relaxed mb-6">{t('description')}</p>

              <ul className="space-y-4 mb-8">
                {highlights.map((item, i) => (
                  <motion.li
                    key={i}
                    className="flex items-start gap-3 group"
                    initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                  >
                    <div className="w-6 h-6 rounded-full bg-gold/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-gold/20 transition-colors duration-300">
                      <CheckCircle className="text-gold" size={14} />
                    </div>
                    <span className="text-navy/70 text-sm group-hover:text-navy transition-colors duration-300">
                      {locale === 'ar' ? item.ar : item.en}
                    </span>
                  </motion.li>
                ))}
              </ul>

              <MagneticButton strength={0.2}>
                <Link href={`/${locale}/about`}>
                  <Button variant="default" size="lg" className="btn-ripple hover:shadow-navy transition-shadow duration-300">
                    {t('cta')}
                  </Button>
                </Link>
              </MagneticButton>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
