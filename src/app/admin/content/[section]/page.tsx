import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import ContentEditor from '@/components/admin/ContentEditor';

const VALID_SECTIONS = ['hero', 'about', 'why_choose_us', 'stats', 'faq'];

interface Props {
  params: Promise<{ section: string }>;
}

export default async function ContentSectionPage({ params }: Props) {
  const { section } = await params;

  if (!VALID_SECTIONS.includes(section)) notFound();

  const supabase = await createClient();
  const { data } = await supabase
    .from('page_content')
    .select('id, section, content_en, content_ar')
    .eq('section', section)
    .single();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy font-playfair capitalize">
          Edit: {section.replace(/_/g, ' ')}
        </h1>
        <p className="text-navy/50 text-sm mt-1">Changes are saved to the database and revalidate the public site.</p>
      </div>

      <ContentEditor section={section} initialData={data} />
    </div>
  );
}
