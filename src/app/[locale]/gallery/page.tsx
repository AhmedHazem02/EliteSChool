import { createClient } from '@/lib/supabase/server';
import { buildMetadata } from '@/lib/seo';
import Image from 'next/image';
import SectionHeader from '@/components/shared/SectionHeader';
import ScrollReveal from '@/components/shared/ScrollReveal';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import MasonryGrid from '@/components/shared/MasonryGrid';
import PageTransition from '@/components/shared/PageTransition';
import { GALLERY_CATEGORIES } from '@/lib/constants';
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
        <div className="bg-navy text-white py-24 text-center">
          <div className="container mx-auto px-4">
            <Breadcrumbs
              items={[
                { label: locale === 'ar' ? 'معرض الصور' : 'Gallery', href: `/${locale}/gallery` },
              ]}
              light
            />
            <h1 className="text-4xl md:text-5xl font-bold font-playfair mt-6">
              {locale === 'ar' ? 'معرض الصور' : 'Photo Gallery'}
            </h1>
          </div>
        </div>

        <section className="section-padding bg-off-white">
          <div className="container mx-auto px-4">
            <GalleryClientFilter items={items ?? []} locale={locale} />
          </div>
        </section>
      </main>
    </PageTransition>
  );
}
