'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import ScrollReveal from '@/components/shared/ScrollReveal';
import MagneticButton from '@/components/shared/MagneticButton';
import AuroraBackground from '@/components/shared/AuroraBackground';
import SplitText from '@/components/shared/SplitText';
import { Button } from '@/components/ui/button';
import GeometricDecoration from '@/components/shared/GeometricDecoration';
import { Phone, Mail, MapPin } from 'lucide-react';

interface CTASectionProps {
  locale: string;
}

export default function CTASection({ locale }: CTASectionProps) {
  const t = useTranslations('cta');

  return (
    <AuroraBackground variant="burgundy">
      <section className="section-padding text-white relative overflow-hidden" aria-label="CTA">
        {/* Floating decorative elements */}
        <div className="absolute top-10 right-10 w-20 h-20 border border-white/10 rounded-full animate-float pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-14 h-14 border border-gold/20 rounded-full animate-float-delayed pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-3 h-3 bg-gold/20 rounded-full animate-float-slow pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-white/10 rounded-full animate-float pointer-events-none" />

        {/* Geometric ornament */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-20 bg-gradient-to-b from-gold/30 to-transparent pointer-events-none" />

        {/* Islamic geometric decorations */}
        <GeometricDecoration type="islamic-star" className="absolute top-16 left-8 opacity-30 hidden lg:block" size={80} />
        <GeometricDecoration type="islamic-star" className="absolute bottom-16 right-8 opacity-20 hidden lg:block" size={60} />

        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal direction="up">
            <div className="max-w-3xl mx-auto text-center">
              {/* Ornamental separator */}
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-8 h-px bg-gradient-to-r from-transparent to-gold/60" />
                <div className="w-1.5 h-1.5 rotate-45 bg-gold/60" />
                <div className="w-8 h-px bg-gradient-to-l from-transparent to-gold/60" />
              </div>

              <p className="text-gold uppercase tracking-[0.25em] text-xs font-semibold mb-5">
                {t('eyebrow')}
              </p>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-playfair mb-5">
                <SplitText type="words" animation="fadeUp" delay={0.1} stagger={0.06}>
                  {t('title')}
                </SplitText>
              </h2>

              <p className="text-white/75 text-lg mb-12 leading-relaxed max-w-xl mx-auto">
                {t('subtitle')}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
                <MagneticButton strength={0.15}>
                  <Link href={`/${locale}/admissions`}>
                    <Button variant="shimmer" size="xl" className="w-full sm:w-auto min-w-[200px] bg-gold hover:bg-gold/90 border-none shadow-gold btn-ripple hover:shadow-gold-glow transition-shadow duration-500">
                      {t('apply_now')}
                    </Button>
                  </Link>
                </MagneticButton>
                <MagneticButton strength={0.15}>
                  <Link href={`/${locale}/contact`}>
                    <Button variant="outline" size="xl" className="w-full sm:w-auto min-w-[200px] border-white/30 text-white hover:bg-white hover:text-burgundy glass-light hover:border-white transition-all duration-300">
                      {t('contact_us')}
                    </Button>
                  </Link>
                </MagneticButton>
              </div>

              {/* Quick contact info — glass cards */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
                <a href="tel:+20xxxxxxxxxx" className="flex items-center gap-2.5 text-white/60 hover:text-gold transition-colors duration-300 px-4 py-2 rounded-full glass-light hover:border-gold/30">
                  <Phone size={14} className="text-gold/70" /> +20 (xx) xxxxxxxx
                </a>
                <a href="mailto:info@elite-schools.com" className="flex items-center gap-2.5 text-white/60 hover:text-gold transition-colors duration-300 px-4 py-2 rounded-full glass-light hover:border-gold/30">
                  <Mail size={14} className="text-gold/70" /> info@elite-schools.com
                </a>
                <span className="flex items-center gap-2.5 text-white/60 px-4 py-2 rounded-full glass-light">
                  <MapPin size={14} className="text-gold/70" /> Cairo, Egypt
                </span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </AuroraBackground>
  );
}
