import type { Database } from './database';

// Table Row types
export type SiteSettings = Database['public']['Tables']['site_settings']['Row'];
export type AcademicSystem = Database['public']['Tables']['academic_systems']['Row'];
export type TuitionFee = Database['public']['Tables']['tuition_fees']['Row'];
export type Post = Database['public']['Tables']['posts']['Row'];
export type GalleryItem = Database['public']['Tables']['gallery']['Row'];
export type Admission = Database['public']['Tables']['admissions']['Row'];
export type PageContent = Database['public']['Tables']['page_content']['Row'];

// Insert types
export type AdmissionInsert = Database['public']['Tables']['admissions']['Insert'];
export type PostInsert = Database['public']['Tables']['posts']['Insert'];
export type GalleryInsert = Database['public']['Tables']['gallery']['Insert'];
export type TuitionFeeInsert = Database['public']['Tables']['tuition_fees']['Insert'];

// Common bilingual text type
export interface BilingualText {
  en: string;
  ar: string;
}

// Locale type
export type Locale = 'en' | 'ar';

// Navigation link
export interface NavLink {
  href: string;
  labelKey: string;
}

// FAQ item
export interface FAQItem {
  question_en: string;
  question_ar: string;
  answer_en: string;
  answer_ar: string;
}

// Why Choose Us feature
export interface Feature {
  icon: string;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
}

// Stat
export interface Stat {
  value: number;
  suffix?: string;
  label_en: string;
  label_ar: string;
  icon?: string;
}

// Pagination
export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

// API Response
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

// Gallery category
export type GalleryCategory = 'labs' | 'sports' | 'campus' | 'events' | 'classroom';

// Post type
export type PostType = 'news' | 'event';
