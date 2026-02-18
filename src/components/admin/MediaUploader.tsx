'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GALLERY_CATEGORIES_DATA, STORAGE_BUCKETS, FILE_SIZE_LIMITS } from '@/lib/constants';
import { useAdminI18n } from '@/components/admin/AdminI18nProvider';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';

export default function MediaUploader() {
  const router = useRouter();
  const supabase = createClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const { t, locale } = useAdminI18n();

  const [file, setFile] = useState<File | null>(null);
  const [captionEn, setCaptionEn] = useState('');
  const [captionAr, setCaptionAr] = useState('');
  const [category, setCategory] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [preview, setPreview] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;

    if (f.size > FILE_SIZE_LIMITS.IMAGE) {
      setStatus('error');
      setMessage(`${t('gallery.fileTooLarge')} ${FILE_SIZE_LIMITS.IMAGE / 1024 / 1024}MB.`);
      return;
    }

    setFile(f);
    setPreview(URL.createObjectURL(f));
    setStatus('idle');
  }

  async function handleUpload() {
    if (!file) return;
    setUploading(true);
    setProgress(10);
    setStatus('idle');

    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKETS.GALLERY_IMAGES)
      .upload(fileName, file, { cacheControl: '3600', upsert: false });

    setProgress(70);

    if (uploadError) {
      setStatus('error');
      setMessage(uploadError.message);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from(STORAGE_BUCKETS.GALLERY_IMAGES).getPublicUrl(uploadData.path);

    await supabase.from('gallery').insert({
      media_url: urlData.publicUrl,
      media_type: 'image',
      caption_en: captionEn || null,
      caption_ar: captionAr || null,
      category: category || null,
      sort_order: 0,
    });

    setProgress(100);
    setStatus('success');
    setMessage(t('gallery.uploadSuccess'));
    setFile(null);
    setPreview(null);
    setCaptionEn('');
    setCaptionAr('');
    setCategory('');
    if (inputRef.current) inputRef.current.value = '';
    setUploading(false);
    router.refresh();
  }

  return (
    <div className="bg-white border border-navy/10 rounded-2xl p-6 space-y-4">
      <h3 className="font-semibold text-navy">{t('gallery.uploadImage')}</h3>

      <div
        className="border-2 border-dashed border-navy/20 rounded-xl p-6 text-center cursor-pointer hover:border-gold transition-colors"
        onClick={() => inputRef.current?.click()}
      >
        {preview ? (
          <img src={preview} alt="" className="max-h-40 mx-auto rounded-lg object-contain" />
        ) : (
          <div className="space-y-2">
            <Upload className="mx-auto text-navy/30" size={32} />
            <p className="text-sm text-navy/50">{t('gallery.chooseImage')} ({t('gallery.maxSize')})</p>
          </div>
        )}
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-xs">{t('gallery.captionEn')}</Label>
          <Input value={captionEn} onChange={(e) => setCaptionEn(e.target.value)} placeholder="Caption in English" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">{t('gallery.captionAr')}</Label>
          <Input value={captionAr} onChange={(e) => setCaptionAr(e.target.value)} placeholder="التعليق بالعربي" dir="rtl" />
        </div>
      </div>

      <div className="space-y-1 max-w-xs">
        <Label className="text-xs">{t('gallery.category')}</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder={t('gallery.selectCategory')} />
          </SelectTrigger>
          <SelectContent>
            {GALLERY_CATEGORIES_DATA.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>{locale === 'ar' ? cat.labelAr : cat.labelEn}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {uploading && (
        <div className="w-full bg-navy/10 rounded-full h-1.5">
          <div className="bg-gold h-1.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      )}

      {status === 'success' && (
        <p className="flex items-center gap-1.5 text-green-600 text-sm"><CheckCircle size={15} /> {message}</p>
      )}
      {status === 'error' && (
        <p className="flex items-center gap-1.5 text-red-600 text-sm"><AlertCircle size={15} /> {message}</p>
      )}

      <Button onClick={handleUpload} disabled={!file || uploading} size="sm">
        <Upload size={15} className="mr-1.5" />
        {uploading ? t('gallery.uploading') : t('gallery.upload')}
      </Button>
    </div>
  );
}
