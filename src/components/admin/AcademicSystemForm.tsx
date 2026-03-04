'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAdminI18n } from '@/components/admin/AdminI18nProvider';
import BilingualInput from './BilingualInput';
import { saveAcademicSystem, deleteAcademicSystem } from '@/app/actions/admin';
import FeesManager from './FeesManager';
import SettingsMediaField from './SettingsMediaField';
import { STORAGE_BUCKETS, FILE_SIZE_LIMITS } from '@/lib/constants';
import { Save, Trash2 } from 'lucide-react';

interface FeeRow {
  id?: string;
  grade_level_en: string;
  grade_level_ar: string;
  fee_amount: number;
  currency: string;
  notes_en?: string;
  notes_ar?: string;
}

interface SystemData {
  id?: string;
  title_en?: string;
  title_ar?: string;
  description_en?: string;
  description_ar?: string;
  hero_image_url?: string | null;
  features_en?: unknown;
  features_ar?: unknown;
  is_active?: boolean;
  sort_order?: number;
}

interface Props {
  initialData?: SystemData;
  fees: FeeRow[];
}

export default function AcademicSystemForm({ initialData, fees: initialFees }: Props) {
  const router = useRouter();
  const { t } = useAdminI18n();

  // Convert stored JSONB string array to newline-separated text
  function arrayToText(val: unknown): string {
    if (Array.isArray(val)) return (val as string[]).join('\n');
    return '';
  }

  const [nameEn, setNameEn] = useState(initialData?.title_en ?? '');
  const [nameAr, setNameAr] = useState(initialData?.title_ar ?? '');
  const [descEn, setDescEn] = useState(initialData?.description_en ?? '');
  const [descAr, setDescAr] = useState(initialData?.description_ar ?? '');
  const [heroImageUrl, setHeroImageUrl] = useState(initialData?.hero_image_url ?? '');
  const [featuresEn, setFeaturesEn] = useState(arrayToText(initialData?.features_en));
  const [featuresAr, setFeaturesAr] = useState(arrayToText(initialData?.features_ar));
  const [isActive, setIsActive] = useState(initialData?.is_active ?? true);
  const [sortOrder, setSortOrder] = useState(String(initialData?.sort_order ?? 0));
  const [fees, setFees] = useState<FeeRow[]>(initialFees);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setError(null);

    // Convert textarea lines to string arrays, removing empty lines
    const toArray = (text: string) =>
      text.split('\n').map((l) => l.trim()).filter(Boolean);

    const payload = {
      title_en: nameEn, title_ar: nameAr,
      description_en: descEn, description_ar: descAr,
      hero_image_url: heroImageUrl || null,
      features_en: toArray(featuresEn),
      features_ar: toArray(featuresAr),
      is_active: isActive, sort_order: parseInt(sortOrder, 10),
      slug: initialData?.id ? undefined : (
        nameEn.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '') || `system-${Date.now()}`
      ),
    };

    const feePayloads = fees.map((f, i) => ({
      grade_level_en: f.grade_level_en,
      grade_level_ar: f.grade_level_ar,
      fee_amount: f.fee_amount,
      currency: f.currency || 'EGP',
      notes_en: f.notes_en ?? null,
      notes_ar: f.notes_ar ?? null,
      sort_order: i,
    }));

    const result = await saveAcademicSystem(initialData?.id, payload, feePayloads);
    if (!result.success) { setError(result.error ?? 'Save failed'); setSaving(false); return; }

    router.push('/admin/academic-systems');
    router.refresh();
  }

  async function handleDelete() {
    if (!initialData?.id) return;
    if (!confirm(t('form.deleteSystemConfirm'))) return;
    await deleteAcademicSystem(initialData.id);
    router.push('/admin/academic-systems');
    router.refresh();
  }

  return (
    <div className="max-w-4xl space-y-6">
      <BilingualInput
        labelEn={t('form.systemNameEn')} labelAr={t('form.systemNameAr')}
        valueEn={nameEn} valueAr={nameAr}
        onChangeEn={setNameEn} onChangeAr={setNameAr}
        required
      />
      <BilingualInput
        labelEn={t('form.descriptionEn')} labelAr={t('form.descriptionAr')}
        valueEn={descEn} valueAr={descAr}
        onChangeEn={setDescEn} onChangeAr={setDescAr}
        multiline rows={4}
      />

      <div className="max-w-sm">
        <SettingsMediaField
          label={t('form.heroImage')}
          value={heroImageUrl}
          onChange={setHeroImageUrl}
          bucket={STORAGE_BUCKETS.SYSTEM_IMAGES}
          mediaType="image"
          maxSize={FILE_SIZE_LIMITS.IMAGE}
          hint="Hero image for this academic system's page"
        />
      </div>

      {/* Features */}
      <div className="space-y-4">
        <p className="text-sm font-semibold text-navy">{t('form.features')}</p>
        <p className="text-xs text-navy/50 -mt-2">{t('form.featuresHint')}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>{t('form.featuresEn')}</Label>
            <textarea
              value={featuresEn}
              onChange={(e) => setFeaturesEn(e.target.value)}
              rows={6}
              dir="ltr"
              placeholder="SAT/ACT Preparation&#10;US Common Core Standards&#10;STEM Focus"
              className="w-full rounded-xl border border-navy/10 p-3 text-sm resize-y focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all font-sans"
            />
          </div>
          <div className="space-y-1.5">
            <Label>{t('form.featuresAr')}</Label>
            <textarea
              value={featuresAr}
              onChange={(e) => setFeaturesAr(e.target.value)}
              rows={6}
              dir="rtl"
              placeholder="تحضير SAT/ACT&#10;معايير Common Core الأمريكية&#10;تركيز على STEM"
              className="w-full rounded-xl border border-navy/10 p-3 text-sm resize-y focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all font-sans"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>{t('form.sortOrder')}</Label>
          <Input type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} min={0} />
        </div>
        <div className="flex items-center gap-2 mt-6">
          <input type="checkbox" id="active" title={t('form.activeVisible')} checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="w-4 h-4 accent-gold" />
          <Label htmlFor="active">{t('form.activeVisible')}</Label>
        </div>
      </div>

      <div>
        <h3 className="text-base font-semibold text-navy mb-3">{t('form.tuitionFees')}</h3>
        <FeesManager fees={fees} onChange={setFees} />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
      )}

      <div className="flex items-center gap-3">
        <Button onClick={handleSave} disabled={saving} size="lg">
          <Save size={16} className="mr-2" />
          {saving ? t('form.saving') : t('form.saveSystem')}
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
