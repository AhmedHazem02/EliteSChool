'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';
import BilingualInput from './BilingualInput';
import { Save, CheckCircle } from 'lucide-react';

interface ContentEditorProps {
  section: string;
  initialData: { id: string; section: string; content_en: unknown; content_ar: unknown } | null;
}

export default function ContentEditor({ section, initialData }: ContentEditorProps) {
  const supabase = createClient();
  const [contentEn, setContentEn] = useState(
    typeof initialData?.content_en === 'string'
      ? initialData.content_en
      : JSON.stringify(initialData?.content_en ?? {}, null, 2)
  );
  const [contentAr, setContentAr] = useState(
    typeof initialData?.content_ar === 'string'
      ? initialData.content_ar
      : JSON.stringify(initialData?.content_ar ?? {}, null, 2)
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setError(null);

    let parsedEn: unknown = contentEn;
    let parsedAr: unknown = contentAr;

    try { parsedEn = JSON.parse(contentEn); } catch { /* keep as string */ }
    try { parsedAr = JSON.parse(contentAr); } catch { /* keep as string */ }

    const payload = { section, content_en: parsedEn, content_ar: parsedAr };

    const { error: dbError } = initialData?.id
      ? await supabase.from('page_content').update(payload).eq('id', initialData.id)
      : await supabase.from('page_content').insert(payload);

    if (dbError) {
      setError(dbError.message);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      // Trigger ISR revalidation
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
      <BilingualInput
        labelEn="English Content (JSON or text)"
        labelAr="Arabic Content (JSON or text)"
        valueEn={contentEn}
        valueAr={contentAr}
        onChangeEn={setContentEn}
        onChangeAr={setContentAr}
        multiline
        rows={16}
        dir="ltr"
        dirAr="rtl"
      />

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
      )}

      <div className="flex items-center gap-3">
        <Button onClick={handleSave} disabled={saving} size="lg">
          {saving ? 'Saving…' : (
            <span className="flex items-center gap-2">
              <Save size={16} /> Save Changes
            </span>
          )}
        </Button>
        {saved && (
          <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
            <CheckCircle size={16} /> Saved successfully
          </span>
        )}
      </div>
    </div>
  );
}
