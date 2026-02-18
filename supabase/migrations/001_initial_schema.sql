-- ============================================================
-- ELITE SCHOOLS v2.0 — Database Schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. SITE SETTINGS (single row)
-- ============================================================
CREATE TABLE public.site_settings (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_name_en        TEXT DEFAULT 'Elite Schools',
  site_name_ar        TEXT DEFAULT 'مدارس إيليت',
  logo_url            TEXT,
  contact_email       TEXT DEFAULT 'info@eliteschools.edu',
  contact_phone       TEXT DEFAULT '+20 123 456 7890',
  whatsapp            TEXT DEFAULT '+20 123 456 7890',
  address_en          TEXT DEFAULT 'Cairo, Egypt',
  address_ar          TEXT DEFAULT 'القاهرة، مصر',
  map_url             TEXT,
  hero_video_url      TEXT,
  facebook_url        TEXT,
  instagram_url       TEXT,
  twitter_url         TEXT,
  youtube_url         TEXT,
  seo_title_en        TEXT DEFAULT 'Elite Schools — Shaping Future Leaders',
  seo_title_ar        TEXT DEFAULT 'مدارس إيليت — نصنع قادة المستقبل',
  seo_description_en  TEXT DEFAULT 'Elite Schools provides world-class American and British education in Egypt.',
  seo_description_ar  TEXT DEFAULT 'مدارس إيليت تقدم تعليمًا عالمي المستوى بالمناهج الأمريكية والبريطانية في مصر.',
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- Insert the single settings row
INSERT INTO public.site_settings (id) VALUES (uuid_generate_v4());

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read site_settings" ON public.site_settings
  FOR SELECT USING (true);

CREATE POLICY "Admin can update site_settings" ON public.site_settings
  FOR UPDATE USING (auth.role() = 'authenticated');

-- ============================================================
-- 2. ACADEMIC SYSTEMS
-- ============================================================
CREATE TABLE public.academic_systems (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug            TEXT UNIQUE NOT NULL,
  title_en        TEXT NOT NULL,
  title_ar        TEXT NOT NULL,
  description_en  TEXT,
  description_ar  TEXT,
  hero_image_url  TEXT,
  curriculum_en   TEXT,
  curriculum_ar   TEXT,
  features_en     JSONB DEFAULT '[]'::jsonb,
  features_ar     JSONB DEFAULT '[]'::jsonb,
  sort_order      INT4 DEFAULT 0,
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.academic_systems (slug, title_en, title_ar, description_en, description_ar, features_en, features_ar, sort_order) VALUES
  (
    'american',
    'American System',
    'النظام الأمريكي',
    'Our American curriculum follows the US Common Core standards, preparing students for US universities and beyond.',
    'يتبع منهجنا الأمريكي معايير Common Core الأمريكية، مما يُعدّ الطلاب للجامعات الأمريكية وما هو أبعد.',
    '["SAT/ACT Preparation","US Common Core Standards","STEM Focus","Advanced Placement (AP)","College Counseling"]',
    '["تحضير SAT/ACT","معايير Common Core الأمريكية","تركيز على STEM","متقدم (AP)","الإرشاد الجامعي"]',
    1
  ),
  (
    'british',
    'British System',
    'النظام البريطاني',
    'Our British curriculum follows the Cambridge and Edexcel frameworks, recognized by universities worldwide.',
    'يتبع منهجنا البريطاني أطر Cambridge وEdexcel المعترف بها من جامعات حول العالم.',
    '["IGCSE & A-Levels","Cambridge Certified","Global University Recognition","Critical Thinking Focus","Language Arts Excellence"]',
    '["IGCSE ومستويات A","معتمد من Cambridge","اعتراف جامعي عالمي","التفكير النقدي","التميز في اللغويات"]',
    2
  );

ALTER TABLE public.academic_systems ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read academic_systems" ON public.academic_systems
  FOR SELECT USING (true);

CREATE POLICY "Admin can manage academic_systems" ON public.academic_systems
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- 3. TUITION FEES
-- ============================================================
CREATE TABLE public.tuition_fees (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  system_id       UUID NOT NULL REFERENCES public.academic_systems(id) ON DELETE CASCADE,
  grade_level_en  TEXT NOT NULL,
  grade_level_ar  TEXT NOT NULL,
  fee_amount      NUMERIC NOT NULL,
  currency        TEXT DEFAULT 'EGP',
  notes_en        TEXT,
  notes_ar        TEXT,
  sort_order      INT4 DEFAULT 0,
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.tuition_fees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read tuition_fees" ON public.tuition_fees
  FOR SELECT USING (true);

CREATE POLICY "Admin can manage tuition_fees" ON public.tuition_fees
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- 4. POSTS (NEWS & EVENTS)
-- ============================================================
CREATE TABLE public.posts (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type            TEXT NOT NULL CHECK (type IN ('news', 'event')),
  title_en        TEXT NOT NULL,
  title_ar        TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,
  content_en      TEXT,
  content_ar      TEXT,
  excerpt_en      TEXT,
  excerpt_ar      TEXT,
  thumbnail_url   TEXT,
  event_date      TIMESTAMPTZ,
  is_published    BOOLEAN DEFAULT false,
  is_featured     BOOLEAN DEFAULT false,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published posts" ON public.posts
  FOR SELECT USING (is_published = true OR auth.role() = 'authenticated');

CREATE POLICY "Admin can manage posts" ON public.posts
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- 5. GALLERY
-- ============================================================
CREATE TABLE public.gallery (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category    TEXT NOT NULL CHECK (category IN ('labs', 'sports', 'campus', 'events', 'classroom')),
  media_url   TEXT NOT NULL,
  media_type  TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
  caption_en  TEXT,
  caption_ar  TEXT,
  sort_order  INT4 DEFAULT 0,
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active gallery" ON public.gallery
  FOR SELECT USING (is_active = true OR auth.role() = 'authenticated');

CREATE POLICY "Admin can manage gallery" ON public.gallery
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- 6. ADMISSIONS (form submissions)
-- ============================================================
CREATE TABLE public.admissions (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_name     TEXT NOT NULL,
  parent_name      TEXT NOT NULL,
  email            TEXT NOT NULL,
  phone            TEXT NOT NULL,
  grade_level      TEXT,
  selected_system  TEXT CHECK (selected_system IN ('American', 'British')),
  date_of_birth    DATE,
  previous_school  TEXT,
  notes            TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);


ALTER TABLE public.admissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert admissions" ON public.admissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can read admissions" ON public.admissions
  FOR SELECT USING (auth.role() = 'authenticated');

-- ============================================================
-- 7. PAGE CONTENT
-- ============================================================
CREATE TABLE public.page_content (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_key  TEXT UNIQUE NOT NULL,
  title_en     TEXT,
  title_ar     TEXT,
  subtitle_en  TEXT,
  subtitle_ar  TEXT,
  content_en   TEXT,
  content_ar   TEXT,
  image_url    TEXT,
  extra_data   JSONB DEFAULT '{}'::jsonb,
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.page_content (section_key, title_en, title_ar, subtitle_en, subtitle_ar, content_en, content_ar, extra_data) VALUES
  (
    'hero',
    'Welcome to Elite Schools',
    'مرحبًا بكم في مدارس إيليت',
    'Shaping Future Leaders',
    'نصنع قادة المستقبل',
    'Providing world-class education through American and British curricula.',
    'نقدم تعليمًا عالمي المستوى من خلال المناهج الأمريكية والبريطانية.',
    '{}'::jsonb
  ),
  (
    'about',
    'About Elite Schools',
    'عن مدارس إيليت',
    'Our Story',
    'قصتنا',
    'Elite Schools was founded with a vision to provide premium education that combines academic excellence with character development.',
    'تأسست مدارس إيليت برؤية لتقديم تعليم متميز يجمع بين التفوق الأكاديمي وتنمية الشخصية.',
    '{"vision_en": "To be the leading educational institution in Egypt and the region.", "vision_ar": "أن نكون المؤسسة التعليمية الرائدة في مصر والمنطقة.", "mission_en": "Empowering students with knowledge, skills, and values.", "mission_ar": "تمكين الطلاب بالمعرفة والمهارات والقيم."}'::jsonb
  ),
  (
    'why_choose_us',
    'Why Choose Elite?',
    'لماذا مدارس إيليت؟',
    'Excellence in Every Aspect',
    'التميز في كل جانب',
    NULL,
    NULL,
    '[{"icon": "Award", "title_en": "Academic Excellence", "title_ar": "التميز الأكاديمي", "desc_en": "Top-ranked curriculum with outstanding results.", "desc_ar": "مناهج عالية الجودة مع نتائج متميزة."}, {"icon": "Globe", "title_en": "International Programs", "title_ar": "برامج دولية", "desc_en": "American and British curricula recognized worldwide.", "desc_ar": "مناهج أمريكية وبريطانية معترف بها عالميًا."}, {"icon": "Users", "title_en": "Expert Faculty", "title_ar": "أعضاء هيئة تدريس متميزون", "desc_en": "Qualified and dedicated teachers for every subject.", "desc_ar": "معلمون مؤهلون ومتفانون في كل مادة."}, {"icon": "Layers", "title_en": "Modern Facilities", "title_ar": "مرافق حديثة", "desc_en": "State-of-the-art labs, sports facilities, and more.", "desc_ar": "مختبرات ومرافق رياضية متطورة وأكثر."}, {"icon": "Heart", "title_en": "Holistic Development", "title_ar": "التنمية الشاملة", "desc_en": "Academic, social, and personal growth for every student.", "desc_ar": "النمو الأكاديمي والاجتماعي والشخصي لكل طالب."}, {"icon": "Shield", "title_en": "Safe Environment", "title_ar": "بيئة آمنة", "desc_en": "A secure and nurturing environment for all students.", "desc_ar": "بيئة آمنة وداعمة لجميع الطلاب."}]'::jsonb
  ),
  (
    'cta',
    'Start Your Journey',
    'ابدأ رحلتك',
    'Join thousands of students achieving their full potential',
    'انضم لآلاف الطلاب الذين يحققون إمكاناتهم الكاملة',
    NULL,
    NULL,
    '{}'::jsonb
  ),
  (
    'stats',
    'Our Numbers',
    'أرقامنا',
    NULL,
    NULL,
    NULL,
    NULL,
    '[{"value": 2500, "suffix": "+", "label_en": "Students", "label_ar": "طالب وطالبة", "icon": "GraduationCap"}, {"value": 150, "suffix": "+", "label_en": "Expert Teachers", "label_ar": "معلم متميز", "icon": "Users"}, {"value": 25, "suffix": "+", "label_en": "Years of Excellence", "label_ar": "سنوات من التميز", "icon": "Award"}, {"value": 4, "suffix": "", "label_en": "Academic Programs", "label_ar": "برامج أكاديمية", "icon": "BookOpen"}]'::jsonb
  ),
  (
    'faq',
    'Frequently Asked Questions',
    'الأسئلة الشائعة',
    'Everything You Need to Know',
    'كل ما تحتاج معرفته',
    NULL,
    NULL,
    '[{"q_en": "When are admissions open?", "q_ar": "متى يكون القبول مفتوحًا؟", "a_en": "Admissions are open throughout the year. We recommend applying early to secure your child''s place.", "a_ar": "القبول مفتوح طوال العام. نوصي بالتقديم مبكرًا لضمان مكان لطفلك."}, {"q_en": "What is the difference between American and British systems?", "q_ar": "ما الفرق بين النظامين الأمريكي والبريطاني؟", "a_en": "The American system follows US Common Core standards leading to SAT/ACT qualifications. The British system follows Cambridge/Edexcel leading to IGCSE and A-Levels.", "a_ar": "النظام الأمريكي يتبع معايير Common Core الأمريكية ويؤدي إلى SAT/ACT. النظام البريطاني يتبع Cambridge/Edexcel ويؤدي إلى IGCSE ومستويات A."}, {"q_en": "Is there a school bus service?", "q_ar": "هل يوجد باص مدرسي؟", "a_en": "Yes, we offer school bus service covering major areas. Please contact us for route details.", "a_ar": "نعم، نوفر خدمة باص مدرسي تغطي المناطق الرئيسية. يرجى التواصل معنا للتفاصيل."}, {"q_en": "What are the tuition fees?", "q_ar": "ما هي المصاريف الدراسية؟", "a_en": "Fees vary by grade level and academic system. Please visit our Admissions page for a full breakdown.", "a_ar": "تتفاوت المصاريف حسب المرحلة الدراسية والنظام التعليمي. يرجى زيارة صفحة القبول للاطلاع على التفاصيل الكاملة."}, {"q_en": "What extracurricular activities are available?", "q_ar": "ما الأنشطة اللامنهجية المتاحة؟", "a_en": "We offer sports, arts, music, robotics, debate club, and many more enrichment programs.", "a_ar": "نقدم الرياضة والفنون والموسيقى والروبوتيات ونادي النقاش والعديد من البرامج الإثرائية."}]'::jsonb
  );

ALTER TABLE public.page_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read page_content" ON public.page_content
  FOR SELECT USING (true);

CREATE POLICY "Admin can manage page_content" ON public.page_content
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_posts_type         ON public.posts(type);
CREATE INDEX IF NOT EXISTS idx_posts_published    ON public.posts(is_published);
CREATE INDEX IF NOT EXISTS idx_posts_featured     ON public.posts(is_featured);
CREATE INDEX IF NOT EXISTS idx_posts_slug         ON public.posts(slug);
CREATE INDEX IF NOT EXISTS idx_gallery_category   ON public.gallery(category);
CREATE INDEX IF NOT EXISTS idx_gallery_active     ON public.gallery(is_active);
CREATE INDEX IF NOT EXISTS idx_tuition_system     ON public.tuition_fees(system_id);
CREATE INDEX IF NOT EXISTS idx_admissions_created ON public.admissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admissions_system  ON public.admissions(selected_system);
CREATE INDEX IF NOT EXISTS idx_page_content_key   ON public.page_content(section_key);
CREATE INDEX IF NOT EXISTS idx_systems_slug       ON public.academic_systems(slug);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_site_settings_updated
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_academic_systems_updated
  BEFORE UPDATE ON public.academic_systems
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_posts_updated
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_page_content_updated
  BEFORE UPDATE ON public.page_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- STORAGE BUCKETS
-- Run these manually in Supabase Dashboard → Storage
-- Or uncomment and run:
-- ============================================================
-- INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
-- VALUES
--   ('hero-videos', 'hero-videos', true, 52428800, ARRAY['video/mp4', 'video/webm']),
--   ('gallery-images', 'gallery-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
--   ('post-thumbnails', 'post-thumbnails', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp']),
--   ('system-images', 'system-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']);
