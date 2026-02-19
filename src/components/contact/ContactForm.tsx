'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createClient } from '@/lib/supabase/client';
import { useRateLimit } from '@/hooks/useRateLimit';
import { CheckCircle, Phone, Mail, MapPin, Send } from 'lucide-react';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import SectionHeader from '@/components/shared/SectionHeader';
import PageTransition from '@/components/shared/PageTransition';
import ScrollReveal from '@/components/shared/ScrollReveal';

interface Props {
  locale: string;
}

export default function ContactClientPage({ locale }: Props) {
  const isAR = locale === 'ar';
  const { canSubmit } = useRateLimit();

  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update(f: string, v: string) { setForm(p => ({ ...p, [f]: v })); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit()) {
      setError(isAR ? 'تجاوزت الحد المسموح به.' : 'Too many submissions. Try later.');
      return;
    }

    setLoading(true);
    setError(null);

    // Store as an admissions record with no system (re-use table)
    const supabase = createClient();
    const { error: dbErr } = await supabase.from('admissions').insert({
      parent_name: form.name,
      student_name: 'N/A',
      phone: form.phone,
      email: form.email || null,
      grade_level: 'contact-inquiry',
      notes: form.message,
    });

    if (dbErr) { setError(dbErr.message); } else { setSubmitted(true); }
    setLoading(false);
  }

  return (
    <PageTransition>
      <main>
        {/* Unified header — extends behind the fixed Navbar */}
        <section className="relative bg-navy text-white pt-28 pb-8 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-navy via-navy/95 to-navy/80 pointer-events-none" />
          <div className="container mx-auto px-4 relative z-10">
            <Breadcrumbs
              items={[
                { label: isAR ? 'تواصل معنا' : 'Contact', href: `/${locale}/contact` },
              ]}
              light
            />
            <h1 className="text-3xl md:text-4xl font-bold font-playfair mt-3">
              {isAR ? 'تواصل معنا' : 'Contact Us'}
            </h1>
          </div>
        </section>

        <section className="section-padding bg-off-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
              {/* Info */}
              <ScrollReveal direction="left">
                <div className="space-y-8">
                  <SectionHeader
                    title={isAR ? 'نحن هنا للمساعدة' : 'We\'re Here to Help'}
                    subtitle={isAR ? 'تواصل معنا بأي وسيلة مناسبة' : 'Reach out through any channel'}
                    centered={false}
                  />
                  <div className="space-y-5">
                    {[
                      { icon: Phone, label: isAR ? 'الهاتف' : 'Phone', value: '+20 (xx) xxxxxxxx', href: 'tel:+20xxxxxxxxxx' },
                      { icon: Mail, label: isAR ? 'البريد الإلكتروني' : 'Email', value: 'info@elite-schools.com', href: 'mailto:info@elite-schools.com' },
                      { icon: MapPin, label: isAR ? 'العنوان' : 'Address', value: isAR ? 'القاهرة، مصر' : 'Cairo, Egypt', href: '#' },
                    ].map((item) => (
                      <a key={item.label} href={item.href} className="flex items-center gap-4 group">
                        <div className="w-11 h-11 rounded-xl bg-navy/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                          <item.icon className="text-navy group-hover:text-gold transition-colors" size={20} />
                        </div>
                        <div>
                          <p className="text-xs text-navy/50">{item.label}</p>
                          <p className="text-navy font-medium">{item.value}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              {/* Form */}
              <ScrollReveal direction="right">
                {submitted ? (
                  <div className="text-center py-16 bg-white rounded-3xl shadow-card">
                    <CheckCircle className="text-green-500 mx-auto mb-4" size={56} />
                    <h2 className="text-xl font-bold text-navy font-playfair">
                      {isAR ? 'تم إرسال رسالتك!' : 'Message Sent!'}
                    </h2>
                    <p className="text-navy/60 text-sm mt-2">
                      {isAR ? 'سنتواصل معك قريباً.' : 'We\'ll get back to you shortly.'}
                    </p>
                  </div>
                ) : (
                  <div className="bg-white rounded-3xl shadow-card p-8">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-1.5">
                        <Label>{isAR ? 'الاسم' : 'Name'} *</Label>
                        <Input value={form.name} onChange={(e) => update('name', e.target.value)} required />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label>{isAR ? 'الهاتف' : 'Phone'} *</Label>
                          <Input type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} required />
                        </div>
                        <div className="space-y-1.5">
                          <Label>{isAR ? 'البريد الإلكتروني' : 'Email'}</Label>
                          <Input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label>{isAR ? 'الرسالة' : 'Message'} *</Label>
                        <Textarea value={form.message} onChange={(e) => update('message', e.target.value)} rows={5} required />
                      </div>
                      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
                      <Button type="submit" size="lg" disabled={loading} className="w-full gap-2">
                        <Send size={16} />
                        {loading ? (isAR ? 'جارٍ الإرسال…' : 'Sending…') : (isAR ? 'إرسال' : 'Send Message')}
                      </Button>
                    </form>
                  </div>
                )}
              </ScrollReveal>
            </div>
          </div>
        </section>
      </main>
    </PageTransition>
  );
}
