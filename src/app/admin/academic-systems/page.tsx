import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import FeesManager from '@/components/admin/FeesManager';

export default async function AdminAcademicSystemsPage() {
  const supabase = await createClient();
  const { data: systems } = await supabase
    .from('academic_systems')
    .select('id, title_en, title_ar, is_active')
    .order('sort_order');

  return (
    <div>
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy font-playfair">Academic Systems</h1>
          <p className="text-navy/50 text-sm mt-1">Manage curricula and tuition fees</p>
        </div>
        <Link href="/admin/academic-systems/new">
          <Button size="sm" className="gap-1.5">
            <Plus size={16} /> Add System
          </Button>
        </Link>
      </div>

      <div className="space-y-3">
        {(systems ?? []).map((sys) => (
          <Link key={sys.id} href={`/admin/academic-systems/${sys.id}`} className="block">
            <div className="bg-white rounded-xl border border-navy/10 p-4 hover:shadow-card transition-shadow flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-navy">{sys.title_en}</p>
                <p className="text-navy/50 text-xs font-arabic" dir="rtl">{sys.title_ar}</p>
              </div>
              <Badge variant={sys.is_active ? 'success' : 'secondary'}>
                {sys.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </Link>
        ))}
        {(systems ?? []).length === 0 && (
          <div className="text-center py-20 text-navy/40">No academic systems found.</div>
        )}
      </div>
    </div>
  );
}
