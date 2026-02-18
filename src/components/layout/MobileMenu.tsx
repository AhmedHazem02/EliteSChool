'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { NAV_LINKS } from '@/lib/constants';
import type { Locale } from '@/types';
import LanguageSwitcher from './LanguageSwitcher';

interface MobileMenuProps {
  locale: Locale;
  open: boolean;
  onClose: () => void;
}

export default function MobileMenu({ locale, open, onClose }: MobileMenuProps) {
  const t = useTranslations();

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 z-[55] lg:hidden"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: locale === 'ar' ? '-100%' : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: locale === 'ar' ? '-100%' : '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed top-0 ${locale === 'ar' ? 'left-0' : 'right-0'} h-full w-[280px] bg-navy z-[56] lg:hidden flex flex-col shadow-2xl`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gold/20">
              <Image
                src="/images/logo.png"
                alt="Elite Schools"
                width={100}
                height={40}
                className="h-9 w-auto object-contain"
              />
              <button
                onClick={onClose}
                aria-label="Close menu"
                className="w-10 h-10 flex items-center justify-center text-white hover:text-gold transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 overflow-y-auto p-4">
              <ul className="space-y-1">
                {NAV_LINKS.map((link, i) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: locale === 'ar' ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 + 0.1 }}
                  >
                    <Link
                      href={`/${locale}${link.href === '/' ? '' : link.href}`}
                      onClick={onClose}
                      className="flex items-center px-4 py-3 text-white/90 hover:text-gold hover:bg-navy-light rounded-lg transition-all duration-200 text-base font-medium min-h-[44px]"
                    >
                      {t(link.labelKey)}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-gold/20 space-y-3">
              <LanguageSwitcher locale={locale} className="w-full justify-center" />
              <Link
                href={`/${locale}/admissions`}
                onClick={onClose}
                className="relative overflow-hidden flex items-center justify-center w-full bg-burgundy text-white py-3 rounded-lg text-base font-semibold transition-all duration-300 hover:bg-burgundy-light min-h-[44px] group"
              >
                <span className="relative z-10">{t('nav.applyNow')}</span>
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
