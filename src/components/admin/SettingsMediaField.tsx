'use client';

import { useState, useRef, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Upload, X, Film, Image as ImageIcon, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

type MediaType = 'image' | 'video' | 'any';

interface SettingsMediaFieldProps {
  /** Display label */
  label: string;
  /** Current URL value */
  value: string;
  /** Callback when URL changes (upload result or manual edit) */
  onChange: (url: string) => void;
  /** Supabase storage bucket name */
  bucket: string;
  /** Accepted media type */
  mediaType?: MediaType;
  /** Max file size in bytes */
  maxSize?: number;
  /** Optional hint text */
  hint?: string;
}

const ACCEPT_MAP: Record<MediaType, string> = {
  image: 'image/jpeg,image/png,image/webp,image/gif',
  video: 'video/mp4,video/webm',
  any: 'image/jpeg,image/png,image/webp,video/mp4,video/webm',
};

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(0)}MB`;
}

function isVideoUrl(url: string): boolean {
  return /\.(mp4|webm|mov)(\?|$)/i.test(url);
}

/**
 * Reusable media upload field for admin settings forms.
 * Supports drag & drop, file selection, and manual URL input.
 * Uploads to the specified Supabase storage bucket.
 */
export default function SettingsMediaField({
  label,
  value,
  onChange,
  bucket,
  mediaType = 'image',
  maxSize = 5 * 1024 * 1024,
  hint,
}: SettingsMediaFieldProps) {
  const supabase = createClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const upload = useCallback(async (file: File) => {
    setError(null);

    if (file.size > maxSize) {
      setError(`File too large. Max ${formatBytes(maxSize)}.`);
      return;
    }

    setUploading(true);
    setProgress(20);

    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'bin';
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const { data, error: uploadErr } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, { cacheControl: '3600', upsert: false });

    setProgress(80);

    if (uploadErr) {
      setError(uploadErr.message);
      setUploading(false);
      setProgress(0);
      return;
    }

    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
    onChange(urlData.publicUrl);
    setProgress(100);

    setTimeout(() => {
      setUploading(false);
      setProgress(0);
    }, 600);
  }, [bucket, maxSize, onChange, supabase.storage]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) upload(file);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) upload(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleClear = () => {
    onChange('');
    setError(null);
  };

  const hasValue = value.trim().length > 0;
  const isVideo = hasValue && isVideoUrl(value);
  const IconType = mediaType === 'video' ? Film : ImageIcon;

  return (
    <div className="bg-white border border-navy/10 rounded-xl p-4 space-y-3">
      <Label className="text-xs text-navy/60 block">{label}</Label>

      {/* Preview + Upload zone */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all duration-200 ${
          dragOver
            ? 'border-gold bg-gold/5'
            : hasValue
              ? 'border-navy/10 bg-navy/[0.02]'
              : 'border-navy/20 hover:border-gold/50'
        }`}
        onClick={() => !uploading && inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={() => setDragOver(false)}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2 py-3">
            <Loader2 className="animate-spin text-gold" size={28} />
            <p className="text-xs text-navy/50">Uploading…</p>
            <div className="w-full max-w-[200px] bg-navy/10 rounded-full h-1.5">
              <div
                className="bg-gold h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : hasValue ? (
          <div className="relative group">
            {isVideo ? (
              <video
                src={value}
                className="max-h-32 mx-auto rounded-lg object-contain"
                muted
                playsInline
                preload="metadata"
              />
            ) : (
              <img
                src={value}
                alt=""
                className="max-h-32 mx-auto rounded-lg object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            )}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleClear(); }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600"
              aria-label="Remove"
            >
              <X size={12} />
            </button>
            <p className="text-[10px] text-navy/40 mt-2">Click to replace</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-3">
            <div className="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center">
              <IconType className="text-navy/30" size={20} />
            </div>
            <p className="text-xs text-navy/50">
              Drop file here or click to upload
            </p>
            <p className="text-[10px] text-navy/30">
              Max {formatBytes(maxSize)}
            </p>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT_MAP[mediaType]}
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Manual URL input */}
      <div className="space-y-1">
        <p className="text-[10px] text-navy/40 uppercase tracking-wider">Or paste URL</p>
        <Input
          value={value}
          onChange={(e) => { onChange(e.target.value); setError(null); }}
          placeholder="https://…"
          className="text-xs"
        />
      </div>

      {/* Status messages */}
      {progress === 100 && !error && (
        <p className="flex items-center gap-1 text-green-600 text-xs">
          <CheckCircle size={12} /> Uploaded successfully
        </p>
      )}
      {error && (
        <p className="flex items-center gap-1 text-red-600 text-xs">
          <AlertCircle size={12} /> {error}
        </p>
      )}
      {hint && <p className="text-[10px] text-navy/40">{hint}</p>}
    </div>
  );
}
