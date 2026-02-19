import { createClient } from '@/lib/supabase/server';
import { getAdminLocale, adminT } from '@/lib/admin-i18n';
import { notFound } from 'next/navigation';
import ContentEditor from '@/components/admin/ContentEditor';

const VALID_SECTIONS = ['hero', 'about', 'why_choose_us', 'stats', 'faq'];

const SECTION_LABEL_KEYS: Record<string, string> = {
  hero: 'content.hero',
  about: 'content.about',
  why_choose_us: 'content.whyChooseUs',
  stats: 'content.stats',
  faq: 'content.faq',
};

interface Props {
  params: Promise<{ section: string }>;
}

export default async function ContentSectionPage({ params }: Props) {
  const { section } = await params;

  if (!VALID_SECTIONS.includes(section)) notFound();

  const locale = await getAdminLocale();
  const t = adminT(locale);

  const supabase = await createClient();
  const { data } = await supabase
    .from('page_content')
    .select('id, section_key, title_en, title_ar, subtitle_en, subtitle_ar, content_en, content_ar, image_url, extra_data')
    .eq('section_key', section)
    .single();

  const sectionLabel = t(SECTION_LABEL_KEYS[section] ?? section);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy font-playfair">
          {t('content.editSection')} {sectionLabel}
        </h1>
        <p className="text-navy/50 text-sm mt-1">{t('content.editNote')}</p>
      </div>

      <ContentEditor section={section} initialData={data} />
    </div>
  );
}
