import { createClient } from '@/lib/supabase/server';
import { buildMetadata } from '@/lib/seo';
import Link from 'next/link';
import SectionHeader from '@/components/shared/SectionHeader';
import ScrollReveal from '@/components/shared/ScrollReveal';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import CTASection from '@/components/sections/CTASection';
import { Badge } from '@/components/ui/badge';
import PageTransition from '@/components/shared/PageTransition';
import { ArrowRight, ArrowLeft } from 'lucide-react';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildMetadata({
    title: locale === 'ar' ? 'البرامج الأكاديمية' : 'Academic Programs',
    description: locale === 'ar' ? 'استكشف مناهجنا الأكاديمية المتنوعة' : 'Explore our diverse academic curricula.',
    path: `/${locale}/programs`,
    locale,
  });
}

export default async function ProgramsPage({ params }: Props) {
  const { locale } = await params;
  const isAR = locale === 'ar';
  const supabase = await createClient();

  const { data: systems } = await supabase
    .from('academic_systems')
    .select('id, title_en, title_ar, description_en, description_ar, is_active')
    .eq('is_active', true)
    .order('sort_order');

  const Arrow = isAR ? ArrowLeft : ArrowRight;

  return (
    <PageTransition>
      <main>
        <div className="bg-navy text-white py-24 text-center">
          <div className="container mx-auto px-4">
            <Breadcrumbs
              items={[
                { label: isAR ? 'البرامج' : 'Programs', href: `/${locale}/programs` },
              ]}
              light
            />
            <h1 className="text-4xl md:text-5xl font-bold font-playfair mt-6">
              {isAR ? 'برامجنا الأكاديمية' : 'Our Academic Programs'}
            </h1>
          </div>
        </div>

        <section className="section-padding bg-off-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(systems ?? []).map((sys, i) => {
                const name = isAR ? sys.title_ar : sys.title_en;
                const desc = isAR ? sys.description_ar : sys.description_en;

                return (
                  <ScrollReveal key={sys.id} direction="up" delay={i * 0.1}>
                    <Link href={`/${locale}/programs/${sys.id}`} className="group block h-full">
                      <div className="bg-white rounded-2xl p-6 shadow-card hover:shadow-gold transition-all duration-300 h-full flex flex-col border border-navy/5">
                        <div className="h-1.5 w-12 bg-gradient-to-r from-navy to-gold rounded-full mb-4" />
                        <Badge variant="secondary" className="self-start mb-3">
                          {isAR ? 'منهج' : 'Curriculum'}
                        </Badge>
                        <h2 className="text-lg font-bold text-navy font-playfair mb-2 group-hover:text-gold transition-colors">
                          {name}
                        </h2>
                        {desc && (
                          <p className="text-navy/60 text-sm leading-relaxed flex-1">
                            {desc.length > 150 ? desc.slice(0, 150) + '…' : desc}
                          </p>
                        )}
                        <div className="flex items-center gap-1.5 text-gold text-sm font-medium mt-4">
                          {isAR ? 'اقرأ المزيد' : 'Learn More'}
                          <Arrow size={14} className="group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>

        <CTASection locale={locale} />
      </main>
    </PageTransition>
  );
}
