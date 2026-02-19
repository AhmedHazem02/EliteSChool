'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import SectionHeader from '@/components/shared/SectionHeader';
import ScrollReveal from '@/components/shared/ScrollReveal';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import GeometricDecoration from '@/components/shared/GeometricDecoration';
import { generateFAQSchema } from '@/lib/seo';

interface FAQItem {
  question_en: string;
  question_ar: string;
  answer_en: string;
  answer_ar: string;
}

interface FAQSectionProps {
  locale: string;
  faqs?: FAQItem[];
}

const DEFAULT_FAQS: FAQItem[] = [
  {
    question_en: 'What curricula do you offer?',
    question_ar: 'ما المناهج التي تقدمونها؟',
    answer_en: 'We offer the British IGCSE/A-Level, the American Diploma, and the Egyptian National curriculum, allowing parents to choose what suits their child best.',
    answer_ar: 'نقدم المنهج البريطاني IGCSE/A-Level، والدبلوما الأمريكية، والمنهج الوطني المصري، مما يتيح للوالدين اختيار ما يناسب طفلهم.',
  },
  {
    question_en: 'What is the admissions process?',
    question_ar: 'ما هي إجراءات القبول؟',
    answer_en: 'Simply fill out our online admissions form, and our admissions team will contact you within 48 hours to arrange a school tour and placement test.',
    answer_ar: 'ببساطة املأ نموذج القبول الإلكتروني، وسيتواصل معك فريق القبول لدينا خلال 48 ساعة لترتيب جولة مدرسية واختبار تحديد المستوى.',
  },
  {
    question_en: 'Do you offer transportation services?',
    question_ar: 'هل تقدمون خدمة المواصلات؟',
    answer_en: 'Yes, we offer school bus routes covering major residential areas. Contact our administration for routes and fees.',
    answer_ar: 'نعم، نوفر خطوط حافلات مدرسية تغطي المناطق السكنية الرئيسية. تواصل مع إدارتنا للاستفسار عن المسارات والرسوم.',
  },
  {
    question_en: 'Are after-school activities available?',
    question_ar: 'هل تتوفر أنشطة بعد المدرسة؟',
    answer_en: 'Yes, we offer a wide range of extracurricular activities including sports, arts, music, robotics, and debate clubs.',
    answer_ar: 'نعم، نقدم مجموعة واسعة من الأنشطة اللاصفية تشمل الرياضة والفنون والموسيقى والروبوتيك ونوادي النقاش.',
  },
];

export default function FAQSection({ locale, faqs = DEFAULT_FAQS }: FAQSectionProps) {
  const t = useTranslations('faq');

  const schema = generateFAQSchema(faqs);

  return (
    <section className="section-padding bg-white relative overflow-hidden" aria-label="FAQ">
      {/* Decorative corner ornaments */}
      <GeometricDecoration type="corner-ornament" className="absolute top-6 left-6 opacity-30 hidden lg:block" size={80} />
      <GeometricDecoration type="corner-ornament" className="absolute bottom-6 right-6 opacity-30 hidden lg:block rotate-180" size={80} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="container mx-auto px-4 max-w-3xl">
        <SectionHeader title={t('title')} subtitle={t('subtitle')} />

        <ScrollReveal direction="up" className="mt-10">
          <Accordion type="single" collapsible>
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger>
                  {locale === 'ar' ? faq.question_ar : faq.question_en}
                </AccordionTrigger>
                <AccordionContent>
                  {locale === 'ar' ? faq.answer_ar : faq.answer_en}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollReveal>
      </div>
    </section>
  );
}
