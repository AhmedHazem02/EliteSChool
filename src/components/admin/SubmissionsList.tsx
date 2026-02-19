'use client';

import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { useAdminI18n } from '@/components/admin/AdminI18nProvider';
import { Mail, Phone, User, GraduationCap, Calendar } from 'lucide-react';

interface Submission {
  id: string;
  parent_name: string;
  student_name: string;
  grade_level: string;
  selected_system: string | null;
  phone: string;
  email: string | null;
  created_at: string;
}

interface SubmissionsListProps {
  submissions: Submission[];
}

export default function SubmissionsList({ submissions }: SubmissionsListProps) {
  const { t } = useAdminI18n();

  if (submissions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-navy/40">
        <User size={48} className="mb-4 opacity-30" />
        <p>{t('admissions.empty')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {submissions.map((s) => (
        <div
          key={s.id}
          className="bg-white rounded-2xl border border-navy/10 p-5 hover:shadow-card transition-shadow"
        >
          {/* Top row */}
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-navy text-base">{s.student_name}</span>
                <Badge variant="secondary">{t('admissions.new')}</Badge>
              </div>
              <p className="text-navy/50 text-xs mt-0.5">
                <span className="font-medium">{t('admissions.parent')}:</span> {s.parent_name}
              </p>
            </div>

            {/* Date */}
            <div className="flex items-center gap-1.5 text-navy/40 text-xs shrink-0">
              <Calendar size={13} />
              {formatDate(s.created_at)}
            </div>
          </div>

          {/* Details row */}
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
            {s.phone && (
              <span className="flex items-center gap-1.5 text-xs text-navy/60">
                <Phone size={12} className="text-gold" />
                <a href={`tel:${s.phone}`} className="hover:text-navy transition-colors">{s.phone}</a>
              </span>
            )}
            {s.email && (
              <span className="flex items-center gap-1.5 text-xs text-navy/60">
                <Mail size={12} className="text-gold" />
                <a href={`mailto:${s.email}`} className="hover:text-navy transition-colors">{s.email}</a>
              </span>
            )}
            {s.grade_level && (
              <span className="flex items-center gap-1.5 text-xs text-navy/60">
                <GraduationCap size={12} className="text-gold" />
                <span>{t('admissions.grade')}: <strong className="text-navy font-medium">{s.grade_level}</strong></span>
              </span>
            )}
            {s.selected_system && (
              <span className="flex items-center gap-1.5 text-xs text-navy/60">
                <span>{t('admissions.system')}: <strong className="text-navy font-medium">{s.selected_system}</strong></span>
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
