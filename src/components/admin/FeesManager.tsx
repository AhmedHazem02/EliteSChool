'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';

interface FeeRow {
  id?: string;
  grade_level_en: string;
  grade_level_ar: string;
  fee_amount: number;
  currency: string;
  notes_en?: string;
  notes_ar?: string;
}

interface FeesManagerProps {
  fees: FeeRow[];
  onChange: (fees: FeeRow[]) => void;
}

const emptyRow = (): FeeRow => ({
  grade_level_en: '', grade_level_ar: '',
  fee_amount: 0, currency: 'EGP',
  notes_en: '', notes_ar: '',
});

export default function FeesManager({ fees, onChange }: FeesManagerProps) {
  function update(i: number, key: keyof FeeRow, value: string | number) {
    const updated = fees.map((f, fi) => fi === i ? { ...f, [key]: value } : f);
    onChange(updated);
  }

  function remove(i: number) {
    onChange(fees.filter((_, fi) => fi !== i));
  }

  return (
    <div className="space-y-4">
      {fees.map((fee, i) => (
        <div key={i} className="bg-white border border-navy/10 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-navy/60">Row {i + 1}</span>
            <button onClick={() => remove(i)} className="text-red-400 hover:text-red-600 transition-colors">
              <Trash2 size={15} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Grade Level (EN)</Label>
              <Input value={fee.grade_level_en} onChange={(e) => update(i, 'grade_level_en', e.target.value)} placeholder="e.g. Primary (Grades 1-5)" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Grade Level (AR)</Label>
              <Input value={fee.grade_level_ar} onChange={(e) => update(i, 'grade_level_ar', e.target.value)} placeholder="الابتدائي" dir="rtl" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Fee Amount</Label>
              <Input type="number" value={fee.fee_amount} onChange={(e) => update(i, 'fee_amount', parseFloat(e.target.value) || 0)} min={0} step={500} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Currency</Label>
              <Input value={fee.currency} onChange={(e) => update(i, 'currency', e.target.value)} placeholder="EGP" />
            </div>
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onChange([...fees, emptyRow()])}
        className="gap-1.5"
      >
        <Plus size={15} /> Add Grade Level
      </Button>
    </div>
  );
}
