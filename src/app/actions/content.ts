'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

interface ContentPayload {
  id?: string;
  section_key: string;
  title_en: string | null;
  title_ar: string | null;
  subtitle_en: string | null;
  subtitle_ar: string | null;
  content_en: string | null;
  content_ar: string | null;
  image_url: string | null;
  extra_data: unknown;
}

export async function savePageContent(payload: ContentPayload) {
  const supabase = createAdminClient();

  let error;

  if (payload.id) {
    const res = await supabase
      .from('page_content')
      .update({
        title_en: payload.title_en,
        title_ar: payload.title_ar,
        subtitle_en: payload.subtitle_en,
        subtitle_ar: payload.subtitle_ar,
        content_en: payload.content_en,
        content_ar: payload.content_ar,
        image_url: payload.image_url,
        extra_data: payload.extra_data,
      })
      .eq('id', payload.id);
    error = res.error;
  } else {
    const res = await supabase.from('page_content').insert({
      section_key: payload.section_key,
      title_en: payload.title_en,
      title_ar: payload.title_ar,
      subtitle_en: payload.subtitle_en,
      subtitle_ar: payload.subtitle_ar,
      content_en: payload.content_en,
      content_ar: payload.content_ar,
      image_url: payload.image_url,
      extra_data: payload.extra_data,
    });
    error = res.error;
  }

  if (error) {
    return { success: false, error: error.message };
  }

  // Revalidate ALL pages (content can appear on homepage, about, etc.)
  revalidatePath('/', 'layout');

  return { success: true };
}
