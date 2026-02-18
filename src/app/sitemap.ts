import type { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://elite-schools.com';
const locales = ['en', 'ar'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  const [postsRes, systemsRes] = await Promise.all([
    supabase.from('posts').select('id, updated_at').eq('published', true),
    supabase.from('academic_systems').select('id, updated_at').eq('is_active', true),
  ]);

  const posts = postsRes.data ?? [];
  const systems = systemsRes.data ?? [];

  const staticRoutes = ['', '/about', '/programs', '/gallery', '/news', '/admissions', '/contact'];

  const urls: MetadataRoute.Sitemap = [];

  // Static pages for each locale
  for (const locale of locales) {
    for (const route of staticRoutes) {
      urls.push({
        url: `${SITE_URL}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' : 'weekly',
        priority: route === '' ? 1.0 : 0.8,
      });
    }

    // News posts
    for (const post of posts) {
      urls.push({
        url: `${SITE_URL}/${locale}/news/${post.id}`,
        lastModified: new Date(post.updated_at),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }

    // Academic system pages
    for (const sys of systems) {
      urls.push({
        url: `${SITE_URL}/${locale}/programs/${sys.id}`,
        lastModified: new Date(sys.updated_at),
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
  }

  return urls;
}
