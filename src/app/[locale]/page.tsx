import { createClient } from '@/lib/supabase/server';
import { buildMetadata, generateSchoolSchema } from '@/lib/seo';
import dynamic from 'next/dynamic';
import HeroSection from '@/components/sections/HeroSection';
import StatsSection from '@/components/sections/StatsSection';
import AboutSection from '@/components/sections/AboutSection';
import SectionDivider from '@/components/shared/SectionDivider';

// Below-fold sections — loaded lazily to reduce initial JS bundle
const WhyChooseUsSection = dynamic(() => import('@/components/sections/WhyChooseUsSection'));
const ProgramsSection    = dynamic(() => import('@/components/sections/ProgramsSection'));
const NewsSection        = dynamic(() => import('@/components/sections/NewsSection'));
const GallerySection     = dynamic(() => import('@/components/sections/GallerySection'));
const HorizontalGallery  = dynamic(() => import('@/components/sections/HorizontalGallery'));
const TestimonialsSection = dynamic(() => import('@/components/sections/TestimonialsSection'));
const FAQSection         = dynamic(() => import('@/components/sections/FAQSectionClient'));
const CTASection         = dynamic(() => import('@/components/sections/CTASection'));

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

export const revalidate = 60; // ISR: revalidate every 60s + on-demand from admin actions

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const supabase = await createClient();

  const [systemsRes, galleryRes, postsRes, settingsRes, pageContentRes] = await Promise.all([
    supabase.from('academic_systems').select('id, title_en, title_ar, description_en, description_ar, is_active, slug, hero_image_url, curriculum_en, curriculum_ar, features_en, features_ar, sort_order, created_at, updated_at').eq('is_active', true).order('sort_order'),
    supabase.from('gallery').select('id, media_url, caption_en, caption_ar, category, sort_order, media_type, is_active, created_at').order('sort_order').limit(12),
    supabase.from('posts').select('id, title_en, title_ar, content_en, content_ar, thumbnail_url, type, created_at, is_published, is_featured, slug, excerpt_en, excerpt_ar, event_date, updated_at').eq('is_published', true).order('created_at', { ascending: false }).limit(3),
    supabase.from('site_settings').select('hero_video_url, hero_image_url').single(),
    supabase.from('page_content')
      .select('section_key, title_en, title_ar, subtitle_en, subtitle_ar, content_en, content_ar, image_url, extra_data')
      .in('section_key', ['hero', 'about', 'stats', 'why_choose_us', 'faq']),
  ]);

  const systems = systemsRes.data ?? [];
  const gallery = galleryRes.data ?? [];
  const posts = postsRes.data ?? [];
  const settings = settingsRes.data;

  // Map page_content rows by section_key
  type PageContentRow = NonNullable<typeof pageContentRes.data>[number];
  const pc = Object.fromEntries(
    (pageContentRes.data ?? []).map((r: PageContentRow) => [r.section_key, r])
  );

  const aboutImageUrl = pc.about?.image_url ?? null;
  const heroContentImage = pc.hero?.image_url ?? null;

  // Stats: extra_data is [{value, suffix, label_en, label_ar}]
  type DbStat = { value: number; suffix: string; label_en: string; label_ar: string };
  const dbStats = Array.isArray(pc.stats?.extra_data)
    ? (pc.stats.extra_data as DbStat[])
    : null;

  // WhyChooseUs: extra_data is [{icon, title_en, title_ar, desc_en, desc_ar}]
  type DbFeature = { icon: string; title_en: string; title_ar: string; desc_en: string; desc_ar: string };
  const dbWhyFeatures = Array.isArray(pc.why_choose_us?.extra_data)
    ? (pc.why_choose_us.extra_data as DbFeature[])
    : null;

  // FAQ: extra_data is [{q_en, q_ar, a_en, a_ar}]
  type DbFaq = { q_en: string; q_ar: string; a_en: string; a_ar: string };
  const dbFaqs = Array.isArray(pc.faq?.extra_data)
    ? (pc.faq.extra_data as DbFaq[]).map((f) => ({
        question_en: f.q_en,
        question_ar: f.q_ar,
        answer_en: f.a_en,
        answer_ar: f.a_ar,
      }))
    : null;

  // About highlights from extra_data
  type DbHighlight = { en: string; ar: string };
  const dbHighlights = (() => {
    const ex = pc.about?.extra_data;
    if (ex && typeof ex === 'object' && Array.isArray((ex as Record<string, unknown>).highlights)) {
      return (ex as { highlights: DbHighlight[] }).highlights;
    }
    return null;
  })();

  const dbFoundedYear = (() => {
    const ex = pc.about?.extra_data;
    if (ex && typeof ex === 'object') {
      const v = (ex as Record<string, unknown>).founded_year;
      return typeof v === 'string' ? v : null;
    }
    return null;
  })();

  const dbEstLabel = (() => {
    const ex = pc.about?.extra_data;
    if (ex && typeof ex === 'object') {
      const v = (ex as Record<string, unknown>).est_label;
      return typeof v === 'string' ? v : null;
    }
    return null;
  })();

  // show_about_image: default true if not explicitly set to false
  const showAboutImage = (() => {
    const ex = pc.about?.extra_data;
    if (ex && typeof ex === 'object') {
      const v = (ex as Record<string, unknown>).show_about_image;
      if (typeof v === 'boolean') return v;
    }
    return true;
  })();

  const schema = generateSchoolSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <HeroSection
        locale={locale}
        videoUrl={settings?.hero_video_url}
        heroImageUrl={settings?.hero_image_url || heroContentImage}
        dbTitle={locale === 'ar' ? pc.hero?.title_ar : pc.hero?.title_en}
        dbSubtitle={locale === 'ar' ? pc.hero?.subtitle_ar : pc.hero?.subtitle_en}
        dbDescription={locale === 'ar'
          ? (pc.hero?.content_ar as string | null | undefined)
          : (pc.hero?.content_en as string | null | undefined)}
      />
      {/* Hero=navy → Stats=navy: no divider needed */}

      <StatsSection locale={locale} stats={dbStats ?? undefined} />
      <SectionDivider variant="navy-to-white" />

      <AboutSection
        locale={locale}
        imageUrl={showAboutImage ? aboutImageUrl : null}
        dbTitle={locale === 'ar' ? pc.about?.title_ar : pc.about?.title_en}
        dbSubtitle={locale === 'ar' ? pc.about?.subtitle_ar : pc.about?.subtitle_en}
        dbDescription={locale === 'ar'
          ? (pc.about?.content_ar as string | null | undefined)
          : (pc.about?.content_en as string | null | undefined)}
        dbHighlights={dbHighlights ?? undefined}
        dbFoundedYear={dbFoundedYear}
        dbEstLabel={dbEstLabel}
      />

      <WhyChooseUsSection locale={locale} dbFeatures={dbWhyFeatures ?? undefined} />

      <ProgramsSection locale={locale} systems={systems} />
      <SectionDivider variant="offwhite-to-white" />

      <NewsSection locale={locale} posts={posts} />
      <SectionDivider variant="white-to-offwhite" />

      <GallerySection locale={locale} items={gallery} />

      {/* Horizontal scroll cinematic showcase */}
      {gallery.length >= 3 && (
        <HorizontalGallery
          locale={locale}
          items={gallery}
          title={locale === 'ar' ? 'لحظات من التميز' : 'Moments of Excellence'}
          subtitle={locale === 'ar' ? 'معرض الصور' : 'Photo Gallery'}
        />
      )}

      <SectionDivider variant="offwhite-to-white" />

      <TestimonialsSection locale={locale} />
      <SectionDivider variant="offwhite-to-white" />

      <FAQSection locale={locale} faqs={dbFaqs ?? undefined} />
      <SectionDivider variant="white-to-burgundy" />

      <CTASection locale={locale} />
    </>
  );
}
