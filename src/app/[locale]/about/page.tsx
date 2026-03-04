import { createClient } from '@/lib/supabase/server';
import { buildMetadata } from '@/lib/seo';
import Image from 'next/image';
import SectionHeader from '@/components/shared/SectionHeader';
import ScrollReveal from '@/components/shared/ScrollReveal';
import CTASection from '@/components/sections/CTASection';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import { CheckCircle, Award, Users, Globe } from 'lucide-react';
import PageTransition from '@/components/shared/PageTransition';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildMetadata({
    title: locale === 'ar' ? 'من نحن' : 'About Us',
    description: locale === 'ar' ? 'تعرف على مدارس إليت وتاريخها ورسالتها' : 'Learn about Elite Schools, our history, mission and values.',
    path: `/${locale}/about`,
    locale,
  });
}

export const dynamic = 'force-dynamic';

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const isAR = locale === 'ar';
  const supabase = await createClient();

  const { data: aboutData } = await supabase
    .from('page_content')
    .select('title_en, title_ar, subtitle_en, subtitle_ar, content_en, content_ar, image_url, extra_data')
    .eq('section_key', 'about')
    .single();

  type ExtraData = {
    mission_en?: string; mission_ar?: string;
    vision_en?: string; vision_ar?: string;
  };
  const extra = (aboutData?.extra_data ?? {}) as ExtraData;

  const pageTitle = isAR ? (aboutData?.title_ar ?? 'عن مدارس إيليت') : (aboutData?.title_en ?? 'About Elite Schools');
  const pageSubtitle = isAR ? (aboutData?.subtitle_ar ?? null) : (aboutData?.subtitle_en ?? null);
  const pageDesc = isAR ? (aboutData?.content_ar as string | null) : (aboutData?.content_en as string | null);
  const pageImage = aboutData?.image_url ?? null;

  const missionText = isAR
    ? (extra.mission_ar ?? 'توفير بيئة تعليمية متميزة تُلهم الطلاب لتحقيق أعلى إمكاناتهم، وإعدادهم لمواجهة تحديات عالم متغير.')
    : (extra.mission_en ?? 'To provide an outstanding learning environment that inspires students to reach their highest potential, preparing them to thrive in a changing world.');

  const visionText = isAR
    ? (extra.vision_ar ?? 'أن نكون المدرسة الرائدة في مصر التي تُخريج طلاباً متكاملين ومؤثرين على المستوى المحلي والعالمي.')
    : (extra.vision_en ?? "To be Egypt's leading school producing well-rounded, impactful graduates who make a difference locally and globally.");

  const values = [
    { icon: Award, en: 'Excellence in all we do', ar: 'التميز في كل ما نفعله' },
    { icon: Users, en: 'Community & belonging', ar: 'المجتمع والانتماء' },
    { icon: Globe, en: 'Global mindset, local roots', ar: 'عقلية عالمية وجذور محلية' },
    { icon: CheckCircle, en: 'Integrity & transparency', ar: 'النزاهة والشفافية' },
  ];

  return (
    <PageTransition>
      <main>
        {/* Unified header — extends behind the fixed Navbar */}
        <section className="relative bg-navy text-white pt-28 pb-16 text-center overflow-hidden min-h-[260px] flex items-end justify-center">
          {pageImage && (
            <Image src={pageImage} alt={pageTitle} fill priority className="object-cover object-center" sizes="100vw" />
          )}
          <div className={`absolute inset-0 ${pageImage ? 'bg-navy/70' : 'bg-gradient-to-b from-navy via-navy/95 to-navy/80'} pointer-events-none`} />
          <div className="container mx-auto px-4 relative z-10 pb-4">
            <Breadcrumbs items={[{ label: isAR ? 'من نحن' : 'About', href: `/${locale}/about` }]} light />
            <h1 className="text-3xl md:text-4xl font-bold font-playfair mt-3">{pageTitle}</h1>
            {pageSubtitle && <p className="text-white/70 mt-2 text-lg">{pageSubtitle}</p>}
          </div>
        </section>

        {/* Mission */}
        <section className="section-padding bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <SectionHeader
              title={isAR ? 'رسالتنا ورؤيتنا' : 'Our Mission & Vision'}
              subtitle={isAR ? 'نسعى لتشكيل قادة المستقبل' : 'Shaping the leaders of tomorrow'}
            />

            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
              <ScrollReveal direction="left">
                <div className="bg-navy text-white rounded-2xl p-8">
                  <h3 className="text-xl font-bold font-playfair mb-3" style={{ color: '#C9A84C' }}>
                    {isAR ? 'رسالتنا' : 'Mission'}
                  </h3>
                  <p className="text-white/80 leading-relaxed">
                    {isAR
                      ? 'توفير بيئة تعليمية متميزة تُلهم الطلاب لتحقيق أعلى إمكاناتهم، وإعدادهم لمواجهة تحديات عالم متغير.'
                      : 'To provide an outstanding learning environment that inspires students to reach their highest potential, preparing them to thrive in a changing world.'}
                  </p>
                </div>
              </ScrollReveal>
              <ScrollReveal direction="right">
                <div className="bg-gold text-white rounded-2xl p-8">
                  <h3 className="text-xl font-bold font-playfair mb-3">
                    {isAR ? 'رؤيتنا' : 'Vision'}
                  </h3>
                  <p className="text-white/90 leading-relaxed">
                    {isAR
                      ? 'أن نكون المدرسة الرائدة في مصر التي تُخرّج طلاباً متكاملين ومؤثرين على المستوى المحلي والعالمي.'
                      : 'To be Egypt\'s leading school producing well-rounded, impactful graduates who make a difference locally and globally.'}
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="section-padding bg-off-white">
          <div className="container mx-auto px-4">
            <SectionHeader
              title={isAR ? 'قيمنا' : 'Our Values'}
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">
              {values.map((v, i) => (
                <ScrollReveal key={i} direction="up" delay={i * 0.1}>
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-2xl bg-navy/10 flex items-center justify-center mx-auto mb-3">
                      <v.icon className="text-navy" size={24} />
                    </div>
                    <p className="text-navy font-medium text-sm">
                      {isAR ? v.ar : v.en}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <CTASection locale={locale} />
      </main>
    </PageTransition>
  );
}
