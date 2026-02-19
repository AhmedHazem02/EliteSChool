import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/i18n';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MobileBottomCTA from '@/components/layout/MobileBottomCTA';
import ScrollProgressBar from '@/components/shared/ScrollProgressBar';
import BackToTop from '@/components/shared/BackToTop';
import Preloader from '@/components/shared/Preloader';
import SmoothScroll from '@/components/shared/SmoothScroll';
import ThemeProvider from '@/components/shared/ThemeProvider';

// ─── Metadata ────────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'hero' });

  return {
    title: {
      default: locale === 'ar' ? 'مدارس إيليت — نصنع قادة المستقبل' : 'Elite Schools — Shaping Future Leaders',
      template: locale === 'ar' ? '%s | مدارس إيليت' : '%s | Elite Schools',
    },
    description: t('description'),
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
    openGraph: {
      type: 'website',
      locale: locale === 'ar' ? 'ar_EG' : 'en_US',
      images: ['/images/og-image.png'],
    },
    icons: {
      icon: '/favicon.ico',
      apple: '/apple-touch-icon.png',
    },
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// ─── Layout ──────────────────────────────────────────────────────────────────
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <div lang={locale} dir={dir}>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
          <SmoothScroll>
          <Preloader />
          <ScrollProgressBar />
          <Navbar locale={locale as Locale} />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer locale={locale as Locale} />
          <MobileBottomCTA />
          <BackToTop />
          </SmoothScroll>
          </ThemeProvider>
        </NextIntlClientProvider>
    </div>
  );
}
