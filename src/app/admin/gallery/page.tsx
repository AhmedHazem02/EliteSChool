import { createClient } from '@/lib/supabase/server';
import { getAdminLocale, adminT } from '@/lib/admin-i18n';
import Image from 'next/image';
import MediaUploader from '@/components/admin/MediaUploader';
import GalleryDeleteButton from '@/components/admin/GalleryDeleteButton';

export default async function AdminGalleryPage() {
  const supabase = await createClient();
  const locale = await getAdminLocale();
  const t = adminT(locale);
  const { data: items } = await supabase
    .from('gallery')
    .select('id, media_url, caption_en, caption_ar, category, sort_order')
    .order('sort_order');

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy font-playfair">{t('gallery.title')}</h1>
        <p className="text-navy/50 text-sm mt-1">{items?.length ?? 0} {t('gallery.items')}</p>
      </div>

      {/* Uploader */}
      <div className="mb-8">
        <MediaUploader />
      </div>

      {/* Grid */}
      {(items ?? []).length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {(items ?? []).map((item) => (
            <div key={item.id} className="group relative rounded-xl overflow-hidden border border-navy/10">
              <div className="aspect-square relative">
                <Image
                  src={item.media_url}
                  alt={(locale === 'ar' ? item.caption_ar : item.caption_en) ?? ''}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              </div>
              <div className="p-2">
                <p className="text-xs text-navy truncate">{locale === 'ar' ? (item.caption_ar || item.caption_en) : item.caption_en}</p>
                {item.category && (
                  <span className="text-[10px] text-navy/50">{item.category}</span>
                )}
              </div>
              <GalleryDeleteButton id={item.id} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-navy/40">{t('gallery.empty')}</div>
      )}
    </div>
  );
}
