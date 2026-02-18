import { buildMetadata } from '@/lib/seo';
import AdmissionsForm from '@/components/admissions/AdmissionsForm';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildMetadata({
    title: locale === 'ar' ? 'القبول والتسجيل' : 'Admissions',
    description: locale === 'ar' ? 'سجّل طفلك في مدارس إليت' : 'Apply for admission at Elite Schools.',
    path: `/${locale}/admissions`,
    locale,
  });
}

export default async function AdmissionsPage({ params }: Props) {
  const { locale } = await params;
  return <AdmissionsForm locale={locale} />;
}
