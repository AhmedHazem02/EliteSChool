'use client';

import { useTranslations } from 'next-intl';
import SectionHeader from '@/components/shared/SectionHeader';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name_en: 'Ahmed Al-Rashidy',
    name_ar: 'أحمد الراشدي',
    role_en: 'Parent of Grade 7 student',
    role_ar: 'ولي أمر طالب في الصف السابع',
    text_en: 'Elite Schools transformed my son\'s academic journey. The dedicated teachers and comprehensive curriculum gave him the confidence to excel.',
    text_ar: 'حوّلت مدارس إليت مسيرة ابني الأكاديمية. منحه المعلمون المتفانون والمنهج الشامل الثقة للتفوق.',
  },
  {
    name_en: 'Sara Mostafa',
    name_ar: 'سارة مصطفى',
    role_en: 'Parent of two students',
    role_ar: 'ولية أمر لطالبين',
    text_en: 'The bilingual environment is exceptional. My children are thriving academically and socially, and the school community is incredibly supportive.',
    text_ar: 'البيئة ثنائية اللغة استثنائية. أطفالي يتفوقون أكاديمياً واجتماعياً، ومجتمع المدرسة داعم بشكل لا يصدق.',
  },
  {
    name_en: 'Omar El-Sayed',
    name_ar: 'عمر السيد',
    role_en: 'Alumni, Class of 2022',
    role_ar: 'خريج دفعة 2022',
    text_en: 'The foundation Elite Schools gave me prepared me perfectly for university. I am now studying Engineering at Cairo University.',
    text_ar: 'الأساس الذي منحتني إياه مدارس إليت أعدّني تماماً للجامعة. أدرس الآن الهندسة في جامعة القاهرة.',
  },
  {
    name_en: 'Fatma Hassan',
    name_ar: 'فاطمة حسن',
    role_en: 'Parent of Grade 4 student',
    role_ar: 'ولية أمر طالبة في الصف الرابع',
    text_en: 'I love how the school balances academics with extracurricular activities. My daughter discovered her passion for art here.',
    text_ar: 'أحب كيف توازن المدرسة بين الدراسة والأنشطة. اكتشفت ابنتي شغفها بالفن هنا.',
  },
  {
    name_en: 'Youssef Kamal',
    name_ar: 'يوسف كمال',
    role_en: 'Alumni, Class of 2023',
    role_ar: 'خريج دفعة 2023',
    text_en: 'The IGCSE program at Elite prepared me exceptionally well. I secured a scholarship at AUC thanks to the strong foundation I received.',
    text_ar: 'برنامج IGCSE في إيليت أعدّني بشكل استثنائي. حصلت على منحة في الجامعة الأمريكية بفضل الأساس القوي.',
  },
  {
    name_en: 'Nour Abdallah',
    name_ar: 'نور عبدالله',
    role_en: 'Parent of three students',
    role_ar: 'ولية أمر لثلاثة طلاب',
    text_en: 'Three children, three different personalities, and they all thrive here. The teachers truly care about every student individually.',
    text_ar: 'ثلاثة أطفال، ثلاث شخصيات مختلفة، وكلهم يتفوقون هنا. المعلمون يهتمون حقاً بكل طالب على حدة.',
  },
];

interface TestimonoialsSectionProps {
  locale: string;
}

function TestimonialCard({
  testimonial,
  locale,
}: {
  testimonial: (typeof testimonials)[0];
  locale: string;
}) {
  const name = locale === 'ar' ? testimonial.name_ar : testimonial.name_en;
  const role = locale === 'ar' ? testimonial.role_ar : testimonial.role_en;
  const text = locale === 'ar' ? testimonial.text_ar : testimonial.text_en;

  return (
    <div className="w-[340px] md:w-[380px] flex-shrink-0 px-3">
      <div className="bg-white rounded-2xl p-6 shadow-card border border-navy/5 h-full flex flex-col transition-transform duration-300 hover:scale-105 hover:shadow-card-hover cursor-default">
        <Quote className="text-gold/40 mb-3" size={28} />
        <p className="text-navy/70 text-sm leading-relaxed flex-1">{text}</p>
        <div className="mt-4 pt-4 border-t border-navy/10">
          <div className="flex items-center gap-1 mb-1">
            {[...Array(5)].map((_, si) => (
              <Star key={si} size={12} className="text-gold fill-gold" />
            ))}
          </div>
          <p className="font-semibold text-navy text-sm">{name}</p>
          <p className="text-navy/50 text-xs">{role}</p>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsSection({ locale }: TestimonoialsSectionProps) {
  // Duplicate the list for seamless infinite loop
  const doubled = [...testimonials, ...testimonials];

  return (
    <section className="section-padding bg-off-white overflow-hidden" aria-label="Testimonials">
      <div className="container mx-auto px-4">
        <SectionHeader
          title={locale === 'ar' ? 'ماذا يقول مجتمعنا' : 'What Our Community Says'}
          subtitle={locale === 'ar' ? 'آراء الطلاب وأولياء الأمور والخريجين' : 'Voices from students, parents, and alumni'}
        />
      </div>

      {/* Infinite marquee strip */}
      <div className="relative mt-12 group">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-off-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-off-white to-transparent z-10 pointer-events-none" />

        <div
          className="flex animate-marquee group-hover:[animation-play-state:paused]"
          style={{ width: 'max-content' }}
        >
          {doubled.map((t, i) => (
            <TestimonialCard key={i} testimonial={t} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  );
}
