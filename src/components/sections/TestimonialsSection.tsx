'use client';

import { useRef, useEffect, useState } from 'react';
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

/* ── Single Card ── */
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
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <div className="w-[340px] md:w-[380px] flex-shrink-0 px-3">
      <div dir={dir} className="relative group bg-white dark:bg-[#162236] rounded-2xl p-6 shadow-card border border-navy/5 h-full flex flex-col transition-all duration-500 hover:scale-[1.02] hover:shadow-luxury cursor-default card-shine">
        {/* Gold accent line at top */}
        <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-gold/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Subtle gold gradient accent on hover */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gold/5 via-transparent to-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, si) => (
                <Star key={si} size={13} className="text-gold fill-gold drop-shadow-[0_0_3px_rgba(201,168,76,0.4)]" />
              ))}
            </div>
            <Quote className="text-gold/20 group-hover:text-gold/40 transition-colors duration-500" size={32} />
          </div>

          <p className="text-navy/70 dark:text-gray-300 text-[15px] leading-relaxed flex-1 mb-4">&ldquo;{text}&rdquo;</p>

          <div className="mt-auto pt-4 border-t border-navy/8 dark:border-gold/10 flex items-center gap-3">
            {/* Avatar circle with initials */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center flex-shrink-0 border border-gold/20">
              <span className="text-gold font-bold text-sm">
                {name.split(' ').map(w => w[0]).join('').slice(0, 2)}
              </span>
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-navy dark:text-gray-100 text-sm group-hover:text-gold transition-colors duration-300 truncate">{name}</p>
              <p className="text-navy/50 dark:text-gray-400 text-xs truncate">{role}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Infinite auto-scrolling marquee ── */
export default function TestimonialsSection({ locale }: TestimonoialsSectionProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const [paused, setPaused] = useState(false);

  // JS-driven translateX for smooth infinite scroll
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let raf: number;
    const speed = 0.5; // px per frame

    const step = () => {
      if (!paused) {
        offsetRef.current += speed;

        // Each "set" width = total / 3 (we render 3 copies)
        const singleSetWidth = track.scrollWidth / 3;
        if (offsetRef.current >= singleSetWidth) {
          offsetRef.current -= singleSetWidth;
        }

        track.style.transform = `translateX(-${offsetRef.current}px)`;
      }
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [paused]);

  // Triple the list for seamless looping
  const tripled = [...testimonials, ...testimonials, ...testimonials];

  return (
    <section className="section-padding bg-off-white dark:bg-[#0F1B2D] overflow-hidden" aria-label="Testimonials">
      <div className="container mx-auto px-4">
        <SectionHeader
          title={locale === 'ar' ? 'ماذا يقول مجتمعنا' : 'What Our Community Says'}
          subtitle={locale === 'ar' ? 'آراء الطلاب وأولياء الأمور والخريجين' : 'Voices from students, parents, and alumni'}
        />
      </div>

      <div
        className="relative mt-12 overflow-hidden"
        dir="ltr"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-r from-off-white dark:from-[#0F1B2D] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-l from-off-white dark:from-[#0F1B2D] to-transparent z-10 pointer-events-none" />

        {/* Scrolling track — translateX driven */}
        <div
          ref={trackRef}
          className="flex py-4 will-change-transform"
          style={{ width: 'max-content' }}
        >
          {tripled.map((t, i) => (
            <TestimonialCard key={i} testimonial={t} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  );
}
