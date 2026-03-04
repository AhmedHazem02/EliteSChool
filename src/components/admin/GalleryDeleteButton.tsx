'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminI18n } from '@/components/admin/AdminI18nProvider';
import { Trash2 } from 'lucide-react';
import { deleteGalleryItem } from '@/app/actions/admin';

export default function GalleryDeleteButton({ id }: { id: string }) {
  const router = useRouter();
  const { t } = useAdminI18n();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(t('gallery.deleteConfirm'))) return;
    setLoading(true);
    await deleteGalleryItem(id);
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      title={t('gallery.deleteConfirm')}
      className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
    >
      <Trash2 size={13} />
    </button>
  );
}
