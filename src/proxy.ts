import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale } from '@/i18n';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Protect /admin routes
  if (pathname.startsWith('/admin')) {
    // Auth check via Supabase cookie
    const supabaseToken = request.cookies.get('sb-access-token')?.value
      || request.cookies.get('supabase-auth-token')?.value;

    // Check for any supabase session cookie
    const hasSession = Array.from(request.cookies.getAll()).some(
      (cookie) => cookie.name.startsWith('sb-') && cookie.name.endsWith('-auth-token')
    );

    if (!supabaseToken && !hasSession) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images|fonts|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml)).*)',
  ],
};
