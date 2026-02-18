import Link from 'next/link';
import { headers } from 'next/headers';
import { Button } from '@/components/ui/button';

export default async function NotFoundPage() {
  const headersList = await headers();
  const referer = headersList.get('referer') ?? '';
  const locale = referer.includes('/ar') ? 'ar' : 'en';
  const isAR = locale === 'ar';

  return (
    <main className="min-h-[60vh] flex items-center justify-center text-center px-4">
      <div>
        <p className="text-gold text-7xl font-bold font-playfair">404</p>
        <h1 className="text-2xl font-bold text-navy mt-4 mb-2">
          {isAR ? 'الصفحة غير موجودة' : 'Page Not Found'}
        </h1>
        <p className="text-navy/60 mb-8">
          {isAR ? 'عذراً، الصفحة التي تبحث عنها غير موجودة.' : 'Sorry, the page you\'re looking for doesn\'t exist.'}
        </p>
        <Link href={`/${locale}`}>
          <Button size="lg">{isAR ? 'العودة للرئيسية' : 'Back to Home'}</Button>
        </Link>
      </div>
    </main>
  );
}
