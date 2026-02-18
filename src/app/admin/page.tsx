import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, Image, GraduationCap } from 'lucide-react';
import Link from 'next/link';

async function getStats() {
  const supabase = await createClient();
  const [admissions, posts, gallery, systems] = await Promise.all([
    supabase.from('admissions').select('id', { count: 'exact', head: true }),
    supabase.from('posts').select('id', { count: 'exact', head: true }),
    supabase.from('gallery').select('id', { count: 'exact', head: true }),
    supabase.from('academic_systems').select('id', { count: 'exact', head: true }),
  ]);
  return {
    admissions: admissions.count ?? 0,
    posts: posts.count ?? 0,
    gallery: gallery.count ?? 0,
    systems: systems.count ?? 0,
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const cards = [
    { title: 'Admissions', value: stats.admissions, icon: Users, href: '/admin/admissions', color: 'text-burgundy' },
    { title: 'News Posts', value: stats.posts, icon: FileText, href: '/admin/posts', color: 'text-navy' },
    { title: 'Gallery Items', value: stats.gallery, icon: Image, href: '/admin/gallery', color: 'text-gold' },
    { title: 'Academic Systems', value: stats.systems, icon: GraduationCap, href: '/admin/academic-systems', color: 'text-navy' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy font-playfair">Dashboard</h1>
        <p className="text-navy/50 text-sm mt-1">Welcome back — here's an overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((card) => (
          <Link key={card.href} href={card.href}>
            <Card className="hover:shadow-gold transition-shadow duration-300 cursor-pointer group">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-navy/60 group-hover:text-navy transition-colors">
                  {card.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <span className="text-3xl font-bold text-navy">{card.value}</span>
                <card.icon className={`${card.color} opacity-60 group-hover:opacity-100 transition-opacity`} size={28} />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { label: 'Add News Post', href: '/admin/posts/new' },
              { label: 'Upload Gallery', href: '/admin/gallery' },
              { label: 'Edit Homepage Content', href: '/admin/content' },
              { label: 'View Admissions', href: '/admin/admissions' },
            ].map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="block text-sm text-navy/70 hover:text-gold hover:translate-x-1 transition-all duration-200"
              >
                → {action.label}
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Site Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: 'Database', status: 'Connected', ok: true },
              { label: 'Storage Buckets', status: 'Active', ok: true },
              { label: 'i18n (AR/EN)', status: 'Enabled', ok: true },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between text-sm">
                <span className="text-navy/60">{item.label}</span>
                <span className={`font-medium ${item.ok ? 'text-green-600' : 'text-red-500'}`}>
                  {item.status}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
