'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';

export default function MobileBottomCTA() {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 md:hidden">
      <Link
        href={`/${locale}/admissions`}
        className="relative overflow-hidden flex items-center justify-center w-full bg-burgundy text-white py-4 text-base font-bold shadow-lg hover:bg-burgundy-light transition-colors duration-200 group"
      >
        <span className="relative z-10">{t('common.applyNow')} ✦</span>
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      </Link>
    </div>
  );
}
