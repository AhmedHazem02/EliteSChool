'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAdminI18n } from '@/components/admin/AdminI18nProvider';
import BilingualInput from './BilingualInput';
import { Save, Trash2 } from 'lucide-react';
import { slugify } from '@/lib/utils';

interface PostData {
  id?: string;
  title_en?: string;
  title_ar?: string;
  content_en?: string;
  content_ar?: string;
  type?: string;
  thumbnail_url?: string;
  is_published?: boolean;
  slug?: string;
}

interface PostFormProps {
  initialData?: PostData;
}

export default function PostForm({ initialData }: PostFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const { t } = useAdminI18n();

  const [titleEn, setTitleEn] = useState(initialData?.title_en ?? '');
  const [titleAr, setTitleAr] = useState(initialData?.title_ar ?? '');
  const [contentEn, setContentEn] = useState(initialData?.content_en ?? '');
  const [contentAr, setContentAr] = useState(initialData?.content_ar ?? '');
  const [category, setCategory] = useState(initialData?.type ?? 'news');
  const [imageUrl, setImageUrl] = useState(initialData?.thumbnail_url ?? '');
  const [published, setPublished] = useState(initialData?.is_published ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setError(null);

    const payload = {
      title_en: titleEn,
      title_ar: titleAr,
      content_en: contentEn,
      content_ar: contentAr,
      type: category || 'news',
      thumbnail_url: imageUrl || null,
      is_published: published,
      slug: initialData?.slug ?? slugify(titleEn),
    };

    const { error: dbError } = initialData?.id
      ? await supabase.from('posts').update(payload).eq('id', initialData.id)
      : await supabase.from('posts').insert(payload);

    if (dbError) {
      setError(dbError.message);
      setSaving(false);
      return;
    }

    router.push('/admin/posts');
    router.refresh();
  }

  async function handleDelete() {
    if (!initialData?.id) return;
    if (!confirm(t('form.deletePostConfirm'))) return;
    await supabase.from('posts').delete().eq('id', initialData.id);
    router.push('/admin/posts');
    router.refresh();
  }

  return (
    <div className="max-w-4xl space-y-6">
      <BilingualInput
        labelEn={t('form.titleEn')} labelAr={t('form.titleAr')}
        valueEn={titleEn} valueAr={titleAr}
        onChangeEn={setTitleEn} onChangeAr={setTitleAr}
        required
      />

      <BilingualInput
        labelEn={t('form.contentEn')} labelAr={t('form.contentAr')}
        valueEn={contentEn} valueAr={contentAr}
        onChangeEn={setContentEn} onChangeAr={setContentAr}
        multiline rows={10}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>{t('form.type')}</Label>
          <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="news or event" />
        </div>
        <div className="space-y-1.5">
          <Label>{t('form.imageUrl')}</Label>
          <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://…" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="published"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
          className="w-4 h-4 accent-gold"
        />
        <Label htmlFor="published">{t('form.publishedVisible')}</Label>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
      )}

      <div className="flex items-center gap-3">
        <Button onClick={handleSave} disabled={saving} size="lg">
          <Save size={16} className="mr-2" />
          {saving ? t('form.saving') : t('form.savePost')}
        </Button>
        {initialData?.id && (
          <Button onClick={handleDelete} variant="outline" size="lg" className="text-red-600 border-red-200 hover:bg-red-50">
            <Trash2 size={16} className="mr-2" /> {t('form.delete')}
          </Button>
        )}
      </div>
    </div>
  );
}
