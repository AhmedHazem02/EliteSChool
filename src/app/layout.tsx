import '@/styles/globals.css';
import { Playfair_Display, Plus_Jakarta_Sans, Tajawal } from 'next/font/google';

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
  preload: true,
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jakarta',
  weight: ['400', '500', '600', '700'],
  preload: true,
});

const tajawal = Tajawal({
  subsets: ['arabic'],
  display: 'swap',
  variable: '--font-tajawal',
  weight: ['400', '500', '700'],
  preload: true,
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning className={`${playfair.variable} ${jakarta.variable} ${tajawal.variable}`}>
      <body className="bg-off-white text-navy antialiased">{children}</body>
    </html>
  );
}
