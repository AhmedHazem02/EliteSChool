'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { cn } from '@/lib/utils';
import { NAV_LINKS } from '@/lib/constants';
import type { Locale } from '@/types';
import LanguageSwitcher from './LanguageSwitcher';
import MobileMenu from './MobileMenu';

interface NavbarProps {
  locale: Locale;
}

export default function Navbar({ locale }: NavbarProps) {
  const t = useTranslations();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 w-full z-50 transition-all duration-300',
          scrolled
            ? 'bg-navy/90 backdrop-blur-md border-b border-gold/20 shadow-navy py-2'
            : 'bg-transparent py-4'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link href={`/${locale}`} className="flex items-center gap-2 flex-shrink-0">
              <Image
                src="/images/logo.png"
                alt="Elite Schools"
                width={120}
                height={48}
                style={{ width: 'auto', height: '40px' }}
                className="md:h-12 object-contain"
                priority
              />
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-6 xl:gap-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={`/${locale}${link.href === '/' ? '' : link.href}`}
                  className="nav-link text-white/90 hover:text-gold text-sm font-medium transition-colors duration-200 whitespace-nowrap"
                >
                  {t(link.labelKey)}
                </Link>
              ))}
            </div>

            {/* Desktop Right Side */}
            <div className="hidden lg:flex items-center gap-3">
              <LanguageSwitcher locale={locale} />
              <Link
                href={`/${locale}/admissions`}
                className="relative overflow-hidden bg-burgundy text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(201,168,76,0.3)] active:scale-[0.98] group"
              >
                <span className="relative z-10">{t('nav.applyNow')}</span>
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </Link>
            </div>

            {/* Mobile: Language + Hamburger */}
            <div className="flex lg:hidden items-center gap-2">
              <LanguageSwitcher locale={locale} />
              <button
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
                className="w-11 h-11 flex items-center justify-center text-white hover:text-gold transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <MobileMenu
        locale={locale}
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
    </>
  );
}
