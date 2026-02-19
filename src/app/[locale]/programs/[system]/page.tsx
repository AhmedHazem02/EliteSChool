import { createClient } from '@/lib/supabase/server';
import { buildMetadata } from '@/lib/seo';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import SectionHeader from '@/components/shared/SectionHeader';
import ScrollReveal from '@/components/shared/ScrollReveal';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import CTASection from '@/components/sections/CTASection';
import ResponsiveTable from '@/components/shared/ResponsiveTable';
import PageTransition from '@/components/shared/PageTransition';
import { formatCurrency } from '@/lib/utils';
import { CheckCircle } from 'lucide-react';
import type { TableColumn } from '@/components/shared/ResponsiveTable';

interface FeeRow {
  id: string;
  grade_level_en: string;
  grade_level_ar: string;
  fee_amount: number;
  currency: string;
  notes_en: string | null;
  notes_ar: string | null;
}

interface Props {
  params: Promise<{ locale: string; system: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale, system: systemId } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from('academic_systems')
    .select('title_en, title_ar')
    .eq('id', systemId)
    .single();

  const name = locale === 'ar' ? (data?.title_ar ?? '') : (data?.title_en ?? '');
  return buildMetadata({ title: name, description: name, path: `/${locale}/programs/${systemId}`, locale });
}

export default async function SystemPage({ params }: Props) {
  const { locale, system: systemId } = await params;
  const isAR = locale === 'ar';
  const supabase = await createClient();

  const [sysRes, feesRes] = await Promise.all([
    supabase.from('academic_systems').select('id, title_en, title_ar, description_en, description_ar, features_en, features_ar').eq('id', systemId).single(),
    supabase.from('tuition_fees').select('id, grade_level_en, grade_level_ar, fee_amount, currency, notes_en, notes_ar').eq('system_id', systemId).order('sort_order'),
  ]);

  if (!sysRes.data) notFound();

  const sys = sysRes.data;
  const fees = (feesRes.data ?? []) as FeeRow[];
  const name = isAR ? sys.title_ar : sys.title_en;
  const desc = isAR ? sys.description_ar : sys.description_en;
  const featuresRaw = isAR ? sys.features_ar : sys.features_en;
  const features: string[] = Array.isArray(featuresRaw) ? (featuresRaw as string[]) : [];

  const feeColumns: TableColumn<FeeRow>[] = [
    { key: isAR ? 'grade_level_ar' : 'grade_level_en', label: isAR ? 'المرحلة الدراسية' : 'Grade Level' },
    { key: 'fee_amount', label: isAR ? 'الرسوم السنوية' : 'Annual Fee', render: (r) => `${formatCurrency(r.fee_amount)} ${r.currency}` },
    ...(fees.some(f => f.notes_en || f.notes_ar) ? [{
      key: (isAR ? 'notes_ar' : 'notes_en') as keyof FeeRow,
      label: isAR ? 'ملاحظات' : 'Notes',
    }] : []),
  ];

  return (
    <PageTransition>
      <main>
        <div className="bg-navy text-white py-24">
          <div className="container mx-auto px-4 text-center">
            <Breadcrumbs
              items={[
                { label: isAR ? 'البرامج' : 'Programs', href: `/${locale}/programs` },
                { label: name ?? '', href: `/${locale}/programs/${systemId}` },
              ]}
              light
            />
            <h1 className="text-4xl md:text-5xl font-bold font-playfair mt-6">{name}</h1>
          </div>
        </div>

        {/* Description */}
        {desc && (
          <section className="section-padding bg-white">
            <div className="container mx-auto px-4 max-w-3xl">
              <p className="text-navy/70 text-lg leading-relaxed text-center">{desc}</p>

              {features.length > 0 && (
                <ul className="mt-8 space-y-3">
                  {features.map((f, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle className="text-gold shrink-0" size={18} />
                      <span className="text-navy/70">{f}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        )}

        {/* Fees table */}
        {fees.length > 0 && (
          <section className="section-padding bg-off-white">
            <div className="container mx-auto px-4">
              <SectionHeader
                title={isAR ? 'الرسوم الدراسية' : 'Tuition Fees'}
                subtitle={isAR ? 'الرسوم للعام الدراسي الحالي' : 'Fees for the current academic year'}
              />
              <div className="mt-8 max-w-4xl mx-auto">
                <ResponsiveTable
                  columns={feeColumns}
                  data={fees}
                  keyField="id"
                  emptyMessage={isAR ? 'لا توجد رسوم متاحة' : 'No fee data available'}
                />
              </div>
            </div>
          </section>
        )}

        <CTASection locale={locale} />
      </main>
    </PageTransition>
  );
}
