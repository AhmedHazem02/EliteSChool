'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { adminTranslations, type AdminLocale } from '@/lib/admin-translations';
import { Eye, EyeOff, LogIn, Languages } from 'lucide-react';

function getInitialLocale(): AdminLocale {
  if (typeof document === 'undefined') return 'en';
  const match = document.cookie.match(/(?:^|;\s*)admin-locale=(\w+)/);
  return match?.[1] === 'ar' ? 'ar' : 'en';
}

export default function LoginClient() {
  const router = useRouter();
  const supabase = createClient();

  const [locale, setLocaleState] = useState<AdminLocale>(getInitialLocale);
  const t = useCallback(
    (key: string) => adminTranslations[locale]?.[key] ?? key,
    [locale]
  );

  function toggleLocale() {
    const next = locale === 'en' ? 'ar' : 'en';
    setLocaleState(next);
    document.cookie = `admin-locale=${next};path=/;max-age=31536000;SameSite=Lax`;
  }

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push('/admin');
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy to-navy/80 flex items-center justify-center p-4" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <div className="w-full max-w-md">
        {/* Language toggle */}
        <div className="flex justify-end mb-4">
          <button
            onClick={toggleLocale}
            className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors"
          >
            <Languages size={16} />
            {locale === 'en' ? 'العربية' : 'English'}
          </button>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="relative w-20 h-20">
              <Image src="/images/logo.png" alt="Elite Schools" fill className="object-contain" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-navy text-center font-playfair mb-2">
            {t('login.title')}
          </h1>
          <p className="text-navy/50 text-sm text-center mb-8">
            {t('login.subtitle')}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email">{t('login.email')}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@elite-schools.com"
                required
                autoComplete="email"
                dir="ltr"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">{t('login.password')}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-navy/40 hover:text-navy transition-colors"
                  tabIndex={-1}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full"
              variant="default"
              size="lg"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  {t('login.signingIn')}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn size={16} /> {t('login.signIn')}
                </span>
              )}
            </Button>
          </form>
        </div>

        <p className="text-center text-white/40 text-xs mt-6">
          {t('login.footer')} · {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
