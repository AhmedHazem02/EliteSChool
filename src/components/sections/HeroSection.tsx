'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

interface HeroSectionProps {
  locale: string;
}

export default function HeroSection({ locale }: HeroSectionProps) {
  const t = useTranslations('hero');
  const isRTL = locale === 'ar';

  // Split title for gold gradient on last word
  const title = t('title');
  const words = title.trim().split(' ');
  const lastWord = words.pop();
  const restOfTitle = words.join(' ');

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-label="Hero"
    >
      {/* Background: real image + strong overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center bg-no-repeat" />
        {/* Strong overlay 85% so text is always readable */}
        <div className="absolute inset-0 bg-navy/85" />
        {/* Bottom fade for smooth section transition */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-navy to-transparent" />
      </div>

      {/* Decorative gold orb */}
      <div
        className="absolute top-1/3 right-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none hidden lg:block"
        aria-hidden
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white pt-24 md:pt-28 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-4xl mx-auto"
        >
          {/* Gold eyebrow line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-16 h-0.5 bg-gold mx-auto mb-6"
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gold uppercase tracking-[0.2em] text-sm font-semibold mb-4"
          >
            {t('eyebrow')}
          </motion.p>

          {/* H1: white + last word gold gradient */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className={`text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6 text-white ${isRTL ? 'font-tajawal' : 'font-playfair'}`}
          >
            {restOfTitle}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-light to-gold">
              {lastWord}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            {t('subtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href={`/${locale}/admissions`}>
              <Button
                variant="shimmer"
                size="xl"
                className="w-full sm:w-auto min-w-[200px] bg-gradient-to-r from-burgundy to-burgundy/80 hover:from-burgundy/90 hover:to-burgundy shadow-lg shadow-burgundy/30 border-none"
              >
                {t('cta_apply')}
              </Button>
            </Link>
            <Link href={`/${locale}/programs`}>
              <Button
                variant="outline"
                size="xl"
                className="w-full sm:w-auto min-w-[200px] border-2 border-white/50 text-white hover:bg-white hover:text-navy backdrop-blur-sm"
              >
                {t('cta_programs')}
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator — pinned outside content flow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronDown className="text-gold/70" size={28} />
        </motion.div>
      </motion.div>
    </section>
  );
}
