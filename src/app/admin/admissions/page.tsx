import { createClient } from '@/lib/supabase/server';
import { getAdminLocale, adminT } from '@/lib/admin-i18n';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';

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

      {submissions.length === 0 ? (
        <div className="text-center py-20 text-navy/40">{t('admissions.empty')}</div>
      ) : (
        <div className="space-y-3">
          {submissions.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-xl border border-navy/10 p-4 flex flex-col sm:flex-row sm:items-center gap-3 hover:shadow-card transition-shadow"
            >
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-navy text-sm">{s.student_name}</span>
                  <Badge variant="secondary">{t('admissions.new')}</Badge>
                </div>
                <p className="text-navy/60 text-xs mt-0.5">
                  {t('admissions.parent')}: {s.parent_name} · {s.phone}
                  {s.email && ` · ${s.email}`}
                </p>
              </div>

              {/* Grade + System */}
              <div className="text-xs text-navy/60 shrink-0">
                <div>{t('admissions.grade')}: <span className="font-medium text-navy">{s.grade_level}</span></div>
                {s.selected_system && (
                  <div>{t('admissions.system')}: <span className="font-medium text-navy">{s.selected_system}</span></div>
                )}
              </div>

              {/* Date */}
              <p className="text-xs text-navy/40 shrink-0">{formatDate(s.created_at)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
