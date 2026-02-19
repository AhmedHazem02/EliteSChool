import { createClient } from '@/lib/supabase/server';
import { buildMetadata, generateArticleSchema } from '@/lib/seo';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import PageTransition from '@/components/shared/PageTransition';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface Props {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale, id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from('posts').select('title_en, title_ar, content_en').eq('id', id).single();
  if (!data) return {};
  const title = locale === 'ar' ? data.title_ar : data.title_en;
  const desc = data.content_en?.replace(/<[^>]*>/g, '').slice(0, 160) ?? '';
  return buildMetadata({ title: title ?? '', description: desc, path: `/${locale}/news/${id}`, locale });
}

export default async function NewsArticlePage({ params }: Props) {
  const { locale, id } = await params;
  const isAR = locale === 'ar';
  const supabase = await createClient();

  const { data: post } = await supabase
    .from('posts')
    .select('id, title_en, title_ar, content_en, content_ar, thumbnail_url, type, created_at, is_published, slug')
    .eq('id', id)
    .eq('is_published', true)
    .single();

  if (!post) notFound();

  const title = isAR ? post.title_ar : post.title_en;
  const content = isAR ? post.content_ar : post.content_en;
  const schema = generateArticleSchema({ ...post, title_en: post.title_en ?? '' });
  const Arrow = isAR ? ArrowRight : ArrowLeft;

  return (
    <PageTransition>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <main>
        {/* Hero */}
        <div className="bg-navy text-white pt-24 pb-12">
          <div className="container mx-auto px-4 max-w-3xl">
            <Breadcrumbs
              items={[
                { label: isAR ? 'الأخبار' : 'News', href: `/${locale}/news` },
                { label: title ?? '', href: `/${locale}/news/${id}` },
              ]}
              light
            />
            {post.type && <Badge variant="gold" className="mt-6 mb-4">{post.type}</Badge>}
            <h1 className="text-3xl md:text-4xl font-bold font-playfair leading-snug">{title}</h1>
            <p className="text-white/50 text-sm mt-3">{formatDate(post.created_at)}</p>
          </div>
        </div>

        {/* Hero image */}
        {post.thumbnail_url && (
          <div className="relative aspect-video max-h-[480px] overflow-hidden">
            <Image src={post.thumbnail_url} alt={title ?? ''} fill className="object-cover" priority sizes="100vw" />
          </div>
        )}

        {/* Content */}
        <article className="section-padding bg-white">
          <div className="container mx-auto px-4 max-w-3xl">
            {content ? (
              <div
                className="prose prose-navy max-w-none leading-relaxed"
                dir={isAR ? 'rtl' : 'ltr'}
                dangerouslySetInnerHTML={{ __html: content }}
              />
            ) : (
              <p className="text-navy/50 italic">{isAR ? 'لا يوجد محتوى.' : 'No content available.'}</p>
            )}

            <div className="mt-10 pt-6 border-t border-navy/10">
              <Link
                href={`/${locale}/news`}
                className="inline-flex items-center gap-1.5 text-gold font-medium hover:underline text-sm"
              >
                <Arrow size={15} />
                {isAR ? 'العودة إلى الأخبار' : 'Back to News'}
              </Link>
            </div>
          </div>
        </article>
      </main>
    </PageTransition>
  );
}
