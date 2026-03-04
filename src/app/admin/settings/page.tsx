import { createAdminClient } from '@/lib/supabase/admin';
import { getAdminLocale, adminT } from '@/lib/admin-i18n';
import SettingsForm from '@/components/admin/SettingsForm';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const supabase = createAdminClient();
  const locale = await getAdminLocale();
  const t = adminT(locale);
  const { data: settings } = await supabase
    .from('site_settings')
    .select('*')
    .single();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy font-playfair">{t('settings.title')}</h1>
        <p className="text-navy/50 text-sm mt-1">{t('settings.subtitle')}</p>
      </div>
      <SettingsForm initialSettings={settings} />
    </div>
  );
}
