'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// ── Auth Guard ────────────────────────────────────────────────

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error('Unauthorized');
  return user;
}

// ── Allowed fields for site_settings ──────────────────────────

const ALLOWED_SETTINGS_KEYS = new Set([
  'hero_video_url',
  'hero_image_url',
  'logo_url',
  'site_name_en',
  'site_name_ar',
  'contact_phone',
  'contact_email',
  'address_en',
  'address_ar',
  'facebook_url',
  'twitter_url',
  'instagram_url',
  'youtube_url',
  'whatsapp',
  'map_url',
  'seo_title_en',
  'seo_title_ar',
  'seo_description_en',
  'seo_description_ar',
]);

// ── Academic Systems ──────────────────────────────────────────

interface SystemPayload {
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  hero_image_url: string | null;
  features_en: string[];
  features_ar: string[];
  is_active: boolean;
  sort_order: number;
  slug?: string;
}

interface FeePayload {
  system_id: string;
  grade_level_en: string;
  grade_level_ar: string;
  fee_amount: number;
  currency: string;
  notes_en: string | null;
  notes_ar: string | null;
  sort_order: number;
}

export async function saveAcademicSystem(
  systemId: string | undefined,
  payload: SystemPayload,
  fees: Omit<FeePayload, 'system_id'>[]
): Promise<{ success: boolean; error?: string; newId?: string }> {
  try {
    await requireAdmin();
  } catch {
    return { success: false, error: 'Unauthorized' };
  }

  const supabase = createAdminClient();
  let id = systemId;

  if (id) {
    const { error } = await supabase.from('academic_systems').update(payload).eq('id', id);
    if (error) return { success: false, error: error.message };
  } else {
    const { data, error } = await supabase
      .from('academic_systems')
      .insert(payload)
      .select('id')
      .single();
    if (error || !data) return { success: false, error: error?.message ?? 'Insert failed' };
    id = data.id as string;
  }

  // Sync fees: delete all existing, then insert new set (atomic replacement)
  const { error: deleteErr } = await supabase.from('tuition_fees').delete().eq('system_id', id);
  if (deleteErr) return { success: false, error: `Fee cleanup failed: ${deleteErr.message}` };

  if (fees.length > 0) {
    const { error: insertErr } = await supabase.from('tuition_fees').insert(
      fees.map((f) => ({ ...f, system_id: id }))
    );
    if (insertErr) return { success: false, error: `Fee insert failed: ${insertErr.message}` };
  }

  revalidatePath('/ar/programs', 'page');
  revalidatePath('/en/programs', 'page');
  revalidatePath('/ar', 'page');
  revalidatePath('/en', 'page');

  return { success: true, newId: id };
}

export async function deleteAcademicSystem(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin();
  } catch {
    return { success: false, error: 'Unauthorized' };
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from('academic_systems').delete().eq('id', id);
  if (error) return { success: false, error: error.message };

  revalidatePath('/ar/programs', 'page');
  revalidatePath('/en/programs', 'page');
  revalidatePath('/ar', 'page');
  revalidatePath('/en', 'page');

  return { success: true };
}

// ── Posts ─────────────────────────────────────────────────────

interface PostPayload {
  title_en: string;
  title_ar: string;
  content_en: string;
  content_ar: string;
  type: string;
  thumbnail_url: string | null;
  is_published: boolean;
  slug: string;
}

export async function savePost(
  postId: string | undefined,
  payload: PostPayload
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin();
  } catch {
    return { success: false, error: 'Unauthorized' };
  }

  const supabase = createAdminClient();
  let error;

  if (postId) {
    const res = await supabase.from('posts').update(payload).eq('id', postId);
    error = res.error;
  } else {
    const res = await supabase.from('posts').insert(payload);
    error = res.error;
  }

  if (error) return { success: false, error: error.message };

  revalidatePath('/ar/news', 'page');
  revalidatePath('/en/news', 'page');
  revalidatePath('/ar', 'page');
  revalidatePath('/en', 'page');

  return { success: true };
}

export async function deletePost(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin();
  } catch {
    return { success: false, error: 'Unauthorized' };
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from('posts').delete().eq('id', id);
  if (error) return { success: false, error: error.message };

  revalidatePath('/ar/news', 'page');
  revalidatePath('/en/news', 'page');
  revalidatePath('/ar', 'page');
  revalidatePath('/en', 'page');

  return { success: true };
}

// ── Gallery ───────────────────────────────────────────────────

export async function deleteGalleryItem(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin();
  } catch {
    return { success: false, error: 'Unauthorized' };
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from('gallery').delete().eq('id', id);
  if (error) return { success: false, error: error.message };

  revalidatePath('/ar', 'page');
  revalidatePath('/en', 'page');
  revalidatePath('/ar/gallery', 'page');
  revalidatePath('/en/gallery', 'page');

  return { success: true };
}

// ── Site Settings ─────────────────────────────────────────────

export async function saveSiteSettings(
  id: string,
  form: Record<string, unknown>
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin();
  } catch {
    return { success: false, error: 'Unauthorized' };
  }

  // Whitelist: only allow known settings keys
  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(form)) {
    if (ALLOWED_SETTINGS_KEYS.has(key)) {
      sanitized[key] = value;
    }
  }

  if (Object.keys(sanitized).length === 0) {
    return { success: false, error: 'No valid fields provided' };
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from('site_settings').update(sanitized).eq('id', id);
  if (error) return { success: false, error: error.message };

  revalidatePath('/ar', 'layout');
  revalidatePath('/en', 'layout');

  return { success: true };
}
