import Link from 'next/link';
import { getAdminLocale, adminT } from '@/lib/admin-i18n';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, HelpCircle, Star, BarChart2, Trophy } from 'lucide-react';

export default async function AdminContentPage() {
  const locale = await getAdminLocale();
  const t = adminT(locale);

  const sections = [
    { key: 'hero', label: t('content.hero'), icon: Star, description: t('content.heroDesc') },
    { key: 'about', label: t('content.about'), icon: FileText, description: t('content.aboutDesc') },
    { key: 'why_choose_us', label: t('content.whyChooseUs'), icon: Trophy, description: t('content.whyChooseUsDesc') },
    { key: 'stats', label: t('content.stats'), icon: BarChart2, description: t('content.statsDesc') },
    { key: 'faq', label: t('content.faq'), icon: HelpCircle, description: t('content.faqDesc') },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy font-playfair">{t('content.title')}</h1>
        <p className="text-navy/50 text-sm mt-1">{t('content.subtitle')}</p>
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
