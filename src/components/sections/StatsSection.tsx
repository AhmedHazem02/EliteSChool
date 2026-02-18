import { useTranslations } from 'next-intl';
import AnimatedCounter from '@/components/shared/AnimatedCounter';
import ScrollReveal from '@/components/shared/ScrollReveal';

interface StatItem {
  value: number;
  suffix: string;
  label_en: string;
  label_ar: string;
}

interface StatsSectionProps {
  locale: string;
  stats?: StatItem[];
}

const DEFAULT_STATS: StatItem[] = [
  { value: 2500, suffix: '+', label_en: 'Students Enrolled', label_ar: 'طالب ملتحق' },
  { value: 150, suffix: '+', label_en: 'Qualified Teachers', label_ar: 'معلم مؤهل' },
  { value: 25, suffix: '', label_en: 'Years of Excellence', label_ar: 'عاماً من التميز' },
  { value: 98, suffix: '%', label_en: 'University Acceptance', label_ar: 'قبول جامعي' },
];

export default function StatsSection({ locale, stats = DEFAULT_STATS }: StatsSectionProps) {
  return (
    <section className="section-padding bg-navy text-white" aria-label="Statistics">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
          {stats.map((stat, i) => (
            <ScrollReveal key={i} direction="up" delay={i * 0.1}>
              <div className="text-center">
                <AnimatedCounter
                  end={stat.value}
                  suffix={stat.suffix}
                  className="text-4xl md:text-5xl font-bold text-gold font-playfair"
                />
                <p className="text-white/70 text-sm mt-2">
                  {locale === 'ar' ? stat.label_ar : stat.label_en}
                </p>
                <div className="w-10 h-0.5 bg-gold/40 mx-auto mt-3" />
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
