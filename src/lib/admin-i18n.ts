import { cookies } from 'next/headers';
import { adminTranslations, type AdminLocale } from './admin-translations';

export type { AdminLocale } from './admin-translations';

export async function getAdminLocale(): Promise<AdminLocale> {
  const cookieStore = await cookies();
  const locale = cookieStore.get('admin-locale')?.value;
  return locale === 'ar' ? 'ar' : 'en';
}

export function adminT(locale: AdminLocale) {
  const dict = adminTranslations[locale];
  return (key: string): string => dict[key] ?? key;
}
