/**
 * End-to-end test: Save content via admin client → verify on landing page
 */
import { createClient } from '@supabase/supabase-js';

const URL = 'https://lhpnnsedbwgbwymvacxr.supabase.co';
const SERVICE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxocG5uc2VkYndnYnd5bXZhY3hyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQzNTA2MSwiZXhwIjoyMDg3MDExMDYxfQ.L9KbPuh95Qergx5yPWizHhHGJmuprrnuTf6b6usR4SM';

const sb = createClient(URL, SERVICE);

const TEST_TEXT = `تيست مباشر - التوقيت: ${new Date().toISOString()}`;

// Step 1: Read current
const { data: before } = await sb.from('page_content').select('id, content_ar').eq('section_key', 'about').single();
console.log('1. Before:', before?.content_ar);

// Step 2: Update to test text
const { error: updateErr } = await sb.from('page_content').update({ content_ar: TEST_TEXT }).eq('id', before?.id);
console.log('2. Update error:', updateErr?.message ?? 'none ✅');

// Step 3: Verify in DB
const { data: after } = await sb.from('page_content').select('content_ar').eq('section_key', 'about').single();
console.log('3. After in DB:', after?.content_ar);
console.log('   Matches test text?', after?.content_ar === TEST_TEXT ? 'YES ✅' : 'NO ❌');

// Step 4: Check rendered page (may need server restart for cache)
try {
  const res = await fetch('http://localhost:3000/ar');
  const html = await res.text();
  const hasTestText = html.includes(TEST_TEXT);
  console.log('4. Landing page has test text?', hasTestText ? 'YES ✅' : 'NO ❌ (cache, needs refresh)');
  
  if (!hasTestText) {
    // Try revalidating
    console.log('   Trying revalidation...');
    await fetch('http://localhost:3000/api/revalidate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret: 'your_secret_key_change_this', path: '/ar' }),
    });
    
    // Wait a sec and refetch
    await new Promise(r => setTimeout(r, 2000));
    const res2 = await fetch('http://localhost:3000/ar', { cache: 'no-store' });
    const html2 = await res2.text();
    console.log('   After revalidation:', html2.includes(TEST_TEXT) ? 'YES ✅' : 'STILL NO ❌');
  }
} catch {
  console.log('4. Dev server not running, skipping page check.');
}

// Step 5: Restore original
const { error: restoreErr } = await sb.from('page_content').update({ content_ar: before?.content_ar }).eq('id', before?.id);
console.log('5. Restored original:', restoreErr ? '❌ ' + restoreErr.message : '✅');
