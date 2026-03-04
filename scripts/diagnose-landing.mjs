/**
 * Diagnostic: Does the rendered homepage actually show DB content or hardcoded?
 * Fetches http://localhost:3000/ar and checks which text appears.
 */

const DB_CONTENT_AR = 'تأسست مدارس إيليت برؤية لتقديم تعليم متميز يجمع بين التفوق الأكاديمي وتنمية';
const HARDCODED_CONTENT_AR = 'منذ أكثر من 25 عامًا، تقف مدارس إيليت في طليعة التعليم المتميز';

try {
  const res = await fetch('http://localhost:3000/ar', {
    headers: { 'Cache-Control': 'no-cache' },
  });
  const html = await res.text();

  console.log('=== HOMEPAGE DIAGNOSTIC ===');
  console.log('Status:', res.status);
  console.log('');

  const hasDb = html.includes(DB_CONTENT_AR);
  const hasHardcoded = html.includes(HARDCODED_CONTENT_AR);

  console.log('Contains DB content_ar?', hasDb ? 'YES ✅' : 'NO ❌');
  console.log('Contains hardcoded i18n?', hasHardcoded ? 'YES (problem!)' : 'NO');

  if (hasHardcoded && !hasDb) {
    console.log('\n❌ PROBLEM: Page shows hardcoded text, not DB text.');
    console.log('This means either:');
    console.log('  1. DB query returns null for about section');
    console.log('  2. Page is served from stale cache');
  } else if (hasDb) {
    console.log('\n✅ Page is rendering DB content correctly.');
    console.log('If you still see old text, try hard-refreshing (Ctrl+Shift+R).');
  } else {
    console.log('\n⚠️  Neither text found - page structure may differ.');
    // Dump a snippet around "قصتنا"
    const idx = html.indexOf('قصتنا');
    if (idx > -1) {
      console.log('\nSnippet around "قصتنا":');
      console.log(html.substring(Math.max(0, idx - 200), idx + 500));
    }
  }
} catch (err) {
  console.log('Could not reach localhost:3000. Is the dev server running?');
  console.log(err.message);
}
