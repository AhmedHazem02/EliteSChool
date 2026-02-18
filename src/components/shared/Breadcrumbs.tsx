'use client';

import Link from 'next/link';
import { ChevronRight, ChevronLeft, Home } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  light?: boolean;
}

export default function Breadcrumbs({ items, className, light }: BreadcrumbsProps) {
  const locale = useLocale();
  const t = useTranslations('breadcrumb');
  const isRtl = locale === 'ar';
  const ChevronIcon = isRtl ? ChevronLeft : ChevronRight;

  const allItems: BreadcrumbItem[] = [
    { label: t('home'), href: `/${locale}` },
    ...items,
  ];

  // JSON-LD BreadcrumbList schema
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: allItems.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      ...(item.href && { item: `${process.env.NEXT_PUBLIC_SITE_URL}${item.href}` }),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <nav
        aria-label="Breadcrumb"
        className={cn(
          'flex items-center gap-1.5 text-sm flex-wrap',
          light ? 'text-white/70' : 'text-gray-500',
          className
        )}
      >
        {allItems.map((item, i) => (
          <div key={i} className="flex items-center gap-1.5">
            {i > 0 && (
              <ChevronIcon className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            )}
            {item.href && i < allItems.length - 1 ? (
              <Link
                href={item.href}
                className="hover:text-gold transition-colors duration-200 min-h-[36px] flex items-center"
              >
                {i === 0 && <Home className="w-3.5 h-3.5 me-1" />}
                {item.label}
              </Link>
            ) : (
              <span className={cn('font-medium', light ? 'text-white' : 'text-navy')}>{item.label}</span>
            )}
          </div>
        ))}
      </nav>
    </>
  );
}
