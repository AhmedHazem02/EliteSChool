import { buildMetadata } from '@/lib/seo';
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

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const isAR = locale === 'ar';

  const values = [
    { icon: Award, en: 'Excellence in all we do', ar: 'التميز في كل ما نفعله' },
    { icon: Users, en: 'Community & belonging', ar: 'المجتمع والانتماء' },
    { icon: Globe, en: 'Global mindset, local roots', ar: 'عقلية عالمية وجذور محلية' },
    { icon: CheckCircle, en: 'Integrity & transparency', ar: 'النزاهة والشفافية' },
  ];

  return (
    <PageTransition>
      <main>
        {/* Hero */}
        <div className="relative bg-navy text-white py-24 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/about-hero.jpg')] bg-cover bg-center opacity-20" />
          <div className="container mx-auto px-4 relative z-10 text-center">
            <Breadcrumbs
              items={[
                { label: isAR ? 'من نحن' : 'About', href: `/${locale}/about` },
              ]}
              light
            />
            <h1 className="text-4xl md:text-5xl font-bold font-playfair mt-6">
              {isAR ? 'من نحن' : 'About Elite Schools'}
            </h1>
          </div>
        </div>

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
