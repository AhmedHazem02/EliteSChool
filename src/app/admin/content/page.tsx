import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, HelpCircle, Star, BarChart2, Trophy } from 'lucide-react';

const sections = [
  { key: 'hero', label: 'Hero Section', icon: Star, description: 'Main headline, subtitle, CTA button text' },
  { key: 'about', label: 'About Us', icon: FileText, description: 'School history, mission, vision' },
  { key: 'why_choose_us', label: 'Why Choose Us', icon: Trophy, description: 'Feature cards with icons' },
  { key: 'stats', label: 'Statistics', icon: BarChart2, description: 'Numbers displayed on homepage' },
  { key: 'faq', label: 'FAQ', icon: HelpCircle, description: 'Frequently asked questions' },
];

export default function AdminContentPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy font-playfair">Content Management</h1>
        <p className="text-navy/50 text-sm mt-1">Edit bilingual content that appears on the public website</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {sections.map((section) => (
          <Link key={section.key} href={`/admin/content/${section.key}`}>
            <Card className="cursor-pointer hover:shadow-gold transition-shadow duration-300 group h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-navy/5 flex items-center justify-center group-hover:bg-gold/10 transition-colors">
                    <section.icon className="text-navy/60 group-hover:text-gold transition-colors" size={20} />
                  </div>
                  <CardTitle className="text-base">{section.label}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-navy/50">{section.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
