import { useTranslations } from 'next-intl';
import Link from 'next/link';
import SectionHeader from '@/components/shared/SectionHeader';
import ScrollReveal from '@/components/shared/ScrollReveal';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MapPin } from 'lucide-react';

interface CTASectionProps {
  locale: string;
}

export default function CTASection({ locale }: CTASectionProps) {
  const t = useTranslations('cta');

  return (
    <section className="section-padding bg-gradient-to-br from-burgundy to-burgundy/80 text-white relative overflow-hidden" aria-label="CTA">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <ScrollReveal direction="up">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-gold uppercase tracking-widest text-xs font-semibold mb-4">
              {t('eyebrow')}
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-playfair mb-4">
              {t('title')}
            </h2>
            <p className="text-white/80 text-lg mb-10 leading-relaxed">
              {t('subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href={`/${locale}/admissions`}>
                <Button variant="shimmer" size="xl" className="w-full sm:w-auto min-w-[200px] bg-gold hover:bg-gold/90 border-none shadow-gold">
                  {t('apply_now')}
                </Button>
              </Link>
              <Link href={`/${locale}/contact`}>
                <Button variant="outline" size="xl" className="w-full sm:w-auto min-w-[200px] border-white text-white hover:bg-white hover:text-burgundy">
                  {t('contact_us')}
                </Button>
              </Link>
            </div>

            {/* Quick contact info */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center text-sm text-white/70">
              <a href="tel:+20xxxxxxxxxx" className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone size={15} /> +20 (xx) xxxxxxxx
              </a>
              <a href="mailto:info@elite-schools.com" className="flex items-center gap-2 hover:text-white transition-colors">
                <Mail size={15} /> info@elite-schools.com
              </a>
              <span className="flex items-center gap-2">
                <MapPin size={15} /> Cairo, Egypt
              </span>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
