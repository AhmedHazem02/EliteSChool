'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import type { Locale } from '@/types';
import { NAV_LINKS } from '@/lib/constants';

interface FooterProps {
  locale: Locale;
}

export default function Footer({ locale }: FooterProps) {
  const t = useTranslations();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy-dark text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-20">
        {/* Top grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href={`/${locale}`}>
              <Image
                src="/images/logo.png"
                alt="Elite Schools"
                width={140}
                height={60}
                className="h-16 w-auto md:h-20 object-contain mb-3"
              />
            </Link>
            <p className="text-white/60 text-sm leading-relaxed">
              {t('footer.school')}
            </p>
            {/* Social */}
            <div className="flex gap-3 mt-4">
              {[
                { icon: Facebook, label: 'Facebook' },
                { icon: Instagram, label: 'Instagram' },
                { icon: Twitter, label: 'Twitter' },
                { icon: Youtube, label: 'YouTube' },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-gold/30 text-white/60 hover:text-gold hover:border-gold transition-all duration-200 hover:scale-110"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gold font-semibold mb-4 text-sm uppercase tracking-wider">
              {t('footer.quickLinks')}
            </h3>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={`/${locale}${link.href === '/' ? '' : link.href}`}
                    className="text-white/60 hover:text-gold text-sm transition-colors duration-200 flex items-center gap-1.5 min-h-[36px]"
                  >
                    <span className="w-1 h-1 bg-gold/50 rounded-full flex-shrink-0" />
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h3 className="text-gold font-semibold mb-4 text-sm uppercase tracking-wider">
              {t('programs.title')}
            </h3>
            <ul className="space-y-2">
              {['american', 'british'].map((system) => (
                <li key={system}>
                  <Link
                    href={`/${locale}/programs/${system}`}
                    className="text-white/60 hover:text-gold text-sm transition-colors duration-200 flex items-center gap-1.5 min-h-[36px]"
                  >
                    <span className="w-1 h-1 bg-gold/50 rounded-full flex-shrink-0" />
                    {t(`programs.${system}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-gold font-semibold mb-4 text-sm uppercase tracking-wider">
              {t('footer.contactUs')}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                <span className="text-white/60 text-sm">+20 123 456 7890</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                <span className="text-white/60 text-sm">info@eliteschools.edu</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                <span className="text-white/60 text-sm leading-relaxed">Cairo, Egypt</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gold/10 pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-white/40 text-xs">
            <p>
              © {currentYear} Elite Schools. {t('footer.rights')}
            </p>
            <div className="flex gap-4">
              <Link href={`/${locale}`} className="hover:text-gold transition-colors min-h-[36px] flex items-center">
                {t('footer.privacy')}
              </Link>
              <Link href={`/${locale}`} className="hover:text-gold transition-colors min-h-[36px] flex items-center">
                {t('footer.terms')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
