import { createClient } from '@/lib/supabase/server';
import { getAdminLocale, adminT } from '@/lib/admin-i18n';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { Plus } from 'lucide-react';

export default async function AdminPostsPage() {
  const supabase = await createClient();
  const locale = await getAdminLocale();
  const t = adminT(locale);
  const { data: posts } = await supabase
    .from('posts')
    .select('id, title_en, title_ar, is_published, created_at, type')
    .order('created_at', { ascending: false });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy font-playfair">{t('posts.title')}</h1>
          <p className="text-navy/50 text-sm mt-1">{posts?.length ?? 0} {t('posts.count')}</p>
        </div>
        <Link href="/admin/posts/new">
          <Button size="sm" className="gap-1.5">
            <Plus size={16} /> {t('posts.newPost')}
          </Button>
        </Link>
      </div>

      <div className="space-y-3">
        {(posts ?? []).map((post) => (
          <Link key={post.id} href={`/admin/posts/${post.id}`} className="block">
            <div className="bg-white rounded-xl border border-navy/10 p-4 hover:shadow-card transition-shadow flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-navy text-sm truncate">{locale === 'ar' ? (post.title_ar || post.title_en) : post.title_en}</p>
                {(locale === 'ar' ? post.title_en : post.title_ar) && (
                  <p className="text-navy/50 text-xs truncate mt-0.5" dir={locale === 'ar' ? 'ltr' : 'rtl'}>{locale === 'ar' ? post.title_en : post.title_ar}</p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {post.type && <Badge variant="secondary">{post.type}</Badge>}
                <Badge variant={post.is_published ? 'success' : 'warning'}>
                  {post.is_published ? t('posts.published') : t('posts.draft')}
                </Badge>
                <span className="text-xs text-navy/40">{formatDate(post.created_at)}</span>
              </div>
            </div>
          </Link>
        ))}
        {(posts ?? []).length === 0 && (
          <div className="text-center py-20 text-navy/40">{t('posts.empty')}</div>
        )}
      </div>
    </div>
  );
}
