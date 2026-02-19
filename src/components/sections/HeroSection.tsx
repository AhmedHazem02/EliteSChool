'use client';

import { useTranslations } from 'next-intl';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import FloatingParticles from '@/components/shared/FloatingParticles';
import MagneticButton from '@/components/shared/MagneticButton';
import SplitText from '@/components/shared/SplitText';

interface HeroSectionProps {
  locale: string;
  videoUrl?: string | null;
  heroImageUrl?: string | null;
}

export default function HeroSection({ locale, videoUrl, heroImageUrl }: HeroSectionProps) {
  const t = useTranslations('hero');
  const isRTL = locale === 'ar';
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  // Parallax effects
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.5], [0, -80]);

  // Split title for gold gradient on last word
  const title = t('title');
  const words = title.trim().split(' ');
  const lastWord = words.pop();
  const restOfTitle = words.join(' ');

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-label="Hero"
    >
      {/* Background: Video or Image with parallax */}
      <motion.div className="absolute inset-0 z-0" style={{ y: bgY }}>
        {videoUrl ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            poster={heroImageUrl || '/hero-bg.jpg'}
            className="absolute inset-0 w-full h-full object-cover scale-110"
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        ) : heroImageUrl ? (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110"
            style={{ backgroundImage: `url('${heroImageUrl}')` }}
          />
        ) : (
          <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center bg-no-repeat scale-110" />
        )}

        {/* Multi-layer overlay for cinematic depth */}
        <div className="absolute inset-0 bg-navy/80" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/40 via-transparent to-navy/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/30 via-transparent to-navy/30" />
      </motion.div>

      {/* Floating gold particles */}
      <FloatingParticles count={40} maxSize={2.5} minSize={0.5} speed={0.2} />

      {/* Decorative elements */}
      <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
        {/* Gold orb - top right */}
        <div
          className="absolute top-1/4 right-1/5 w-[500px] h-[500px] bg-gold/8 rounded-full blur-[120px] hidden lg:block animate-float-slow"
          aria-hidden
        />
        {/* Navy orb - bottom left */}
        <div
          className="absolute bottom-1/4 left-1/5 w-[400px] h-[400px] bg-burgundy/5 rounded-full blur-[100px] hidden lg:block animate-float-delayed"
          aria-hidden
        />

        {/* Geometric lines */}
        <svg className="absolute top-20 left-10 w-32 h-32 opacity-10 hidden lg:block" viewBox="0 0 100 100" aria-hidden>
          <motion.line
            x1="0" y1="50" x2="100" y2="50"
            stroke="#C9A84C" strokeWidth="0.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 1, duration: 1.5 }}
          />
          <motion.line
            x1="50" y1="0" x2="50" y2="100"
            stroke="#C9A84C" strokeWidth="0.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 1.2, duration: 1.5 }}
          />
          <motion.circle
            cx="50" cy="50" r="30"
            fill="none" stroke="#C9A84C" strokeWidth="0.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 1.4, duration: 2 }}
          />
        </svg>

        {/* Right side ornamental line */}
        <motion.div
          className="absolute right-8 top-1/4 bottom-1/4 w-px bg-gradient-to-b from-transparent via-gold/20 to-transparent hidden xl:block"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 1.5, duration: 1.2 }}
        />
        {/* Left side ornamental line */}
        <motion.div
          className="absolute left-8 top-1/4 bottom-1/4 w-px bg-gradient-to-b from-transparent via-gold/20 to-transparent hidden xl:block"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 1.5, duration: 1.2 }}
        />
      </div>

      {/* Content with scroll-linked opacity */}
      <motion.div
        className="relative z-10 container mx-auto px-4 text-center text-white pt-24 md:pt-28 pb-20"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        <div className="max-w-4xl mx-auto">
          {/* Ornamental top element */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.77, 0, 0.175, 1] }}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-gold" />
            <div className="w-2 h-2 rotate-45 border border-gold/60" />
            <div className="w-20 h-0.5 bg-gold" />
            <div className="w-2 h-2 rotate-45 border border-gold/60" />
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-gold" />
          </motion.div>

          {/* Eyebrow - letter by letter reveal */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <p className="text-gold uppercase tracking-[0.3em] text-xs md:text-sm font-semibold mb-6">
              <SplitText delay={0.5} stagger={isRTL ? 0.08 : 0.04} type={isRTL ? 'words' : 'chars'} animation="fadeUp">
                {t('eyebrow')}
              </SplitText>
            </p>
          </motion.div>

          {/* H1: Cinematic word-by-word reveal */}
          <div className={`text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-8 text-white ${isRTL ? 'font-tajawal' : 'font-playfair'}`}>
            <SplitText delay={0.7} stagger={0.08} type="words" animation="fadeUp" duration={0.6}>
              {restOfTitle}
            </SplitText>
            {' '}
            <motion.span
              className="text-transparent bg-clip-text bg-gradient-to-r from-gold-light via-gold to-gold-dark inline-block"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.6 }}
            >
              {lastWord ?? ''}
            </motion.span>
          </div>

          {/* Subtitle with smooth fade */}
          <motion.p
            initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: 1.3, duration: 0.7 }}
            className="text-lg md:text-xl text-white/75 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            {t('subtitle')}
          </motion.p>

          {/* CTAs with magnetic effect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <MagneticButton strength={0.15}>
              <Link href={`/${locale}/admissions`}>
                <Button
                  variant="shimmer"
                  size="xl"
                  className="w-full sm:w-auto min-w-[200px] bg-gradient-to-r from-burgundy to-burgundy/80 hover:from-burgundy/90 hover:to-burgundy shadow-lg shadow-burgundy/30 border-none btn-ripple hover:shadow-[0_0_30px_rgba(141,27,61,0.4)] transition-shadow duration-300"
                >
                  {t('cta_apply')}
                </Button>
              </Link>
            </MagneticButton>
            <MagneticButton strength={0.15}>
              <Link href={`/${locale}/programs`}>
                <Button
                  variant="outline"
                  size="xl"
                  className="w-full sm:w-auto min-w-[200px] border-2 border-white/30 text-white hover:bg-white hover:text-navy backdrop-blur-md glass-light hover:border-gold/50 transition-all duration-300"
                >
                  {t('cta_programs')}
                </Button>
              </Link>
            </MagneticButton>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator — enhanced with glow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <div className="flex flex-col items-center gap-2">
          <motion.span
            className="text-[10px] uppercase tracking-[0.2em] text-gold/50"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Scroll
          </motion.span>
          <motion.div
            className="w-5 h-8 rounded-full border border-gold/30 flex justify-center pt-1"
          >
            <motion.div
              className="w-1 h-2 bg-gold/50 rounded-full"
              animate={{ y: [0, 10, 0], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom gradient fade for smooth section transition */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-navy via-navy/50 to-transparent z-[5]" />
    </section>
  );
}
