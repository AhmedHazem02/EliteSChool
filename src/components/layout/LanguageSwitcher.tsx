'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useTransition } from 'react';
import { cn } from '@/lib/utils';
import type { Locale } from '@/types';

interface LanguageSwitcherProps {
  locale: Locale;
  className?: string;
}

export default function LanguageSwitcher({ locale, className }: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const otherLocale: Locale = locale === 'en' ? 'ar' : 'en';

  const handleSwitch = () => {
    // Replace /en/ or /ar/ prefix in pathname
    const newPath = pathname.replace(`/${locale}`, `/${otherLocale}`);
    startTransition(() => {
      router.push(newPath);
    });
  };

  return (
    <button
      onClick={handleSwitch}
      disabled={isPending}
      aria-label={`Switch to ${otherLocale === 'ar' ? 'Arabic' : 'English'}`}
      className={cn(
        'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium border border-gold/30 text-white hover:border-gold hover:text-gold transition-all duration-200 disabled:opacity-50 min-h-[36px]',
        className
      )}
    >
      <span className="text-base leading-none">
        {otherLocale === 'ar' ? '🇪🇬' : '🇺🇸'}
      </span>
      <span>{otherLocale === 'ar' ? 'العربية' : 'English'}</span>
    </button>
  );
}
