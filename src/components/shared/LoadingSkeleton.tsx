import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
  className?: string;
  count?: number;
  variant?: 'card' | 'text' | 'image' | 'circle';
}

export default function LoadingSkeleton({
  className,
  count = 1,
  variant = 'card',
}: LoadingSkeletonProps) {
  const items = Array.from({ length: count });

  if (variant === 'text') {
    return (
      <div className={cn('space-y-2', className)}>
        {items.map((_, i) => (
          <div
            key={i}
            className="h-4 bg-gray-200 rounded animate-pulse"
            style={{ width: `${Math.random() * 40 + 60}%` }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'circle') {
    return (
      <div className={cn('flex gap-4', className)}>
        {items.map((_, i) => (
          <div key={i} className="w-12 h-12 rounded-full bg-gray-200 animate-pulse" />
        ))}
      </div>
    );
  }

  if (variant === 'image') {
    return (
      <div className={cn('rounded-xl bg-gray-200 animate-pulse aspect-video', className)} />
    );
  }

  // Card variant
  return (
    <div className={cn('grid gap-4', `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`, className)}>
      {items.map((_, i) => (
        <div key={i} className="rounded-2xl bg-white border border-gray-200 p-5 space-y-3 animate-pulse">
          <div className="h-40 bg-gray-200 rounded-xl" />
          <div className="h-5 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-100 rounded w-full" />
          <div className="h-4 bg-gray-100 rounded w-5/6" />
          <div className="h-10 bg-gray-200 rounded-lg w-1/3 mt-2" />
        </div>
      ))}
    </div>
  );
}
