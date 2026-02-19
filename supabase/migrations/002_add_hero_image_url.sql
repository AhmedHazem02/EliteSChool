-- ============================================================
-- MIGRATION: Add hero_image_url to site_settings
-- Run this in Supabase SQL Editor
-- ============================================================

ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS hero_image_url TEXT;

COMMENT ON COLUMN public.site_settings.hero_image_url
  IS 'Fallback background image for the Hero section (used when hero_video_url is not set)';
