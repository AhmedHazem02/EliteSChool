import { createClient } from '@/lib/supabase/server';
import { getAdminLocale, adminT } from '@/lib/admin-i18n';
import { notFound } from 'next/navigation';
import AcademicSystemForm from '@/components/admin/AcademicSystemForm';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AcademicSystemEditPage({ params }: Props) {
  const { id } = await params;
  const isNew = id === 'new';
  const locale = await getAdminLocale();
  const t = adminT(locale);

  if (!isNew) {
    const supabase = await createClient();
    const { data: system } = await supabase
      .from('academic_systems')
      .select('id, title_en, title_ar, description_en, description_ar, features_en, features_ar, is_active, sort_order')
      .eq('id', id)
      .single();

    if (!system) notFound();

    const { data: fees } = await supabase
      .from('tuition_fees')
      .select('id, grade_level_en, grade_level_ar, fee_amount, currency, notes_en, notes_ar')
      .eq('system_id', id)
      .order('sort_order');

    return (
      <div>
        <h1 className="text-2xl font-bold text-navy font-playfair mb-8">{t('systems.editSystem')}</h1>
        <AcademicSystemForm initialData={system} fees={fees ?? []} />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy font-playfair mb-8">{t('systems.newSystem')}</h1>
      <AcademicSystemForm fees={[]} />
    </div>
  );
}
