'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface BilingualInputProps {
  labelEn: string;
  labelAr: string;
  valueEn: string;
  valueAr: string;
  onChangeEn: (v: string) => void;
  onChangeAr: (v: string) => void;
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
  dir?: string;
  dirAr?: string;
  required?: boolean;
  className?: string;
}

export default function BilingualInput({
  labelEn,
  labelAr,
  valueEn,
  valueAr,
  onChangeEn,
  onChangeAr,
  multiline = false,
  rows = 3,
  placeholder,
  dir = 'ltr',
  dirAr = 'rtl',
  required = false,
  className,
}: BilingualInputProps) {
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 gap-4', className)}>
      {/* English */}
      <div className="space-y-1.5">
        <Label>
          {labelEn}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        {multiline ? (
          <Textarea
            value={valueEn}
            onChange={(e) => onChangeEn(e.target.value)}
            rows={rows}
            placeholder={placeholder}
            dir={dir}
            required={required}
            className="font-mono text-sm resize-y"
          />
        ) : (
          <Input
            value={valueEn}
            onChange={(e) => onChangeEn(e.target.value)}
            placeholder={placeholder}
            dir={dir}
            required={required}
          />
        )}
      </div>

      {/* Arabic */}
      <div className="space-y-1.5">
        <Label>
          {labelAr}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        {multiline ? (
          <Textarea
            value={valueAr}
            onChange={(e) => onChangeAr(e.target.value)}
            rows={rows}
            placeholder={placeholder ? `${placeholder} (AR)` : undefined}
            dir={dirAr}
            required={required}
            className="font-mono text-sm resize-y"
          />
        ) : (
          <Input
            value={valueAr}
            onChange={(e) => onChangeAr(e.target.value)}
            placeholder={placeholder ? `${placeholder} (AR)` : undefined}
            dir={dirAr}
            required={required}
          />
        )}
      </div>
    </div>
  );
}
