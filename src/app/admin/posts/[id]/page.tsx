import { createClient } from '@/lib/supabase/server';
import { getAdminLocale, adminT } from '@/lib/admin-i18n';
import { notFound } from 'next/navigation';
import PostForm from '@/components/admin/PostForm';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminPostEditPage({ params }: Props) {
  const { id } = await params;
  const isNew = id === 'new';
  const locale = await getAdminLocale();
  const t = adminT(locale);

  if (!isNew) {
    const supabase = await createClient();
    const { data: post } = await supabase
      .from('posts')
      .select('id, title_en, title_ar, content_en, content_ar, type, thumbnail_url, is_published, slug')
      .eq('id', id)
      .single();

    if (!post) notFound();
    return (
      <div>
        <h1 className="text-2xl font-bold text-navy font-playfair mb-8">{t('posts.editPost')}</h1>
        <PostForm initialData={post} />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy font-playfair mb-8">{t('posts.newPost')}</h1>
      <PostForm />
    </div>
  );
}
