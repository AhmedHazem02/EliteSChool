import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import SectionHeader from '@/components/shared/SectionHeader';
import ScrollReveal from '@/components/shared/ScrollReveal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import type { Post } from '@/types';

interface NewsSectionProps {
  locale: string;
  posts: Post[];
}

export default function NewsSection({ locale, posts }: NewsSectionProps) {
  const t = useTranslations('news');

  if (posts.length === 0) return null;

  return (
    <section className="section-padding bg-white" aria-label="News">
      <div className="container mx-auto px-4">
        <SectionHeader title={t('title')} subtitle={t('subtitle')} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {posts.slice(0, 3).map((post, i) => {
            const title = locale === 'ar' ? post.title_ar : post.title_en;
            const content = locale === 'ar' ? post.content_ar : post.content_en;
            const excerpt = content
              ? (content.replace(/<[^>]*>/g, '').slice(0, 100) + '…')
              : '';

            return (
              <ScrollReveal key={post.id} direction="up" delay={i * 0.1}>
                <Link href={`/${locale}/news/${post.id}`} className="group block h-full">
                    <article className="bg-white rounded-2xl overflow-hidden border border-navy/10 shadow-card hover:shadow-luxury transition-all duration-500 h-full flex flex-col card-shine card-lift group-hover:border-gold/20">
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
                      {post.type && (
                        <Badge variant="secondary" className="self-start mb-3">{post.type}</Badge>
                      )}
                      <h3 className="text-base font-bold text-navy font-playfair mb-2 group-hover:text-gold transition-colors duration-300">
                        {title}
                      </h3>
                      {excerpt && (
                        <p className="text-navy/60 text-sm leading-relaxed flex-1">{excerpt}</p>
                      )}
                      <p className="text-xs text-navy/40 mt-3">{formatDate(post.created_at)}</p>
                    </div>
                  </article>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link href={`/${locale}/news`}>
            <Button variant="outline" size="lg">{t('view_all')}</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
