import { createClient } from '@/lib/supabase/server';
import { buildMetadata } from '@/lib/seo';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import PageTransition from '@/components/shared/PageTransition';
import GalleryClientFilter from '@/components/gallery/GalleryClientFilter';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildMetadata({
    title: locale === 'ar' ? 'معرض الصور' : 'Gallery',
    description: locale === 'ar' ? 'استعرض صور مدارس إليت' : 'Browse Elite Schools photo gallery.',
    path: `/${locale}/gallery`,
    locale,
  });
}

export default async function GalleryPage({ params }: Props) {
  const { locale } = await params;
  const supabase = await createClient();

  const { data: items } = await supabase
    .from('gallery')
    .select('id, media_url, caption_en, caption_ar, category, sort_order, media_type, is_active, created_at')
    .order('sort_order');

  return (
    <PageTransition>
      <main>
        {/* Unified header — extends behind the fixed Navbar */}
        <section className="relative bg-navy text-white pt-28 pb-8 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-navy via-navy/95 to-navy/80 pointer-events-none" />
          <div className="container mx-auto px-4 relative z-10">
            <Breadcrumbs
              items={[
                { label: locale === 'ar' ? 'معرض الصور' : 'Gallery', href: `/${locale}/gallery` },
              ]}
              light
            />
            <h1 className="text-3xl md:text-4xl font-bold font-playfair mt-3">
              {locale === 'ar' ? 'معرض الصور' : 'Photo Gallery'}
            </h1>
          </div>
        </section>

        <section className="section-padding bg-off-white">
          <div className="container mx-auto px-4">
            <GalleryClientFilter items={items ?? []} locale={locale} />
          </div>
        </section>
      </main>
    </PageTransition>
  );
}
