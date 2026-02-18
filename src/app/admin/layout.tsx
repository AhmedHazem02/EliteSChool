import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getAdminLocale } from '@/lib/admin-i18n';
import { AdminI18nProvider } from '@/components/admin/AdminI18nProvider';
import AdminShell from '@/components/admin/AdminShell';

export const metadata: Metadata = {
  title: 'Admin | Elite Schools',
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const adminLocale = await getAdminLocale();

  return (
    <AdminI18nProvider initialLocale={adminLocale}>
      <AdminShell userEmail={user.email ?? ''}>
        {children}
      </AdminShell>
    </AdminI18nProvider>
  );
}
