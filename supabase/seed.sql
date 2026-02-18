-- ============================================================
-- ELITE SCHOOLS v2.0 — Seed Data
-- Run AFTER migrations/001_initial_schema.sql
-- ============================================================

-- ─── Sample Posts ────────────────────────────────────────────
INSERT INTO public.posts (type, title_en, title_ar, slug, excerpt_en, excerpt_ar, is_published, is_featured, created_at)
VALUES
  (
    'news',
    'Elite Schools Achieves Top Rankings in National Exams',
    'مدارس إيليت تحقق مراكز متقدمة في الامتحانات الوطنية',
    'elite-schools-top-rankings-2026',
    'Our students have achieved outstanding results in this year''s national examinations, with 95% scoring in the top percentiles.',
    'حقق طلابنا نتائج متميزة في الامتحانات الوطنية لهذا العام، حيث سجّل 95% منهم في المئوية العليا.',
    true,
    true,
    NOW() - INTERVAL '2 days'
  ),
  (
    'event',
    'Annual Science Fair — March 2026',
    'معرض العلوم السنوي — مارس 2026',
    'annual-science-fair-march-2026',
    'Join us for our annual science fair where students showcase their innovative projects and experiments.',
    'انضموا إلينا في معرضنا العلمي السنوي حيث يعرض الطلاب مشاريعهم وتجاربهم المبتكرة.',
    true,
    true,
    NOW() - INTERVAL '5 days'
  ),
  (
    'news',
    'New STEM Lab Opening Ceremony',
    'حفل افتتاح مختبر STEM الجديد',
    'new-stem-lab-opening',
    'We are proud to announce the opening of our state-of-the-art STEM laboratory, equipped with the latest technology.',
    'يسعدنا الإعلان عن افتتاح مختبر STEM المتطور المجهز بأحدث التقنيات.',
    true,
    false,
    NOW() - INTERVAL '10 days'
  );

-- ─── Sample Gallery Items ─────────────────────────────────────
INSERT INTO public.gallery (category, media_url, media_type, caption_en, caption_ar, sort_order)
VALUES
  ('campus', 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800', 'image', 'Main Campus Building', 'المبنى الرئيسي للحرم المدرسي', 1),
  ('labs', 'https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?w=800', 'image', 'Science Laboratory', 'مختبر العلوم', 2),
  ('sports', 'https://images.unsplash.com/photo-1547347298-4074fc3086f0?w=800', 'image', 'Sports Facility', 'المرفق الرياضي', 3),
  ('classroom', 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800', 'image', 'Modern Classrooms', 'الفصول الدراسية الحديثة', 4),
  ('events', 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800', 'image', 'Graduation Ceremony', 'حفل التخرج', 5),
  ('campus', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800', 'image', 'Campus Library', 'مكتبة الحرم المدرسي', 6);

-- ─── Sample Tuition Fees ─────────────────────────────────────
-- (Will be inserted after you know the system UUIDs)
-- Run this query to get system IDs:
-- SELECT id, slug FROM academic_systems;
-- Then use those IDs below.

-- Example (replace YOUR_AMERICAN_SYSTEM_ID with actual UUID):
-- INSERT INTO public.tuition_fees (system_id, grade_level_en, grade_level_ar, fee_amount, currency, sort_order) VALUES
--   ('YOUR_AMERICAN_SYSTEM_ID', 'KG 1', 'تمهيدي 1', 45000, 'EGP', 1),
--   ('YOUR_AMERICAN_SYSTEM_ID', 'KG 2', 'تمهيدي 2', 48000, 'EGP', 2),
--   ('YOUR_AMERICAN_SYSTEM_ID', 'Grade 1', 'الصف الأول', 52000, 'EGP', 3),
--   ('YOUR_AMERICAN_SYSTEM_ID', 'Grade 2', 'الصف الثاني', 54000, 'EGP', 4),
--   ('YOUR_AMERICAN_SYSTEM_ID', 'Grade 3', 'الصف الثالث', 56000, 'EGP', 5),
--   ('YOUR_AMERICAN_SYSTEM_ID', 'Grade 4', 'الصف الرابع', 58000, 'EGP', 6),
--   ('YOUR_AMERICAN_SYSTEM_ID', 'Grade 5', 'الصف الخامس', 60000, 'EGP', 7);
