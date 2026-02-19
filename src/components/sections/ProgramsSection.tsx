import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import SectionHeader from '@/components/shared/SectionHeader';
import ScrollReveal from '@/components/shared/ScrollReveal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { AcademicSystem } from '@/types';

interface ProgramsSectionProps {
  locale: string;
  systems: AcademicSystem[];
}

export default function ProgramsSection({ locale, systems }: ProgramsSectionProps) {
  const t = useTranslations('programs');
  const isRTL = locale === 'ar';

  return (
    <section className="section-padding bg-off-white" aria-label="Programs">
      <div className="container mx-auto px-4">
        <SectionHeader
          title={t('title')}
          subtitle={t('subtitle')}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {systems.map((sys, i) => {
            const name = locale === 'ar' ? sys.title_ar : sys.title_en;
            const desc = locale === 'ar' ? sys.description_ar : sys.description_en;

            return (
              <ScrollReveal key={sys.id} direction="up" delay={i * 0.1}>
                <Link href={`/${locale}/programs/${sys.id}`} className="group block h-full">
                  <div className="relative bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-luxury transition-all duration-500 h-full flex flex-col card-shine card-lift">
                    {/* Animated top color bar */}
                    <div className="h-1.5 bg-gradient-to-r from-navy via-burgundy to-gold group-hover:h-2 transition-all duration-300" />

                    {/* Hover glow */}
                    <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-gold/20 via-transparent to-gold/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[1px] -z-10" />

                    <div className="p-6 flex flex-col flex-1">
                      <Badge variant="secondary" className="self-start mb-3">
                        {locale === 'ar' ? 'نظام' : 'Curriculum'}
                      </Badge>

                      <h3 className="text-lg font-bold text-navy font-playfair mb-2 group-hover:text-gold transition-colors duration-300">
                        {name}
                      </h3>

                      {desc && (
                        <p className="text-navy/60 text-sm leading-relaxed flex-1">
                          {desc.length > 120 ? desc.slice(0, 120) + '…' : desc}
                        </p>
                      )}

                      <div className="mt-4 pt-4 border-t border-navy/10 group-hover:border-gold/20 transition-colors duration-300">
                        <span className="text-gold text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all duration-300">
                          {t('learn_more')} <span className="inline-block group-hover:translate-x-1 transition-transform duration-300">→</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link href={`/${locale}/programs`}>
            <Button variant="outline" size="lg">{t('view_all')}</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
