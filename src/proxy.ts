import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { locales, defaultLocale } from '@/i18n';
import { updateSession } from '@/lib/supabase/middleware';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Refresh Supabase auth session on every request (keeps tokens valid)
  const sessionResponse = await updateSession(request);

  // Skip i18n redirect for /login — serve it directly
  if (pathname === '/login') {
    return sessionResponse;
  }

  // Protect /admin routes — skip i18n and check auth
  if (pathname.startsWith('/admin')) {
    // Get user from Supabase to check role
    let user = null;
    try {
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() { return request.cookies.getAll(); },
            setAll() {},
          },
        }
      );
      const { data } = await supabase.auth.getUser();
      user = data.user;
    } catch {
      // ignore
    }

    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Admissions-only users can only access /admin/admissions
    if (
      user.user_metadata?.role === 'admissions' &&
      !pathname.startsWith('/admin/admissions')
    ) {
      return NextResponse.redirect(new URL('/admin/admissions', request.url));
    }

    return sessionResponse;
  }

  // For locale routes, run intl middleware but also preserve session cookies
  const intlResponse = intlMiddleware(request);
  // Copy session cookies onto the intl response
  sessionResponse.cookies.getAll().forEach((cookie: { name: string; value: string }) => {
    intlResponse.cookies.set(cookie.name, cookie.value);
  });
  return intlResponse;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images|fonts|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml)).*)',
  ],
};
