import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://elite-schools.com';
const SITE_NAME = 'Elite Schools';

// ─── JSON-LD Schema Generators ────────────────────────────────────────────────

export function generateSchoolSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'School',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.png`,
    sameAs: [],
    description:
      'Elite Schools — a leading private school offering British, American, and Egyptian national curricula.',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'EG',
    },
  };
}

export function generateFAQSchema(
  faqs: { question_en: string; answer_en: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question_en,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer_en,
      },
    })),
  };
}

export function generateBreadcrumbSchema(
  crumbs: { label: string; href: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.label,
      item: `${SITE_URL}${crumb.href}`,
    })),
  };
}

export function generateArticleSchema(post: {
  title_en: string;
  content_en: string;
  created_at: string;
  updated_at?: string;
  image_url?: string;
  slug?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title_en,
    image: post.image_url ? [post.image_url] : [],
    datePublished: post.created_at,
    dateModified: post.updated_at ?? post.created_at,
    author: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/images/logo.png`,
      },
    },
    url: post.slug ? `${SITE_URL}/news/${post.slug}` : SITE_URL,
  };
}

// ─── Metadata Helpers ──────────────────────────────────────────────────────────

interface PageMetaOptions {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
  locale?: string;
  alternateLocale?: string;
}

export function buildMetadata({
  title,
  description,
  path = '',
  image,
  noIndex = false,
  locale = 'en',
  alternateLocale,
}: PageMetaOptions): Metadata {
  const url = `${SITE_URL}${path}`;
  const ogImage = image ?? `${SITE_URL}/og-default.png`;

  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: url,
      languages: alternateLocale
        ? { [alternateLocale]: `${SITE_URL}/${alternateLocale}${path.replace(/^\/(en|ar)/, '')}` }
        : undefined,
    },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url,
      siteName: SITE_NAME,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [ogImage],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}
