import { createClient } from '@/lib/supabase/server';
import SettingsForm from '@/components/admin/SettingsForm';

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from('site_settings')
    .select('id, key, value_en, value_ar, value_json')
    .order('key');

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy font-playfair">Site Settings</h1>
        <p className="text-navy/50 text-sm mt-1">Manage global site configuration</p>
      </div>
      <SettingsForm initialSettings={settings ?? []} />
    </div>
  );
}
