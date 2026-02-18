'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { adminTranslations, type AdminLocale } from '@/lib/admin-translations';

interface AdminI18nContextValue {
  locale: AdminLocale;
  setLocale: (l: AdminLocale) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
  isRTL: boolean;
}

const AdminI18nContext = createContext<AdminI18nContextValue | null>(null);

export function AdminI18nProvider({
  children,
  initialLocale,
}: {
  children: ReactNode;
  initialLocale: AdminLocale;
}) {
  const router = useRouter();
  const [locale, setLocaleState] = useState<AdminLocale>(initialLocale);

  const setLocale = useCallback(
    (l: AdminLocale) => {
      setLocaleState(l);
      document.cookie = `admin-locale=${l};path=/;max-age=31536000;SameSite=Lax`;
      router.refresh();
    },
    [router]
  );

  const t = useCallback(
    (key: string): string => adminTranslations[locale]?.[key] ?? key,
    [locale]
  );

  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  const isRTL = locale === 'ar';

  return (
    <AdminI18nContext.Provider value={{ locale, setLocale, t, dir, isRTL }}>
      {children}
    </AdminI18nContext.Provider>
  );
}

export function useAdminI18n(): AdminI18nContextValue {
  const ctx = useContext(AdminI18nContext);
  if (!ctx) throw new Error('useAdminI18n must be used within AdminI18nProvider');
  return ctx;
}
