import { buildMetadata } from '@/lib/seo';
import ContactForm from '@/components/contact/ContactForm';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildMetadata({
    title: locale === 'ar' ? 'تواصل معنا' : 'Contact Us',
    description: locale === 'ar' ? 'تواصل مع مدارس إليت' : 'Get in touch with Elite Schools.',
    path: `/${locale}/contact`,
    locale,
  });
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  return <ContactForm locale={locale} />;
}
