'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAdminI18n } from '@/components/admin/AdminI18nProvider';
import { Save, CheckCircle } from 'lucide-react';

type SiteSettings = {
  id: string;
  site_name_en: string | null;
  site_name_ar: string | null;
  logo_url: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  whatsapp: string | null;
  address_en: string | null;
  address_ar: string | null;
  map_url: string | null;
  hero_video_url: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  twitter_url: string | null;
  youtube_url: string | null;
  seo_title_en: string | null;
  seo_title_ar: string | null;
  seo_description_en: string | null;
  seo_description_ar: string | null;
};

const FIELDS: { key: keyof Omit<SiteSettings, 'id'>; labelKey: string; dir?: 'rtl' }[] = [
  { key: 'site_name_en', labelKey: 'settings.siteNameEn' },
  { key: 'site_name_ar', labelKey: 'settings.siteNameAr', dir: 'rtl' },
  { key: 'contact_email', labelKey: 'settings.contactEmail' },
  { key: 'contact_phone', labelKey: 'settings.contactPhone' },
  { key: 'whatsapp', labelKey: 'settings.whatsapp' },
  { key: 'address_en', labelKey: 'settings.addressEn' },
  { key: 'address_ar', labelKey: 'settings.addressAr', dir: 'rtl' },
  { key: 'map_url', labelKey: 'settings.mapUrl' },
  { key: 'hero_video_url', labelKey: 'settings.heroVideoUrl' },
  { key: 'logo_url', labelKey: 'settings.logoUrl' },
  { key: 'facebook_url', labelKey: 'settings.facebookUrl' },
  { key: 'instagram_url', labelKey: 'settings.instagramUrl' },
  { key: 'twitter_url', labelKey: 'settings.twitterUrl' },
  { key: 'youtube_url', labelKey: 'settings.youtubeUrl' },
  { key: 'seo_title_en', labelKey: 'settings.seoTitleEn' },
  { key: 'seo_title_ar', labelKey: 'settings.seoTitleAr', dir: 'rtl' },
  { key: 'seo_description_en', labelKey: 'settings.seoDescEn' },
  { key: 'seo_description_ar', labelKey: 'settings.seoDescAr', dir: 'rtl' },
];

interface SettingsFormProps {
  initialSettings: SiteSettings | null;
}

export default function SettingsForm({ initialSettings }: SettingsFormProps) {
  const supabase = createClient();
  const { t } = useAdminI18n();
  const [form, setForm] = useState<Omit<SiteSettings, 'id'>>(
    initialSettings
      ? (({ id, ...rest }) => rest)(initialSettings)
      : {} as Omit<SiteSettings, 'id'>
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update(key: keyof Omit<SiteSettings, 'id'>, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    if (!initialSettings?.id) return;
    setSaving(true);
    setError(null);

    const { error: dbErr } = await supabase
      .from('site_settings')
      .update(form)
      .eq('id', initialSettings.id);

    if (dbErr) {
      setError(dbErr.message);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  }

  if (!initialSettings) {
    return <p className="text-red-600 text-sm">{t('settings.noSettings')}</p>;
  }

  return (
    <div className="max-w-3xl space-y-4">
      {FIELDS.map(({ key, labelKey, dir }) => (
        <div key={key} className="bg-white border border-navy/10 rounded-xl p-4">
          <Label className="text-xs text-navy/60 mb-2 block">{t(labelKey)}</Label>
          <Input
            value={(form[key] as string) ?? ''}
            onChange={(e) => update(key, e.target.value)}
            dir={dir}
          />
        </div>
      ))}

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
      )}

      <div className="flex items-center gap-3 pt-2">
        <Button onClick={handleSave} disabled={saving} size="lg">
          <Save size={16} className="mr-2" />
          {saving ? t('form.saving') : t('settings.saveSettings')}
        </Button>
        {saved && (
          <span className="flex items-center gap-1.5 text-green-600 text-sm">
            <CheckCircle size={15} /> {t('settings.saved')}
          </span>
        )}
      </div>
    </div>
  );
}
