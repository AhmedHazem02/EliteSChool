'use client';

import { useAdminI18n } from '@/components/admin/AdminI18nProvider';
import AdminSidebar from '@/components/layout/AdminSidebar';

interface AdminShellProps {
  children: React.ReactNode;
  userEmail: string;
}

export default function AdminShell({ children, userEmail }: AdminShellProps) {
  const { dir } = useAdminI18n();

  return (
    <div className="min-h-screen bg-off-white flex" dir={dir}>
      <AdminSidebar userEmail={userEmail} />
      <main className="flex-1 min-w-0 overflow-hidden">
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
