'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { ADMIN_NAV_LINKS } from '@/lib/constants';
import { useAdminI18n } from '@/components/admin/AdminI18nProvider';
import {
  LayoutDashboard, FileText, Image as ImageIcon, GraduationCap,
  Settings, Users, BookOpen, LogOut, ChevronLeft, ChevronRight, Menu, Languages,
} from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  '/admin': <LayoutDashboard size={18} />,
  '/admin/admissions': <Users size={18} />,
  '/admin/content': <FileText size={18} />,
  '/admin/academic-systems': <GraduationCap size={18} />,
  '/admin/posts': <BookOpen size={18} />,
  '/admin/gallery': <ImageIcon size={18} />,
  '/admin/settings': <Settings size={18} />,
};

const labelKeyMap: Record<string, string> = {
  'admin.dashboard': 'sidebar.dashboard',
  'admin.submissions': 'sidebar.submissions',
  'admin.content': 'sidebar.content',
  'admin.systems': 'sidebar.systems',
  'admin.posts': 'sidebar.posts',
  'admin.gallery': 'sidebar.gallery',
  'admin.settings': 'sidebar.settings',
};

interface AdminSidebarProps {
  userEmail: string;
}

export default function AdminSidebar({ userEmail }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [collapsed, setCollapsed] = useState(false);
  const { t, locale, setLocale, isRTL } = useAdminI18n();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/login');
  }

  function toggleLanguage() {
    setLocale(locale === 'en' ? 'ar' : 'en');
  }

  return (
    <aside
      className={cn(
        'h-screen sticky top-0 bg-navy text-white flex flex-col transition-all duration-300 z-30 shadow-xl',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className={cn('flex items-center gap-3 px-4 py-5 border-b border-white/10', collapsed && 'justify-center')}>
        <div className="relative w-9 h-9 shrink-0">
          <Image src="/images/logo.png" alt="Elite" fill className="object-contain brightness-0 invert" />
        </div>
        {!collapsed && (
          <span className="font-playfair font-bold text-base leading-tight">
            Elite<br />
            <span className="text-gold text-xs font-sans font-normal">{t('sidebar.adminPanel')}</span>
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 space-y-1 px-2">
        {ADMIN_NAV_LINKS.map((link) => {
          const isActive = link.href === '/admin'
            ? pathname === '/admin'
            : pathname.startsWith(link.href);
          const label = t(labelKeyMap[link.labelKey] ?? link.labelKey);
          return (
            <Link
              key={link.href}
              href={link.href}
              title={collapsed ? label : undefined}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-gold text-white'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              )}
            >
              <span className="shrink-0">{iconMap[link.href]}</span>
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Language toggle + User + Logout */}
      <div className="border-t border-white/10 px-2 py-3 space-y-1">
        {/* Language Toggle */}
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-white/70 hover:bg-white/10 hover:text-white transition-all"
          title={collapsed ? t('sidebar.language') : undefined}
        >
          <Languages size={18} className="shrink-0" />
          {!collapsed && <span>{t('sidebar.language')}</span>}
        </button>

        {!collapsed && (
          <p className="text-white/40 text-xs px-3 truncate">{userEmail}</p>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-white/70 hover:bg-red-600/20 hover:text-red-300 transition-all"
          title={collapsed ? t('sidebar.signOut') : undefined}
        >
          <LogOut size={18} className="shrink-0" />
          {!collapsed && t('sidebar.signOut')}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className={cn(
          'absolute top-6 w-6 h-6 rounded-full bg-navy border border-white/20 flex items-center justify-center text-white hover:bg-gold transition-colors shadow',
          isRTL ? '-left-3' : '-right-3'
        )}
      >
        {collapsed
          ? (isRTL ? <ChevronLeft size={12} /> : <ChevronRight size={12} />)
          : (isRTL ? <ChevronRight size={12} /> : <ChevronLeft size={12} />)
        }
      </button>
    </aside>
  );
}
