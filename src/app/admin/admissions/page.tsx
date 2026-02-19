import { createClient } from '@/lib/supabase/server';
import { getAdminLocale, adminT } from '@/lib/admin-i18n';
import SubmissionsList from '@/components/admin/SubmissionsList';

async function getSubmissions() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('admissions')
    .select('id, parent_name, student_name, grade_level, selected_system, phone, email, created_at')
    .order('created_at', { ascending: false });
  return data ?? [];
}

export default async function AdminAdmissionsPage() {
  const submissions = await getSubmissions();
  const locale = await getAdminLocale();
  const t = adminT(locale);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy font-playfair">{t('admissions.title')}</h1>
        <p className="text-navy/50 text-sm mt-1">{submissions.length} {t('admissions.totalSubmissions')}</p>
      </div>

      <SubmissionsList submissions={submissions} />
    </div>
  );
}
