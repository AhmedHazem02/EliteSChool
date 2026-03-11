'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAdminI18n } from '@/components/admin/AdminI18nProvider';
import BilingualInput from './BilingualInput';
import SettingsMediaField from './SettingsMediaField';
import { STORAGE_BUCKETS, FILE_SIZE_LIMITS } from '@/lib/constants';
import { Save, CheckCircle, Plus, Trash2 } from 'lucide-react';
import { savePageContent } from '@/app/actions/content';

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

interface Highlight { en: string; ar: string }

function parseHighlights(extra_data: unknown): Highlight[] {
  if (extra_data && typeof extra_data === 'object' && Array.isArray((extra_data as Record<string, unknown>).highlights)) {
    return (extra_data as { highlights: Highlight[] }).highlights;
  }
  return [
    { en: 'Founded in 1999 with a legacy of academic excellence', ar: 'تأسست عام 1999 بإرث من التميز الأكاديمي' },
    { en: 'Multiple international curricula in one campus', ar: 'مناهج دولية متعددة في حرم واحد' },
    { en: 'State-of-the-art facilities and modern classrooms', ar: 'مرافق حديثة وفصول دراسية متطورة' },
    { en: 'Holistic development: academic, social & emotional', ar: 'تنمية شاملة: أكاديمية واجتماعية وعاطفية' },
  ];
}

function parseAboutExtra(extra_data: unknown) {
  if (extra_data && typeof extra_data === 'object') {
    const d = extra_data as Record<string, unknown>;
    return {
      founded_year: typeof d.founded_year === 'string' ? d.founded_year : '1999',
      est_label: typeof d.est_label === 'string' ? d.est_label : 'Est.',
    };
  }
  return { founded_year: '1999', est_label: 'Est.' };
}

function parseAboutMissionVision(extra_data: unknown) {
  if (extra_data && typeof extra_data === 'object') {
    const d = extra_data as Record<string, unknown>;
    return {
      mission_en: typeof d.mission_en === 'string' ? d.mission_en : '',
      mission_ar: typeof d.mission_ar === 'string' ? d.mission_ar : '',
      vision_en: typeof d.vision_en === 'string' ? d.vision_en : '',
      vision_ar: typeof d.vision_ar === 'string' ? d.vision_ar : '',
      section_subtitle_en: typeof d.section_subtitle_en === 'string' ? d.section_subtitle_en : '',
      section_subtitle_ar: typeof d.section_subtitle_ar === 'string' ? d.section_subtitle_ar : '',
    };
  }
  return { mission_en: '', mission_ar: '', vision_en: '', vision_ar: '', section_subtitle_en: '', section_subtitle_ar: '' };
}

export default function ContentEditor({ section, initialData }: ContentEditorProps) {
  const { t } = useAdminI18n();
  const isAbout = section === 'about';

  const [titleEn, setTitleEn] = useState(initialData?.title_en ?? '');
  const [titleAr, setTitleAr] = useState(initialData?.title_ar ?? '');
  const [subtitleEn, setSubtitleEn] = useState(initialData?.subtitle_en ?? '');
  const [subtitleAr, setSubtitleAr] = useState(initialData?.subtitle_ar ?? '');
  const [contentEn, setContentEn] = useState(stringify(initialData?.content_en));
  const [contentAr, setContentAr] = useState(stringify(initialData?.content_ar));
  const [imageUrl, setImageUrl] = useState(initialData?.image_url ?? '');
  const [extraData, setExtraData] = useState(stringify(initialData?.extra_data));

  // About section: dedicated highlights editor
  const [highlights, setHighlights] = useState<Highlight[]>(() =>
    isAbout ? parseHighlights(initialData?.extra_data) : []
  );
  const [foundedYear, setFoundedYear] = useState(() =>
    isAbout ? parseAboutExtra(initialData?.extra_data).founded_year : ''
  );
  const [estLabel, setEstLabel] = useState(() =>
    isAbout ? parseAboutExtra(initialData?.extra_data).est_label : ''
  );
  const [missionEn, setMissionEn] = useState(() =>
    isAbout ? parseAboutMissionVision(initialData?.extra_data).mission_en : ''
  );
  const [missionAr, setMissionAr] = useState(() =>
    isAbout ? parseAboutMissionVision(initialData?.extra_data).mission_ar : ''
  );
  const [visionEn, setVisionEn] = useState(() =>
    isAbout ? parseAboutMissionVision(initialData?.extra_data).vision_en : ''
  );
  const [visionAr, setVisionAr] = useState(() =>
    isAbout ? parseAboutMissionVision(initialData?.extra_data).vision_ar : ''
  );
  const [sectionSubtitleEn, setSectionSubtitleEn] = useState(() =>
    isAbout ? parseAboutMissionVision(initialData?.extra_data).section_subtitle_en : ''
  );
  const [sectionSubtitleAr, setSectionSubtitleAr] = useState(() =>
    isAbout ? parseAboutMissionVision(initialData?.extra_data).section_subtitle_ar : ''
  );

  const [showAboutImage, setShowAboutImage] = useState<boolean>(() => {
    if (!isAbout) return true;
    const ex = initialData?.extra_data;
    if (ex && typeof ex === 'object') {
      const v = (ex as Record<string, unknown>).show_about_image;
      if (typeof v === 'boolean') return v;
    }
    return true; // default: show
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function addHighlight() {
    setHighlights((prev) => [...prev, { en: '', ar: '' }]);
  }

  function removeHighlight(index: number) {
    setHighlights((prev) => prev.filter((_, i) => i !== index));
  }

  function updateHighlight(index: number, field: 'en' | 'ar', value: string) {
    setHighlights((prev) => prev.map((h, i) => (i === index ? { ...h, [field]: value } : h)));
  }

  async function handleSave() {
    setSaving(true);
    setError(null);

    let parsedExtra: unknown;
    if (isAbout) {
      parsedExtra = { highlights, founded_year: foundedYear, est_label: estLabel, show_about_image: showAboutImage, mission_en: missionEn, mission_ar: missionAr, vision_en: visionEn, vision_ar: visionAr, section_subtitle_en: sectionSubtitleEn, section_subtitle_ar: sectionSubtitleAr };
    } else {
      try { parsedExtra = JSON.parse(extraData); } catch { parsedExtra = extraData; }
    }

    const result = await savePageContent({
      id: initialData?.id,
      section_key: section,
      title_en: titleEn || null,
      title_ar: titleAr || null,
      subtitle_en: subtitleEn || null,
      subtitle_ar: subtitleAr || null,
      content_en: contentEn || null,
      content_ar: contentAr || null,
      image_url: imageUrl || null,
      extra_data: parsedExtra,
    });

    if (!result.success) {
      setError(result.error ?? 'Save failed');
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
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

      {/* Section Image — hidden for about (has its own dedicated field below) */}
      {!isAbout && (
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
      )}

      {/* Extra Data: highlights editor for about, raw JSON for others */}
      {isAbout ? (
        <div className="space-y-6">
          {/* Dedicated About image with homepage toggle */}
          <div className="rounded-2xl border border-gold/20 bg-gold/[0.03] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-navy">صورة قسم &ldquo;من نحن&rdquo;</p>
                <p className="text-xs text-navy/50 mt-0.5">الصورة التي تظهر في الـ Landing Page</p>
              </div>
              {/* Toggle: show on homepage */}
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <span className="text-xs font-medium text-navy/70">
                  {showAboutImage ? 'ظاهرة في الـ Home' : 'مخفية من الـ Home'}
                </span>
                <button
                  type="button"
                  onClick={() => setShowAboutImage((v) => !v)}
                  className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gold/50 ${
                    showAboutImage ? 'bg-gold border-gold' : 'bg-navy/20 border-navy/20'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 mt-0.5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
                      showAboutImage ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </label>
            </div>
            <SettingsMediaField
              label="ارفع صورة القسم"
              value={imageUrl}
              onChange={setImageUrl}
              bucket={STORAGE_BUCKETS.GALLERY_IMAGES}
              mediaType="image"
              maxSize={FILE_SIZE_LIMITS.IMAGE}
              hint="تُعرض في Landing Page بجانب النص — الأبعاد المثالية: 800×600"
            />
          </div>

          {/* Section subtitle */}
          <div className="rounded-2xl border border-navy/10 bg-navy/[0.02] p-5 space-y-4">
            <p className="text-sm font-semibold text-navy">نص تحت عنوان &ldquo;رسالتنا ورؤيتنا&rdquo;</p>
            <BilingualInput
              labelEn="Section subtitle (English)"
              labelAr="النص التعريفي (عربي)"
              valueEn={sectionSubtitleEn}
              valueAr={sectionSubtitleAr}
              onChangeEn={setSectionSubtitleEn}
              onChangeAr={setSectionSubtitleAr}
            />
          </div>

          {/* Mission & Vision */}
          <div className="rounded-2xl border border-navy/10 bg-navy/[0.02] p-5 space-y-4">
            <p className="text-sm font-semibold text-navy">الرسالة — Mission</p>
            <BilingualInput
              labelEn="Mission (English)"
              labelAr="الرسالة (عربي)"
              valueEn={missionEn}
              valueAr={missionAr}
              onChangeEn={setMissionEn}
              onChangeAr={setMissionAr}
              multiline
              rows={3}
            />
          </div>

          <div className="rounded-2xl border border-gold/20 bg-gold/[0.03] p-5 space-y-4">
            <p className="text-sm font-semibold text-navy">الرؤية — Vision</p>
            <BilingualInput
              labelEn="Vision (English)"
              labelAr="الرؤية (عربي)"
              valueEn={visionEn}
              valueAr={visionAr}
              onChangeEn={setVisionEn}
              onChangeAr={setVisionAr}
              multiline
              rows={3}
            />
          </div>

          {/* Year badge fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <p className="text-sm font-medium text-navy">Founded Year</p>
              <Input
                value={foundedYear}
                onChange={(e) => setFoundedYear(e.target.value)}
                placeholder="e.g. 1999"
                dir="ltr"
              />
            </div>
            <div className="space-y-1.5">
              <p className="text-sm font-medium text-navy">Badge Label</p>
              <Input
                value={estLabel}
                onChange={(e) => setEstLabel(e.target.value)}
                placeholder="e.g. Est."
                dir="ltr"
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-navy">Highlights (bullet points)</p>
            <Button type="button" variant="outline" size="sm" onClick={addHighlight}>
              <Plus size={14} className="mr-1" /> Add
            </Button>
          </div>
          <div className="space-y-3">
            {highlights.map((h, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-2 p-3 rounded-xl border border-navy/10 bg-navy/[0.02] relative">
                <Input
                  value={h.en}
                  onChange={(e) => updateHighlight(i, 'en', e.target.value)}
                  placeholder={`English highlight ${i + 1}`}
                  dir="ltr"
                />
                <Input
                  value={h.ar}
                  onChange={(e) => updateHighlight(i, 'ar', e.target.value)}
                  placeholder={`النص العربي ${i + 1}`}
                  dir="rtl"
                />
                <button
                  type="button"
                  onClick={() => removeHighlight(i)}
                  className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-100 hover:bg-red-200 text-red-500 flex items-center justify-center transition-colors"
                  aria-label="Remove highlight"
                >
                  <Trash2 size={11} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-1.5">
          <p className="text-sm font-medium text-navy">{t('form.extraData')}</p>
          <textarea
            value={extraData}
            onChange={(e) => setExtraData(e.target.value)}
            rows={10}
            aria-label={t('form.extraData')}
            className="w-full rounded-xl border border-navy/10 p-3 font-mono text-sm resize-y focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all"
            dir="ltr"
          />
        </div>
      )}

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
