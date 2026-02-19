'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { useAdminI18n } from '@/components/admin/AdminI18nProvider';
import BilingualInput from './BilingualInput';
import SettingsMediaField from './SettingsMediaField';
import { STORAGE_BUCKETS, FILE_SIZE_LIMITS } from '@/lib/constants';
import { Save, CheckCircle } from 'lucide-react';

interface ContentData {
  id: string;
  section_key: string;
  title_en: string | null;
  title_ar: string | null;
  subtitle_en: string | null;
  subtitle_ar: string | null;
  content_en: unknown;
  content_ar: unknown;
  image_url: string | null;
  extra_data: unknown;
}

interface ContentEditorProps {
  section: string;
  initialData: ContentData | null;
}

function stringify(val: unknown): string {
  if (typeof val === 'string') return val;
  return JSON.stringify(val ?? '', null, 2);
}

export default function ContentEditor({ section, initialData }: ContentEditorProps) {
  const supabase = createClient();
  const { t } = useAdminI18n();

  const [titleEn, setTitleEn] = useState(initialData?.title_en ?? '');
  const [titleAr, setTitleAr] = useState(initialData?.title_ar ?? '');
  const [subtitleEn, setSubtitleEn] = useState(initialData?.subtitle_en ?? '');
  const [subtitleAr, setSubtitleAr] = useState(initialData?.subtitle_ar ?? '');
  const [contentEn, setContentEn] = useState(stringify(initialData?.content_en));
  const [contentAr, setContentAr] = useState(stringify(initialData?.content_ar));
  const [imageUrl, setImageUrl] = useState(initialData?.image_url ?? '');
  const [extraData, setExtraData] = useState(stringify(initialData?.extra_data));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setError(null);

    let parsedExtra: unknown = extraData;
    try { parsedExtra = JSON.parse(extraData); } catch { /* keep as string */ }

    const payload = {
      section_key: section,
      title_en: titleEn || null,
      title_ar: titleAr || null,
      subtitle_en: subtitleEn || null,
      subtitle_ar: subtitleAr || null,
      content_en: contentEn || null,
      content_ar: contentAr || null,
      image_url: imageUrl || null,
      extra_data: parsedExtra,
    };

    const { error: dbError } = initialData?.id
      ? await supabase.from('page_content').update(payload).eq('id', initialData.id)
      : await supabase.from('page_content').insert(payload);

    if (dbError) {
      setError(dbError.message);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      await fetch('/api/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret: process.env.NEXT_PUBLIC_REVALIDATION_SECRET, tag: section }),
      }).catch(() => null);
    }

    setSaving(false);
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* Title */}
      <BilingualInput
        labelEn={t('form.titleEn')}
        labelAr={t('form.titleAr')}
        valueEn={titleEn}
        valueAr={titleAr}
        onChangeEn={setTitleEn}
        onChangeAr={setTitleAr}
      />

      {/* Subtitle */}
      <BilingualInput
        labelEn={t('form.subtitleEn')}
        labelAr={t('form.subtitleAr')}
        valueEn={subtitleEn}
        valueAr={subtitleAr}
        onChangeEn={setSubtitleEn}
        onChangeAr={setSubtitleAr}
      />

      {/* Content */}
      <BilingualInput
        labelEn={t('form.contentEn')}
        labelAr={t('form.contentAr')}
        valueEn={contentEn}
        valueAr={contentAr}
        onChangeEn={setContentEn}
        onChangeAr={setContentAr}
        multiline
        rows={8}
      />

      {/* Section Image */}
      <div className="max-w-sm">
        <SettingsMediaField
          label={t('form.sectionImage')}
          value={imageUrl}
          onChange={setImageUrl}
          bucket={STORAGE_BUCKETS.GALLERY_IMAGES}
          mediaType="image"
          maxSize={FILE_SIZE_LIMITS.IMAGE}
          hint="Image shown in this section (e.g. About page photo)"
        />
      </div>

      {/* Extra Data (JSON) */}
      <div className="space-y-1.5">
        <p className="text-sm font-medium text-navy">{t('form.extraData')}</p>
        <textarea
          value={extraData}
          onChange={(e) => setExtraData(e.target.value)}
          rows={10}
          className="w-full rounded-xl border border-navy/10 p-3 font-mono text-sm resize-y focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all"
          dir="ltr"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
      )}

      <div className="flex items-center gap-3">
        <Button onClick={handleSave} disabled={saving} size="lg">
          {saving ? t('form.saving') : (
            <span className="flex items-center gap-2">
              <Save size={16} /> {t('form.saveChanges')}
            </span>
          )}
        </Button>
        {saved && (
          <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
            <CheckCircle size={16} /> {t('form.savedSuccess')}
          </span>
        )}
      </div>
    </div>
  );
}
