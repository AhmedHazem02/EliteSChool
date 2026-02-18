'use client';

import { cn } from '@/lib/utils';

export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface ResponsiveTableProps<T extends object> {
  columns: TableColumn<T>[];
  data: T[];
  keyField: keyof T;
  className?: string;
  emptyMessage?: string;
}

export default function ResponsiveTable<T extends object>({
  columns,
  data,
  keyField,
  className,
  emptyMessage = 'No data available',
}: ResponsiveTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-navy/50">
        {emptyMessage}
      </div>
    );
  }

  const getCellValue = (row: T, col: TableColumn<T>) => {
    if (col.render) return col.render(row);
    const val = (row as Record<string, unknown>)[col.key as string];
    return val !== null && val !== undefined ? String(val) : '—';
  };

  const getKey = (row: T) => {
    return String((row as Record<string, unknown>)[keyField as string]);
  };

  return (
    <div className={cn('w-full', className)}>
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-navy/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-navy text-white">
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className={cn(
                    'px-4 py-3 text-start font-semibold',
                    col.className
                  )}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, ri) => (
              <tr
                key={getKey(row)}
                className={cn(
                  'border-t border-navy/10 hover:bg-navy/5 transition-colors',
                  ri % 2 === 0 ? 'bg-white' : 'bg-off-white/50'
                )}
              >
                {columns.map((col) => (
                  <td
                    key={String(col.key)}
                    className={cn('px-4 py-3', col.className)}
                  >
                    {getCellValue(row, col)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card view */}
      <div className="md:hidden space-y-4">
        {data.map((row) => (
          <div
            key={getKey(row)}
            className="rounded-xl border border-navy/10 bg-white shadow-sm overflow-hidden"
          >
            {columns.map((col) => (
              <div
                key={String(col.key)}
                className="flex gap-2 px-4 py-2.5 border-b border-navy/5 last:border-0"
              >
                <span className="text-xs font-semibold text-navy/50 min-w-[100px] shrink-0">
                  {col.label}
                </span>
                <span className="text-sm text-navy">
                  {getCellValue(row, col)}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
