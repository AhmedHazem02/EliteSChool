import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import PostForm from '@/components/admin/PostForm';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminPostEditPage({ params }: Props) {
  const { id } = await params;
  const isNew = id === 'new';

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
        <h1 className="text-2xl font-bold text-navy font-playfair mb-8">Edit Post</h1>
        <PostForm initialData={post} />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy font-playfair mb-8">New Post</h1>
      <PostForm />
    </div>
  );
}
