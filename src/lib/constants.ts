import type { Locale } from '@/types';

export const LOCALES: Locale[] = ['en', 'ar'];
export const DEFAULT_LOCALE: Locale = 'en';

export const NAV_LINKS = [
  { href: '/', labelKey: 'nav.home' },
  { href: '/about', labelKey: 'nav.about' },
  { href: '/programs', labelKey: 'nav.programs' },
  { href: '/admissions', labelKey: 'nav.admissions' },
  { href: '/gallery', labelKey: 'nav.gallery' },
  { href: '/news', labelKey: 'nav.news' },
  { href: '/contact', labelKey: 'nav.contact' },
] as const;

export const ADMIN_NAV_LINKS = [
  { href: '/admin', icon: 'Home', labelKey: 'admin.dashboard' },
  { href: '/admin/admissions', icon: 'ClipboardList', labelKey: 'admin.submissions' },
  { href: '/admin/content', icon: 'FileText', labelKey: 'admin.content' },
  { href: '/admin/academic-systems', icon: 'GraduationCap', labelKey: 'admin.systems' },
  { href: '/admin/posts', icon: 'Newspaper', labelKey: 'admin.posts' },
  { href: '/admin/gallery', icon: 'Image', labelKey: 'admin.gallery' },
  { href: '/admin/settings', icon: 'Settings', labelKey: 'admin.settings' },
] as const;

export const STORAGE_BUCKETS = {
  HERO_VIDEOS: 'hero-videos',
  GALLERY_IMAGES: 'gallery-images',
  POST_THUMBNAILS: 'post-thumbnails',
  SYSTEM_IMAGES: 'system-images',
} as const;

export const FILE_SIZE_LIMITS = {
  VIDEO: 50 * 1024 * 1024, // 50MB
  IMAGE: 5 * 1024 * 1024,  // 5MB
  THUMBNAIL: 2 * 1024 * 1024, // 2MB
} as const;

export const GALLERY_CATEGORIES = [
  'labs',
  'sports',
  'campus',
  'events',
  'classroom',
] as const;

export const GALLERY_CATEGORIES_DATA = [
  { value: 'labs', labelEn: 'Labs', labelAr: 'المختبرات' },
  { value: 'sports', labelEn: 'Sports', labelAr: 'الرياضة' },
  { value: 'campus', labelEn: 'Campus', labelAr: 'الحرم الجامعي' },
  { value: 'events', labelEn: 'Events', labelAr: 'الفعاليات' },
  { value: 'classroom', labelEn: 'Classroom', labelAr: 'الفصول' },
] as const;

export const ACADEMIC_SYSTEMS = ['american', 'british'] as const;

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export const REVALIDATION_TIME = 60; // seconds
