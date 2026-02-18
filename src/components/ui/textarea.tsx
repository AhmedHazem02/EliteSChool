import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[100px] w-full rounded-lg border border-navy/20 bg-white px-3 py-2 text-sm',
          'placeholder:text-navy/40',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:border-gold',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'resize-y transition-colors duration-200',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
