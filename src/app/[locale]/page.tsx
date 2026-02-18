import { createClient } from '@/lib/supabase/server';
import { buildMetadata, generateSchoolSchema } from '@/lib/seo';
import HeroSection from '@/components/sections/HeroSection';
import StatsSection from '@/components/sections/StatsSection';
import AboutSection from '@/components/sections/AboutSection';
import ProgramsSection from '@/components/sections/ProgramsSection';
import WhyChooseUsSection from '@/components/sections/WhyChooseUsSection';
import FAQSection from '@/components/sections/FAQSection';
import GallerySection from '@/components/sections/GallerySection';
import NewsSection from '@/components/sections/NewsSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import CTASection from '@/components/sections/CTASection';
import SectionDivider from '@/components/shared/SectionDivider';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildMetadata({
    title: locale === 'ar' ? 'مدارس إليت - التميز الأكاديمي' : 'Elite Schools - Academic Excellence',
    description: locale === 'ar' ? 'مدارس إليت - رحلة التميز الأكاديمي' : 'Elite Schools — where academic excellence meets holistic development.',
    path: `/${locale}`,
    locale,
    alternateLocale: locale === 'ar' ? 'en' : 'ar',
  });
}

export const revalidate = 3600; // ISR – re-generate every hour

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const supabase = await createClient();

  const [systemsRes, galleryRes, postsRes] = await Promise.all([
    supabase.from('academic_systems').select('id, title_en, title_ar, description_en, description_ar, is_active, slug, hero_image_url, curriculum_en, curriculum_ar, features_en, features_ar, sort_order, created_at, updated_at').eq('is_active', true).order('sort_order'),
    supabase.from('gallery').select('id, media_url, caption_en, caption_ar, category, sort_order, media_type, is_active, created_at').order('sort_order').limit(12),
    supabase.from('posts').select('id, title_en, title_ar, content_en, content_ar, thumbnail_url, type, created_at, is_published, is_featured, slug, excerpt_en, excerpt_ar, event_date, updated_at').eq('is_published', true).order('created_at', { ascending: false }).limit(3),
  ]);

  const systems = systemsRes.data ?? [];
  const gallery = galleryRes.data ?? [];
  const posts = postsRes.data ?? [];

  const schema = generateSchoolSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <HeroSection locale={locale} />
      {/* Hero=navy → Stats=navy: no divider needed */}

      <StatsSection locale={locale} />
      <SectionDivider variant="navy-to-white" />

      <AboutSection locale={locale} />

      <WhyChooseUsSection locale={locale} />

      <ProgramsSection locale={locale} systems={systems} />
      <SectionDivider variant="offwhite-to-white" />

      <NewsSection locale={locale} posts={posts} />
      <SectionDivider variant="white-to-offwhite" />

      <GallerySection locale={locale} items={gallery} />
      <SectionDivider variant="offwhite-to-white" />

      <TestimonialsSection locale={locale} />
      <SectionDivider variant="offwhite-to-white" />

      <FAQSection locale={locale} />
      <SectionDivider variant="white-to-burgundy" />

      <CTASection locale={locale} />
    </>
  );
}
