'use client';

import AnimatedCounter from '@/components/shared/AnimatedCounter';
import ScrollReveal from '@/components/shared/ScrollReveal';
import FloatingParticles from '@/components/shared/FloatingParticles';

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
    <section className="section-padding bg-navy text-white relative overflow-hidden" aria-label="Statistics">
      {/* Subtle particles */}
      <FloatingParticles count={15} maxSize={1.5} minSize={0.5} speed={0.15} />

      {/* Decorative pattern */}
      <div className="absolute inset-0 pattern-dots pointer-events-none" />

      {/* Decorative gradient orb */}
      <div className="absolute -top-20 -right-20 w-60 h-60 bg-gold/5 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-burgundy/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
          {stats.map((stat, i) => (
            <ScrollReveal key={i} direction="up" delay={i * 0.15}>
              <div className="text-center group">
                {/* Glow behind number */}
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-gold/5 blur-2xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <AnimatedCounter
                    end={stat.value}
                    suffix={stat.suffix}
                    className="text-4xl md:text-5xl lg:text-6xl font-bold text-gold font-playfair relative z-10 transition-all duration-300 group-hover:text-gold-light"
                  />
                </div>
                <p className="text-white/60 text-sm mt-3 tracking-wide">
                  {locale === 'ar' ? stat.label_ar : stat.label_en}
                </p>
                {/* Animated gold underline */}
                <div className="w-10 h-0.5 bg-gradient-to-r from-gold/20 via-gold/60 to-gold/20 mx-auto mt-4 group-hover:w-16 transition-all duration-500" />
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
