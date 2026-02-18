// Admin-specific types

export interface AdminUser {
  id: string;
  email: string;
}

export interface ContentSection {
  key: string;
  label_en: string;
  label_ar: string;
  fields: ContentField[];
}

export interface ContentField {
  key: string;
  type: 'text' | 'textarea' | 'richtext' | 'image' | 'url' | 'number' | 'boolean';
  label_en: string;
  label_ar: string;
  bilingual: boolean;
  required?: boolean;
}

export interface AdminNavItem {
  href: string;
  icon: string;
  labelKey: string;
  children?: AdminNavItem[];
}

export type FormState = 'idle' | 'loading' | 'success' | 'error';

export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  render?: (value: unknown, row: T) => React.ReactNode;
  className?: string;
}
