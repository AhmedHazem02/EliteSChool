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

  const isArabic = locale === 'ar';

  return (
    <button
      dir="ltr"
      onClick={handleSwitch}
      disabled={isPending}
      aria-label={`Switch to ${otherLocale === 'ar' ? 'Arabic' : 'English'}`}
      className={cn(
        'relative flex items-center h-9 w-[88px] p-1 rounded-full cursor-pointer',
        'bg-navy-dark/60 border border-gold/30 backdrop-blur-md',
        'hover:border-gold/60 hover:shadow-[0_0_18px_rgba(201,168,76,0.28)]',
        'transition-all duration-300 disabled:opacity-50',
        className
      )}
    >
      {/* Gold sliding pill — uses translateX so animation is guaranteed */}
      <span
        className={cn(
          'absolute top-1 left-1 h-[calc(100%-8px)] w-10 rounded-full',
          'bg-gradient-to-b from-gold-light to-gold-dark',
          'shadow-[0_2px_10px_rgba(201,168,76,0.5)]',
          'transition-transform duration-300 ease-in-out',
          isArabic ? 'translate-x-10' : 'translate-x-0'
        )}
      />
      {/* EN */}
      <span
        className={cn(
          'relative z-10 w-10 text-center text-[11px] font-black tracking-widest select-none transition-colors duration-300',
          !isArabic ? 'text-navy-dark' : 'text-white/50'
        )}
      >
        EN
      </span>
      {/* AR */}
      <span
        className={cn(
          'relative z-10 w-10 text-center text-[11px] font-black tracking-widest select-none transition-colors duration-300',
          isArabic ? 'text-navy-dark' : 'text-white/50'
        )}
      >
        AR
      </span>
    </button>
  );
}
