'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, CheckCircle } from 'lucide-react';

interface SettingRow {
  id: string;
  key: string;
  value_en: string | null;
  value_ar: string | null;
  value_json: unknown;
}

interface SettingsFormProps {
  initialSettings: SettingRow[];
}

export default function SettingsForm({ initialSettings }: SettingsFormProps) {
  const supabase = createClient();
  const [settings, setSettings] = useState(initialSettings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update(id: string, field: 'value_en' | 'value_ar', value: string) {
    setSettings((prev) => prev.map((s) => s.id === id ? { ...s, [field]: value } : s));
  }

  async function handleSave() {
    setSaving(true);
    setError(null);

    for (const s of settings) {
      const { error: dbErr } = await supabase
        .from('site_settings')
        .update({ value_en: s.value_en, value_ar: s.value_ar })
        .eq('id', s.id);
      if (dbErr) { setError(dbErr.message); setSaving(false); return; }
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    setSaving(false);
  }

  return (
    <div className="max-w-3xl space-y-4">
      {settings.map((s) => (
        <div key={s.id} className="bg-white border border-navy/10 rounded-xl p-4">
          <p className="text-xs font-mono text-navy/40 mb-3">{s.key}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">English</Label>
              <Input value={s.value_en ?? ''} onChange={(e) => update(s.id, 'value_en', e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Arabic</Label>
              <Input value={s.value_ar ?? ''} onChange={(e) => update(s.id, 'value_ar', e.target.value)} dir="rtl" />
            </div>
          </div>
        </div>
      ))}

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
      )}

      <div className="flex items-center gap-3">
        <Button onClick={handleSave} disabled={saving} size="lg">
          <Save size={16} className="mr-2" />
          {saving ? 'Saving…' : 'Save Settings'}
        </Button>
        {saved && (
          <span className="flex items-center gap-1.5 text-green-600 text-sm">
            <CheckCircle size={15} /> Saved!
          </span>
        )}
      </div>
    </div>
  );
}
