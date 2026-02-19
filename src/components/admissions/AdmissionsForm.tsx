'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createClient } from '@/lib/supabase/client';
import { useRateLimit } from '@/hooks/useRateLimit';
import { CheckCircle, Send } from 'lucide-react';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import SectionHeader from '@/components/shared/SectionHeader';
import PageTransition from '@/components/shared/PageTransition';

interface Props {
  locale: string;
}

export default function AdmissionsClientPage({ locale }: Props) {
  const t = useTranslations('admissions');
  const isAR = locale === 'ar';
  const supabase = createClient();
  const { canSubmit } = useRateLimit();

  const [form, setForm] = useState({
    parent_name: '', student_name: '', phone: '', email: '',
    grade_level: '', selected_system: '', notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit()) {
      setError(isAR ? 'لقد تجاوزت الحد المسموح به. حاول لاحقاً.' : 'Too many submissions. Please try again later.');
      return;
    }

    setLoading(true);
    setError(null);

    const { error: dbError } = await supabase.from('admissions').insert({
      parent_name: form.parent_name,
      student_name: form.student_name,
      phone: form.phone,
      email: form.email || null,
      grade_level: form.grade_level || null,
      selected_system: (form.selected_system as 'American' | 'British' | null) || null,
      notes: form.notes || null,
    });

    if (dbError) {
      setError(dbError.message);
    } else {
      setSubmitted(true);
    }

    setLoading(false);
  }

  return (
    <PageTransition>
      <main>
        {/* Unified header — extends behind the fixed Navbar */}
        <section className="relative bg-navy text-white pt-28 pb-8 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-navy via-navy/95 to-navy/80 pointer-events-none" />
          <div className="container mx-auto px-4 relative z-10">
            <Breadcrumbs
              items={[
                { label: isAR ? 'القبول' : 'Admissions', href: `/${locale}/admissions` },
              ]}
              light
            />
            <h1 className="text-3xl md:text-4xl font-bold font-playfair mt-3">
              {t('page_title')}
            </h1>
          </div>
        </section>

        <section className="section-padding bg-off-white">
          <div className="container mx-auto px-4 max-w-2xl">
            {submitted ? (
              <div className="text-center py-16">
                <CheckCircle className="text-green-500 mx-auto mb-4" size={56} />
                <h2 className="text-2xl font-bold text-navy font-playfair mb-3">{t('success_title')}</h2>
                <p className="text-navy/60">{t('success_message')}</p>
              </div>
            ) : (
              <div className="bg-white rounded-3xl shadow-card p-8">
                <SectionHeader title={t('form_title')} subtitle={t('form_subtitle')} />

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label>{t('parent_name')} *</Label>
                      <Input value={form.parent_name} onChange={(e) => update('parent_name', e.target.value)} required />
                    </div>
                    <div className="space-y-1.5">
                      <Label>{t('student_name')} *</Label>
                      <Input value={form.student_name} onChange={(e) => update('student_name', e.target.value)} required />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label>{t('phone')} *</Label>
                      <Input type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} required />
                    </div>
                    <div className="space-y-1.5">
                      <Label>{t('email')}</Label>
                      <Input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label>{t('grade')} *</Label>
                      <Input value={form.grade_level} onChange={(e) => update('grade_level', e.target.value)} placeholder={isAR ? 'مثال: الصف الأول' : 'e.g. Grade 1'} required />
                    </div>
                    <div className="space-y-1.5">
                      <Label>{t('system')}</Label>
                      <Select onValueChange={(v) => update('selected_system', v)}>
                        <SelectTrigger><SelectValue placeholder={isAR ? 'اختر النظام' : 'Select system'} /></SelectTrigger>
                        <SelectContent>
                          {['British', 'American', 'Egyptian National'].map((s) => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label>{t('message')}</Label>
                    <Textarea value={form.notes} onChange={(e) => update('notes', e.target.value)} rows={4} placeholder={isAR ? 'أي استفسارات إضافية؟' : 'Any additional questions?'} />
                  </div>

                  {error && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
                  )}

                  <Button type="submit" size="lg" disabled={loading} className="w-full gap-2">
                    <Send size={16} />
                    {loading ? (isAR ? 'جارٍ الإرسال…' : 'Submitting…') : t('submit')}
                  </Button>
                </form>
              </div>
            )}
          </div>
        </section>
      </main>
    </PageTransition>
  );
}
