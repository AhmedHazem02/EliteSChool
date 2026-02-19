import { createClient } from '@/lib/supabase/server';
import { buildMetadata } from '@/lib/seo';
import Link from 'next/link';
import Image from 'next/image';
import SectionHeader from '@/components/shared/SectionHeader';
import ScrollReveal from '@/components/shared/ScrollReveal';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import PageTransition from '@/components/shared/PageTransition';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildMetadata({
    title: locale === 'ar' ? 'الأخبار والفعاليات' : 'News & Events',
    description: locale === 'ar' ? 'آخر أخبار مدارس إليت' : 'Latest news and events from Elite Schools.',
    path: `/${locale}/news`,
    locale,
  });
}

export default async function NewsPage({ params }: Props) {
  const { locale } = await params;
  const isAR = locale === 'ar';
  const supabase = await createClient();

  const { data: posts } = await supabase
    .from('posts')
    .select('id, title_en, title_ar, content_en, content_ar, thumbnail_url, type, created_at')
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  return (
    <PageTransition>
      <main>
        <div className="bg-navy text-white py-24 text-center">
          <div className="container mx-auto px-4">
            <Breadcrumbs
              items={[
                { label: isAR ? 'الأخبار' : 'News', href: `/${locale}/news` },
              ]}
              light
            />
            <h1 className="text-4xl md:text-5xl font-bold font-playfair mt-6">
              {isAR ? 'الأخبار والفعاليات' : 'News & Events'}
            </h1>
          </div>
        </div>

        <section className="section-padding bg-off-white">
          <div className="container mx-auto px-4">
            {(!posts || posts.length === 0) ? (
              <div className="text-center py-20 text-navy/40">
                {isAR ? 'لا توجد مقالات منشورة بعد.' : 'No posts published yet.'}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post, i) => {
                  const title = isAR ? post.title_ar : post.title_en;
                  const content = isAR ? post.content_ar : post.content_en;
                  const excerpt = content ? content.replace(/<[^>]*>/g, '').slice(0, 100) + '…' : '';

                  return (
                    <ScrollReveal key={post.id} direction="up" delay={(i % 3) * 0.1}>
                      <Link href={`/${locale}/news/${post.id}`} className="group block h-full">
                        <article className="bg-white rounded-2xl overflow-hidden border border-navy/10 shadow-card hover:shadow-gold transition-all duration-300 h-full flex flex-col">
                          {post.thumbnail_url && (
                            <div className="relative aspect-video overflow-hidden">
                              <Image
                                src={post.thumbnail_url}
                                alt={title ?? ''}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                sizes="(max-width: 768px) 100vw, 33vw"
                              />
                            </div>
                          )}
                          <div className="p-5 flex flex-col flex-1">
                            {post.type && <Badge variant="secondary" className="self-start mb-3">{post.type}</Badge>}
                            <h2 className="text-base font-bold text-navy font-playfair mb-2 group-hover:text-gold transition-colors">{title}</h2>
                            {excerpt && <p className="text-navy/60 text-sm leading-relaxed flex-1">{excerpt}</p>}
                            <p className="text-xs text-navy/40 mt-3">{formatDate(post.created_at)}</p>
                          </div>
                        </article>
                      </Link>
                    </ScrollReveal>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
    </PageTransition>
  );
}
