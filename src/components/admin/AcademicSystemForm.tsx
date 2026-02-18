'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import BilingualInput from './BilingualInput';
import FeesManager from './FeesManager';
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
  const supabase = createClient();

  const [nameEn, setNameEn] = useState(initialData?.title_en ?? '');
  const [nameAr, setNameAr] = useState(initialData?.title_ar ?? '');
  const [descEn, setDescEn] = useState(initialData?.description_en ?? '');
  const [descAr, setDescAr] = useState(initialData?.description_ar ?? '');
  const [isActive, setIsActive] = useState(initialData?.is_active ?? true);
  const [sortOrder, setSortOrder] = useState(String(initialData?.sort_order ?? 0));
  const [fees, setFees] = useState<FeeRow[]>(initialFees);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setError(null);

    const payload = {
      title_en: nameEn, title_ar: nameAr,
      description_en: descEn, description_ar: descAr,
      is_active: isActive, sort_order: parseInt(sortOrder, 10),
    };

    let systemId = initialData?.id;

    if (systemId) {
      const { error: dbErr } = await supabase.from('academic_systems').update(payload).eq('id', systemId);
      if (dbErr) { setError(dbErr.message); setSaving(false); return; }
    } else {
      const { data, error: dbErr } = await supabase.from('academic_systems').insert(payload).select('id').single();
      if (dbErr || !data) { setError(dbErr?.message ?? 'Insert failed'); setSaving(false); return; }
      systemId = data.id;
    }

    // Sync fees: delete all existing, re-insert
    await supabase.from('tuition_fees').delete().eq('system_id', systemId);
    if (fees.length > 0) {
      const feePayloads = fees.map((f, i) => ({
        system_id: systemId,
        grade_level_en: f.grade_level_en,
        grade_level_ar: f.grade_level_ar,
        fee_amount: f.fee_amount,
        currency: f.currency || 'EGP',
        notes_en: f.notes_en ?? null,
        notes_ar: f.notes_ar ?? null,
        sort_order: i,
      }));
      await supabase.from('tuition_fees').insert(feePayloads);
    }

    router.push('/admin/academic-systems');
    router.refresh();
  }

  async function handleDelete() {
    if (!initialData?.id) return;
    if (!confirm('Delete this system and all its fees?')) return;
    await supabase.from('academic_systems').delete().eq('id', initialData.id);
    router.push('/admin/academic-systems');
    router.refresh();
  }

  return (
    <div className="max-w-4xl space-y-6">
      <BilingualInput
        labelEn="System Name (EN)" labelAr="System Name (AR)"
        valueEn={nameEn} valueAr={nameAr}
        onChangeEn={setNameEn} onChangeAr={setNameAr}
        required
      />
      <BilingualInput
        labelEn="Description (EN)" labelAr="Description (AR)"
        valueEn={descEn} valueAr={descAr}
        onChangeEn={setDescEn} onChangeAr={setDescAr}
        multiline rows={4}
      />

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Sort Order</Label>
          <Input type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} min={0} />
        </div>
        <div className="flex items-center gap-2 mt-6">
          <input type="checkbox" id="active" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="w-4 h-4 accent-gold" />
          <Label htmlFor="active">Active (visible on public site)</Label>
        </div>
      </div>

      <div>
        <h3 className="text-base font-semibold text-navy mb-3">Tuition Fees</h3>
        <FeesManager fees={fees} onChange={setFees} />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
      )}

      <div className="flex items-center gap-3">
        <Button onClick={handleSave} disabled={saving} size="lg">
          <Save size={16} className="mr-2" />
          {saving ? 'Saving…' : 'Save System'}
        </Button>
        {initialData?.id && (
          <Button onClick={handleDelete} variant="outline" size="lg" className="text-red-600 border-red-200 hover:bg-red-50">
            <Trash2 size={16} className="mr-2" /> Delete
          </Button>
        )}
      </div>
    </div>
  );
}
