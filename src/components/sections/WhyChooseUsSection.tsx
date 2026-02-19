import { useTranslations } from 'next-intl';
import SectionHeader from '@/components/shared/SectionHeader';
import TiltCard from '@/components/shared/TiltCard';
import ScrollReveal from '@/components/shared/ScrollReveal';
import { GraduationCap, Globe, Users, Award, BookOpen, Heart } from 'lucide-react';
import GeometricDecoration from '@/components/shared/GeometricDecoration';

const features = [
  {
    icon: GraduationCap,
    en: { title: 'Expert Faculty', desc: 'Certified & experienced teachers from Egypt and abroad' },
    ar: { title: 'كادر تدريسي متميز', desc: 'معلمون معتمدون وذوو خبرة من مصر والخارج' },
  },
  {
    icon: Globe,
    en: { title: 'Global Curricula', desc: 'British, American, and Egyptian national programmes' },
    ar: { title: 'مناهج عالمية', desc: 'مناهج بريطانية وأمريكية ومصرية وطنية' },
  },
  {
    icon: Users,
    en: { title: 'Small Class Sizes', desc: 'Personalized attention with max 20 students per class' },
    ar: { title: 'فصول صغيرة', desc: 'اهتمام شخصي بحد أقصى 20 طالباً لكل فصل' },
  },
  {
    icon: Award,
    en: { title: 'Award-Winning', desc: 'Nationally recognized for academic & extracurricular excellence' },
    ar: { title: 'حائز على جوائز', desc: 'معترف به وطنياً في التميز الأكاديمي والأنشطة' },
  },
  {
    icon: BookOpen,
    en: { title: 'Rich Resources', desc: 'Libraries, labs, sports facilities & arts studios' },
    ar: { title: 'موارد غنية', desc: 'مكتبات ومعامل وملاعب وصالات فنون' },
  },
  {
    icon: Heart,
    en: { title: 'Student Wellbeing', desc: 'Dedicated counselors and wellbeing programs' },
    ar: { title: 'رفاهية الطلاب', desc: 'مستشارون متخصصون وبرامج لرفاهية الطلاب' },
  },
];

interface WhyChooseUsSectionProps {
  locale: string;
}

export default function WhyChooseUsSection({ locale }: WhyChooseUsSectionProps) {
  const t = useTranslations('whyUs');

  return (
    <section className="section-padding bg-gray-100 relative overflow-hidden" aria-label="Why Choose Us">
      {/* Geometric decorations */}
      <GeometricDecoration type="islamic-star" className="absolute top-10 right-10 opacity-15 hidden lg:block" size={100} />
      <GeometricDecoration type="geometric-grid" className="absolute bottom-10 left-10 opacity-10 hidden lg:block" size={90} />
      <div className="container mx-auto px-4">
        <SectionHeader
          title={t('title')}
          subtitle={t('subtitle')}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {features.map((f, i) => {
            const content = locale === 'ar' ? f.ar : f.en;
            return (
              <ScrollReveal key={i} direction="up" delay={i * 0.08}>
                <TiltCard className="h-full">
                  <div className="group bg-white rounded-2xl p-6 h-full shadow-card hover:shadow-luxury transition-all duration-500 border border-navy/5 hover:border-gold/20 card-shine card-lift relative overflow-hidden">
                    {/* Subtle gradient on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative z-10">
                      <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center mb-5 group-hover:bg-gold/20 group-hover:shadow-gold transition-all duration-500 icon-hover-bounce">
                        <f.icon className="text-gold group-hover:scale-110 transition-transform duration-300" size={26} />
                      </div>
                      <h3 className="text-base font-semibold text-navy mb-2 group-hover:text-gold transition-colors duration-300">{content.title}</h3>
                      <p className="text-navy/60 text-sm leading-relaxed">{content.desc}</p>
                    </div>
                  </div>
                </TiltCard>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
