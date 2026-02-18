import Image from 'next/image';
import { useTranslations } from 'next-intl';
import SectionHeader from '@/components/shared/SectionHeader';
import ScrollReveal from '@/components/shared/ScrollReveal';
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
}

export default function AboutSection({ locale }: AboutSectionProps) {
  const t = useTranslations('about');
  const isRTL = locale === 'ar';

  return (
    <section className="section-padding bg-white" aria-label="About">
      <div className="container mx-auto px-4">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center ${isRTL ? 'lg:flex-row-reverse' : ''}`}>
          {/* Image */}
          <ScrollReveal direction={isRTL ? 'right' : 'left'}>
            <div className="relative">
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-navy aspect-[4/3]">
                <Image
                  src="/about-school.jpg"
                  alt="Elite Schools Campus"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              {/* Gold accent box */}
              <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-gold/10 rounded-3xl -z-10 border border-gold/20" />
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-navy/5 rounded-2xl -z-10" />
              {/* Year badge */}
              <div className="absolute top-6 left-6 bg-gold text-white rounded-2xl px-4 py-2 text-center shadow-gold">
                <p className="text-2xl font-bold font-playfair">1999</p>
                <p className="text-xs uppercase tracking-wider">Est.</p>
              </div>
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

              <ul className="space-y-3 mb-8">
                {highlights.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="text-gold shrink-0 mt-0.5" size={18} />
                    <span className="text-navy/70 text-sm">
                      {locale === 'ar' ? item.ar : item.en}
                    </span>
                  </li>
                ))}
              </ul>

              <Link href={`/${locale}/about`}>
                <Button variant="default" size="lg">{t('cta')}</Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
