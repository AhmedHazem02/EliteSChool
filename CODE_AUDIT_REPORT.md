# 🔍 Elite Schools — تقرير فحص شامل للكود
## Code Audit Report: Performance & Clean Code

**التاريخ:** 2026-03-05  
**المشروع:** Elite Schools (Next.js 16 + Supabase + next-intl)

---

## 📊 ملخص تنفيذي

| المستوى | العدد | الوصف |
|---------|-------|-------|
| 🔴 **حرج (Critical)** | 6 | ثغرات أمنية وأخطاء تمنع عمل المشروع بشكل صحيح |
| 🟠 **عالي (High)** | 12 | مشاكل أداء كبيرة وأخطاء وظيفية |
| 🟡 **متوسط (Medium)** | 25 | مشاكل Clean Code وأداء متوسطة |
| 🔵 **منخفض (Low)** | 20+ | تحسينات وتنظيف كود |

---

## 🔴 المشاكل الحرجة (CRITICAL)

### C1. Server Actions بدون تحقق من الصلاحيات (Authentication)
**الملفات:** `src/app/actions/admin.ts` — `src/app/actions/content.ts`  
**الخطورة:** أي شخص يمكنه استدعاء هذه الـ Server Actions وتعديل البيانات بدون تسجيل دخول.

```typescript
// ❌ الحالي — لا يوجد أي تحقق من المستخدم
export async function saveAcademicSystem(payload: AcademicSystemPayload) {
  const supabase = createAdminClient(); // service role — full access
  // ... يعدل البيانات مباشرة
}

// ✅ المطلوب
export async function saveAcademicSystem(payload: AcademicSystemPayload) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');
  
  const adminSupabase = createAdminClient();
  // ... الآن نعدل البيانات
}
```

### C2. `saveSiteSettings` تقبل أي بيانات بدون تصفية
**الملف:** `src/app/actions/admin.ts` (سطر ~124)

```typescript
// ❌ الحالي — يقبل أي key بما فيها id, created_at
export async function saveSiteSettings(settings: Record<string, any>) {
  const supabase = createAdminClient();
  await supabase.from('site_settings').update(settings)...
}

// ✅ المطلوب — whitelist للحقول المسموحة فقط + Zod validation
const SettingsSchema = z.object({
  hero_video_url: z.string().url().nullable(),
  hero_image_url: z.string().url().nullable(),
  // ... الحقول المسموحة فقط
});
```

### C3. خطأ في Sitemap — اسم عمود خاطئ
**الملف:** `src/app/sitemap.ts` (سطر ~10)

```typescript
// ❌ الحالي — الاستعلام لا يرجع أي نتائج!
.eq('published', true)    // العمود غير موجود

// ✅ المطلوب
.eq('is_published', true)  // اسم العمود الصحيح
```
**النتيجة:** صفحات الأخبار لا تظهر أبداً في خريطة الموقع = خسارة SEO كبيرة.

### C4. XSS عبر `dangerouslySetInnerHTML`
**الملف:** `src/app/[locale]/news/[id]/page.tsx` (سطر ~64)

```typescript
// ❌ الحالي — يعرض HTML خام من قاعدة البيانات بدون تنظيف
<div dangerouslySetInnerHTML={{ __html: content }} />

// ✅ المطلوب — استخدم DOMPurify أو sanitize-html
import DOMPurify from 'isomorphic-dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }} />
```

### C5. MasonryGrid — كلاسات Tailwind لن تعمل في الإنتاج
**الملف:** `src/components/shared/MasonryGrid.tsx` (سطر ~31-34)

```typescript
// ❌ الحالي — Tailwind JIT لا يستطيع اكتشاف الكلاسات الديناميكية
`columns-${columns.default}`,     // ❌ لن ينتج CSS
`md:columns-${columns.md}`,       // ❌ لن ينتج CSS
`lg:columns-${columns.lg}`,       // ❌ لن ينتج CSS

// ✅ المطلوب — lookup map أو safelist
const COLUMN_CLASSES = {
  1: 'columns-1', 2: 'columns-2', 3: 'columns-3', 4: 'columns-4',
};
```
**النتيجة:** الشبكة معطلة تماماً في بيئة الإنتاج.

### C6. حذف الرسوم ثم إضافتها بدون Transaction
**الملف:** `src/app/actions/admin.ts` (سطر ~52-55)  
حذف جميع الرسوم أولاً ثم إضافة الجديدة — إذا فشلت الإضافة، **تضيع جميع الرسوم بشكل دائم**.

```typescript
// ❌ الحالي — delete-all then insert
await supabase.from('fees').delete().eq('system_id', systemId);
await supabase.from('fees').insert(feesRows); // إذا فشل هنا؟ الرسوم راحت!

// ✅ المطلوب — استخدم upsert أو transaction
```

---

## 🟠 المشاكل عالية الخطورة (HIGH)

### H1. Middleware Auth — فحص اسم الكوكي فقط
**الملف:** `src/proxy.ts` (سطر ~23-26)

```typescript
// ❌ الحالي — يكفي إنشاء كوكي باسم sb-x-auth-token لتجاوز الحماية
cookie.name.startsWith('sb-') && cookie.name.endsWith('-auth-token')

// ✅ المطلوب — استخدم supabase.auth.getUser() للتحقق الحقيقي
```

### H2. استدعاء `revalidateTag` بعدد خاطئ من المعاملات
**الملف:** `src/app/api/revalidate/route.ts` (سطر ~10)

```typescript
// ❌ الحالي — revalidateTag تقبل معامل واحد فقط
revalidateTag(tag, 'default')  // الوسيط الثاني غير صالح

// ✅ المطلوب
revalidateTag(tag)
```

### H3. `force-dynamic` في جميع الصفحات العامة
**الملفات:** جميع صفحات `[locale]/`  
كل صفحة تستخدم `export const dynamic = 'force-dynamic'` مما يعني:
- ❌ لا يوجد أي Cache على الإطلاق
- ❌ كل زيارة = استعلامات قاعدة بيانات جديدة
- ❌ TTFB عالي وتجربة مستخدم بطيئة

```typescript
// ❌ الحالي
export const dynamic = 'force-dynamic';

// ✅ المطلوب — استخدم ISR مع revalidation عند التعديل من لوحة التحكم
export const revalidate = 60; // أو استخدم on-demand revalidation
```

### H4. صفحة المعرض تعرض العناصر غير المفعلة
**الملف:** `src/app/[locale]/gallery/page.tsx` (سطر ~28-30)

```typescript
// ❌ الحالي — لا يوجد فلتر is_active
supabase.from('gallery').select('*').order('sort_order')

// ✅ المطلوب
supabase.from('gallery').select('*').eq('is_active', true).order('sort_order')
```

### H5. TestimonialsSection — requestAnimationFrame بلا توقف
**الملف:** `src/components/sections/TestimonialsSection.tsx` (سطر ~97-114)

```typescript
// ❌ حلقة requestAnimationFrame تعمل 60fps حتى عندما المكون خارج الشاشة
// تستهلك CPU/Battery بلا فائدة
```
**الحل:** استخدم `IntersectionObserver` لإيقاف الحركة عند الخروج من الشاشة.

### H6. SmoothScroll يمنع التمرير الطبيعي
**الملف:** `src/components/shared/SmoothScroll.tsx` (سطر ~102-104)

```typescript
// ❌ e.preventDefault() يكسر سلوك التمرير الأصلي
// مشكلة كبيرة لمستخدمي التقنيات المساعدة (Screen Readers)
// { passive: false } يطلق تحذير Chrome DevTools
```

### H7. MediaUploader — تسريب ذاكرة (Memory Leak)
**الملف:** `src/components/admin/MediaUploader.tsx` (سطر ~41)

```typescript
// ❌ الحالي — URL.createObjectURL لا يتم تحريره أبداً
const url = URL.createObjectURL(f);

// ✅ المطلوب — إضافة cleanup
useEffect(() => {
  return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); };
}, [previewUrl]);
```

### H8. Lightbox و MobileMenu — تعارض في body overflow
**الملفات:** `src/components/shared/Lightbox.tsx` — `src/components/layout/MobileMenu.tsx`  
كلاهما يعدل `document.body.style.overflow` بشكل مباشر. إذا فُتحا معاً، إغلاق أحدهما يعيد التمرير بينما الآخر لا يزال مفتوحاً.

**الحل:** إنشاء utility مشتركة تستخدم counter لإدارة الحالة.

### H9. مقارة السر عرضة لـ Timing Attack
**الملف:** `src/app/api/revalidate/route.ts` (سطر ~8)

```typescript
// ❌ الحالي
if (secret !== process.env.REVALIDATION_SECRET)

// ✅ المطلوب
import { timingSafeEqual } from 'crypto';
const isValid = timingSafeEqual(Buffer.from(secret), Buffer.from(process.env.REVALIDATION_SECRET));
```

### H10. AdmissionsForm و ContactForm — كتابة مباشرة لقاعدة البيانات من العميل
**الملفات:** `src/components/admissions/AdmissionsForm.tsx` — `src/components/contact/ContactForm.tsx`

```typescript
// ❌ الحالي — Supabase insert مباشرة من المتصفح بدون Server Action
const { error } = await supabase.from('admissions').insert([...]);
```
**المخاطر:** لا يوجد server-side validation، يمكن التلاعب بالبيانات.

### H11. useScrollDirection — إعادة render في كل حركة تمرير
**الملف:** `src/hooks/useScrollDirection.ts`

```typescript
// ❌ الحالي — prevScrollY في state يسبب re-render في كل scroll event
const [prevScrollY, setPrevScrollY] = useState(0);

// ✅ المطلوب — استخدم useRef
const prevScrollY = useRef(0);
```

### H12. LoadingSkeleton — `Math.random()` يسبب Layout Shift
**الملف:** `src/components/shared/LoadingSkeleton.tsx` (سطر ~25)

```typescript
// ❌ الحالي — عرض مختلف في كل render
style={{ width: `${Math.random() * 40 + 60}%` }}

// ✅ المطلوب — قيمة ثابتة بناءً على الفهرس
style={{ width: `${60 + (i * 13) % 40}%` }}
```

---

## 🟡 مشاكل متوسطة (MEDIUM)

### M1. صفحة About — متغيرات محسوبة لكن غير مستخدمة
**الملف:** `src/app/[locale]/about/page.tsx` (سطر ~53-60)

`missionText` و `visionText` يتم حسابهما من قاعدة البيانات لكن **لا يتم استخدامهما**. تعديلات المحتوى من لوحة التحكم ليس لها أي تأثير.

### M2. تكرار استعلامات Supabase (Duplicate Queries)
**الملفات:**
- `src/app/[locale]/news/[id]/page.tsx` — `generateMetadata` و الصفحة يستعلمان نفس البيانات
- `src/app/[locale]/programs/[system]/page.tsx` — نفس المشكلة

**الحل:** استخدم React `cache()` لمشاركة نتائج الاستعلام.

```typescript
import { cache } from 'react';
const getPost = cache(async (id: string) => {
  const supabase = await createClient();
  return supabase.from('posts').select('*').eq('id', id).single();
});
```

### M3. لا يوجد Pagination في صفحات الإدارة
**الملفات:** `src/app/admin/admissions/page.tsx` — `src/app/admin/posts/page.tsx` — `src/app/admin/gallery/page.tsx`  
جميع الصفحات تجلب **كل** البيانات بدون ترقيم صفحات. سيتدهور الأداء مع زيادة البيانات.

### M4. تمرير messages بالكامل لـ NextIntlClientProvider
**الملف:** `src/app/[locale]/layout.tsx` (سطر ~68-69)

```typescript
// ❌ الحالي — يرسل جميع الترجمات للعميل
const messages = await getMessages();
<NextIntlClientProvider messages={messages}>

// ✅ المطلوب — أرسل فقط الـ namespaces المطلوبة
const messages = await getMessages();
const clientMessages = pick(messages, ['nav', 'hero', 'common']);
```

### M5. تكرار نمط `locale === 'ar' ? item.ar : item.en`
**الملفات:** جميع المكونات تقريباً  
هذا النمط مكرر عشرات المرات. يجب إنشاء utility function:

```typescript
// ✅ المطلوب
function localize<T extends { en: string; ar: string }>(item: T, locale: string): string {
  return locale === 'ar' ? item.ar : item.en;
}
```

### M6. Hardcoded Data في مكونات الأقسام
**الملفات المتأثرة:**
- `AboutSection.tsx` — highlights مكتوبة في الكود
- `FAQSection.tsx` — أسئلة شائعة مكتوبة في الكود
- `StatsSection.tsx` — إحصائيات مكتوبة في الكود
- `TestimonialsSection.tsx` — شهادات مكتوبة في الكود
- `WhyChooseUsSection.tsx` — مميزات مكتوبة في الكود

**المشكلة:** بيانات ثنائية اللغة مبعثرة في مكونات متعددة بدلاً من ملف constants واحد.

### M7. Unused Imports
| الملف | الـ Import غير المستخدم |
|-------|------------------------|
| `FAQSection.tsx` | `useState` |
| `HeroSection.tsx` | `ChevronDown` |
| `ProgramsSection.tsx` | `Image` |
| `HorizontalGallery.tsx` | `SectionHeader` |
| `Navbar.tsx` | `useLocale` |
| `FloatingParticles.tsx` | `useMemo` |
| `news/page.tsx` | `SectionHeader` |
| `programs/page.tsx` | `SectionHeader` |

### M8. استخدام Index كـ Key في القوائم الديناميكية
**الملفات:**
- `AboutSection.tsx` — highlights list
- `FAQSection.tsx` — FAQ items
- `StatsSection.tsx` — stats
- `TestimonialsSection.tsx` — testimonials (tripled array)
- `FeesManager.tsx` — fee rows

### M9. مكونات `'use client'` بدون حاجة
**الملفات:**
- `Footer.tsx` — لا يوجد تفاعل، يمكن أن يكون Server Component
- `CTASection.tsx` — محتوى ثابت بدون hooks تفاعلية

### M10. روابط Placeholder في الإنتاج
| الملف | المشكلة |
|-------|---------|
| `Footer.tsx` | روابط Social media كلها `href="#"` |
| `Footer.tsx` | Privacy و Terms تشير للصفحة الرئيسية |
| `CTASection.tsx` | رقم هاتف وهمي `+20 (xx) xxxxxxxx` |

### M11. بيانات الاتصال مكتوبة مباشرة في الكود ومتضاربة
| الملف | البريد الإلكتروني |
|-------|------------------|
| `CTASection.tsx` | `info@elite-schools.com` |
| `ContactForm.tsx` | `info@eliteschools.edu` |
| `Footer.tsx` | `info@elite-schools.com` |

**الحل:** جلب بيانات الاتصال من `site_settings` في قاعدة البيانات.

### M12. صفحة الأخبار تجلب content بالكامل لعمل excerpt
**الملف:** `src/app/[locale]/news/page.tsx` (سطر ~34-37)

```typescript
// ❌ الحالي — يجلب المحتوى كاملاً فقط لقص 100 حرف
content_en, content_ar  // ثم content.replace(/<[^>]*>/g, '').slice(0, 100)

// ✅ المطلوب — استخدم excerpt_en, excerpt_ar المتوفرين في قاعدة البيانات
```

### M13. useCountUp — تكرار useInView
**الملف:** `src/hooks/useCountUp.ts` (سطر ~40-59)  
يحتوي على نسخة مكررة من `useInView` بدلاً من استيراد الموجودة في `useInView.ts`.

### M14. useCountUp — تسريب requestAnimationFrame
**الملف:** `src/hooks/useCountUp.ts` (سطر ~23-29)  
لا يتم حفظ rAF ID ولا إلغاؤه عند unmount. يسبب تسريب ذاكرة.

### M15. GallerySection — فلترة بدون useMemo
**الملفات:** `src/components/sections/GallerySection.tsx` — `src/components/gallery/GalleryClientFilter.tsx`

```typescript
// ❌ الحالي — يعاد حسابها في كل render
const filtered = category === 'all' ? items : items.filter(...)

// ✅ المطلوب
const filtered = useMemo(() => 
  category === 'all' ? items : items.filter(...), 
  [items, category]
);
```

### M16. Preloader — تأخير إجباري 2 ثانية
**الملف:** `src/components/shared/Preloader.tsx` (سطر ~14)

```typescript
// ❌ حد أدنى 2 ثوانٍ — يبطئ التحميل بدون فائدة على الاتصالات السريعة
```

### M17. SEO Schema — بيانات مفقودة
**الملف:** `src/lib/seo.ts`

- `sameAs: []` — روابط التواصل الاجتماعي غير مضمنة
- `generateArticleSchema` يتوقع `image_url` لكن `Post` يحتوي على `thumbnail_url` — صورة المقال في Schema دائماً فارغة
- العنوان والوصف مكتوبان مباشرة بدلاً من جلبهما من قاعدة البيانات

### M18. Sitemap يستخدم UUID بدلاً من Slug
**الملف:** `src/app/sitemap.ts` (سطر ~36, ~42)

```typescript
// ❌ الحالي
url: `${SITE_URL}/${locale}/news/${post.id}`      // UUID غير مفهوم
url: `${SITE_URL}/${locale}/programs/${sys.id}`    // UUID غير مفهوم

// ✅ المطلوب
url: `${SITE_URL}/${locale}/news/${post.slug}`
url: `${SITE_URL}/${locale}/programs/${sys.slug}`
```

---

## 🔵 مشاكل منخفضة / تحسينات (LOW)

### L1. Accessibility Issues

| المكون | المشكلة |
|--------|---------|
| `Lightbox.tsx` | لا يوجد Focus Trap — المستخدم يمكنه التنقل للعناصر خلف الـ Lightbox |
| `MobileMenu.tsx` | لا يوجد Focus Trap ولا `role="dialog"` |
| `TestimonialsSection.tsx` | لا يمكن إيقاف الحركة بالكيبورد — يخالف WCAG 2.2.2 |
| `GallerySection.tsx` | أزرار الفلتر بدون `aria-pressed` |
| `AboutSection.tsx` | `<Link>` يحتوي `<Button>` = `<a><button>` nesting غير صالح |
| `AnimatedCounter.tsx` | Screen readers تقرأ كل رقم كعنصر منفصل بدلاً من الرقم الكامل |
| `SettingsMediaField.tsx` | منطقة السحب والإفلات غير قابلة للوصول بالكيبورد |
| `HeroSection.tsx` | لا يوجد `prefers-reduced-motion` check مع 40 جسيم متحرك |
| `Navbar.tsx` | لا يوجد `aria-current="page"` على روابط التنقل |
| `BackToTop.tsx` | `animate-ping` لا يحترم `prefers-reduced-motion` |

### L2. أنماط CSS مكررة في globals.css
**الملف:** `src/styles/globals.css`
- ألوان معرفة في `@theme {}` و `:root {}` — تكرار قد يسبب عدم تطابق
- استخدام مفرط لـ `!important` في أنماط الوضع الداكن

### L3. Navbar Scroll Handler بدون Throttling
**الملف:** `src/components/layout/Navbar.tsx` (سطر ~26-29)

```typescript
// ❌ يطلق state update في كل حدث scroll بدون throttle
useEffect(() => {
  const handleScroll = () => setScrolled(window.scrollY > 50);
  window.addEventListener('scroll', handleScroll, { passive: true });
  ...
});
```

### L4. LanguageSwitcher — URL Corruption Risk
**الملف:** `src/components/layout/LanguageSwitcher.tsx` (سطر ~23)

```typescript
// ❌ يستبدل أول ظهور فقط — قد يفسد URLs مثل /en/content/en-us-program
pathname.replace(`/${locale}`, `/${otherLocale}`)

// ✅ المطلوب — regex مثبت في البداية
pathname.replace(new RegExp(`^/${locale}`), `/${otherLocale}`)
```

### L5. ThemeProvider — localStorage بدون try/catch
**الملف:** `src/components/shared/ThemeProvider.tsx` (سطر ~26)

```typescript
// ❌ الحالي — يرمي خطأ في بيئات مقيدة
localStorage.getItem('elite-theme')

// ✅ المطلوب
try { return localStorage.getItem('elite-theme'); } catch { return null; }
```

### L6. MagneticButton — Dead Code
**الملف:** `src/components/shared/MagneticButton.tsx`
- `hovered` state يتم تعيينها لكن **لا تُقرأ أبداً**
- `as` و `href` props معرفة في الـ interface لكن **لا تُستخدم**

### L7. AdminSidebar — Supabase Client يُنشأ في كل Render
**الملف:** `src/components/layout/AdminSidebar.tsx` (سطر ~47)

```typescript
// ❌ الحالي
const supabase = createClient(); // في جسم المكون

// ✅ المطلوب — داخل handler أو useMemo
const handleLogout = async () => {
  const supabase = createClient();
  await supabase.auth.signOut();
};
```

### L8. LoginClient — نفس مشكلة إنشاء Supabase Client
**الملف:** `src/app/login/LoginClient.tsx` (سطر ~22)

### L9. PageTransition — Exit Animation لن تعمل
**الملف:** `src/components/shared/PageTransition.tsx`  
الخاصية `exit` لن تعمل بدون `<AnimatePresence>` في المكون الأب.

### L10. HeroSection — الصورة بـ inline style بدلاً من next/image
**الملف:** `src/components/sections/HeroSection.tsx` (سطر ~57-62)

```typescript
// ❌ يتجاوز تحسينات Next.js Image — لا WebP ولا responsive sizes
style={{ backgroundImage: `url(${heroImageUrl})` }}

// ✅ المطلوب — استخدم <Image> مع fill
```

### L11. InfiniteAnimations بدون توقف خارج الشاشة
**الملفات:**
- `AboutSection.tsx` — Decorative rotation animations
- `GeometricDecoration.tsx` — Infinite CSS rotation (60s + 80s)
- `FloatingParticles.tsx` — Canvas animation loop بدون IntersectionObserver

### L12. Video في HeroSection بدون preload
**الملف:** `src/components/sections/HeroSection.tsx`

```typescript
// ❌ المتصفح يحمل الفيديو كاملاً
<video autoPlay ...>

// ✅ المطلوب
<video autoPlay preload="metadata" ...>
```

### L13. JSON-LD في Client Components
**الملفات:** `FAQSection.tsx` — `Breadcrumbs.tsx`  
Structured data يتم إنشاؤها داخل Client Components — قد لا تكون متاحة في الـ HTML الأولي لمحركات البحث.

### L14. Admin Pages — مؤشرات حالة وهمية
**الملف:** `src/app/admin/page.tsx` (سطر ~85-93)  
مؤشرات "Connected" / "Active" / "Enabled" **مكتوبة مباشرة** ولا تفحص الحالة الحقيقية.

### L15. ContactForm تستخدم جدول admissions
**الملف:** `src/components/contact/ContactForm.tsx`

```typescript
// ❌ Design smell — يستخدم نفس جدول الطلبات مع قيم وهمية
student_name: 'N/A',
grade_level: 'contact-inquiry',  // magic string
```

### L16. AcademicSystemForm — لا يوجد Error Handling
**الملفات:** `AcademicSystemForm.tsx` — `PostForm.tsx` — `GalleryDeleteButton.tsx`  
لا يوجد try/catch حول Server Action calls — إذا فشل الطلب، الزر يبقى معطلاً للأبد.

### L17. Supabase Clients — Non-null assertions
**الملفات:** `src/lib/supabase/admin.ts` — `src/lib/supabase/client.ts`

```typescript
// ❌ الحالي — خطأ غير واضح إذا لم تكن المتغيرات موجودة
process.env.NEXT_PUBLIC_SUPABASE_URL!

// ✅ المطلوب — تحقق صريح
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
if (!url) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
```

### L18. AdmissionsForm — Academic Systems مكتوبة مباشرة
**الملف:** `src/components/admissions/AdmissionsForm.tsx` (سطر ~107-110)

```typescript
// ❌ الحالي — قيم ثابتة
['British', 'American', 'Egyptian National']

// ✅ المطلوب — جلبها من جدول academic_systems
```

### L19. Tailwind Config — require() syntax
**الملف:** `tailwind.config.ts` (سطر ~136)

```typescript
// ❌ require() في TypeScript
plugins: [require('tailwindcss-animate')],

// ✅ المطلوب
import tailwindAnimate from 'tailwindcss-animate';
plugins: [tailwindAnimate],
```

### L20. globals.css — Dead CSS Rule
**الملف:** `src/styles/globals.css` (سطر ~374-381)  
`.btn-ripple:active::after` يعين `opacity: 0` ثم `opacity: 0.4` — السطر الأول بلا فائدة.

---

## 📋 خطة الإصلاح المقترحة (حسب الأولوية)

### المرحلة 1 — حرج (يجب الإصلاح فوراً)
1. ✅ إضافة Auth checks لجميع Server Actions
2. ✅ إصلاح Sitemap column name (`is_published`)
3. ✅ إصلاح MasonryGrid dynamic classes
4. ✅ إضافة HTML sanitization لـ `dangerouslySetInnerHTML`
5. ✅ تحويل fee sync إلى atomic operation
6. ✅ إضافة input validation لـ `saveSiteSettings`

### المرحلة 2 — أداء عالي
7. استبدال `force-dynamic` بـ ISR + on-demand revalidation
8. نقل form submissions من client-side إلى Server Actions
9. إصلاح `useScrollDirection` (useRef بدلاً من useState)
10. إضافة `IntersectionObserver` لـ TestimonialsSection animation
11. إضافة pagination لصفحات الإدارة
12. تحسين scroll handler في Navbar (throttling)

### المرحلة 3 — Clean Code
13. إنشاء `localize()` utility function
14. نقل hardcoded data إلى constants file
15. حذف unused imports
16. إصلاح duplicate Supabase queries بـ React `cache()`
17. استخدام excerpt fields بدلاً من content stripping
18. إنشاء shared body scroll lock utility
19. إصلاح `<Link><Button>` nesting pattern

### المرحلة 4 — Accessibility
20. إضافة Focus Traps لـ Lightbox و MobileMenu
21. إضافة `prefers-reduced-motion` checks
22. إصلاح ARIA attributes (aria-pressed, aria-current, etc.)
23. إصلاح AnimatedCounter screen reader support
24. إضافة keyboard navigation للـ Gallery lightbox

---

> **ملاحظة:** هذا التقرير يغطي فحص شامل لجميع ملفات المشروع. الأرقام المشار إليها هي أرقام الأسطر التقريبية وقد تختلف قليلاً.
