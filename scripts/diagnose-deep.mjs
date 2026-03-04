/**
 * Deeper diagnostic – check WHERE each text appears in the HTML
 */

const DB_TEXT = 'تأسست مدارس إيليت برؤية لتقديم تعليم متميز';
const HARDCODED_TEXT = 'منذ أكثر من 25 عامًا، تقف مدارس إيليت';

try {
  const res = await fetch('http://localhost:3000/ar');
  const html = await res.text();

  // Find ALL occurrences of DB text
  let idx = 0;
  console.log('=== DB TEXT OCCURRENCES ===');
  while ((idx = html.indexOf(DB_TEXT, idx)) !== -1) {
    const snippet = html.substring(Math.max(0, idx - 80), idx + DB_TEXT.length + 80);
    const isInScript = html.lastIndexOf('<script', idx) > html.lastIndexOf('</script', idx);
    console.log(`  Pos ${idx} | in <script>: ${isInScript}`);
    console.log(`  ...${snippet.replace(/\n/g, '').substring(0, 200)}...`);
    idx += DB_TEXT.length;
  }

  // Find ALL occurrences of hardcoded text
  idx = 0;
  console.log('\n=== HARDCODED TEXT OCCURRENCES ===');
  while ((idx = html.indexOf(HARDCODED_TEXT, idx)) !== -1) {
    const snippet = html.substring(Math.max(0, idx - 80), idx + HARDCODED_TEXT.length + 80);
    const isInScript = html.lastIndexOf('<script', idx) > html.lastIndexOf('</script', idx);
    console.log(`  Pos ${idx} | in <script>: ${isInScript}`);
    console.log(`  ...${snippet.replace(/\n/g, '').substring(0, 200)}...`);
    idx += HARDCODED_TEXT.length;
  }
  
  // Check if about section visible HTML has the right text
  const aboutSectionMatch = html.match(/aria-label="About"[^]*?<\/section>/s);
  if (aboutSectionMatch) {
    const section = aboutSectionMatch[0];
    console.log('\n=== ABOUT SECTION VISIBLE CONTENT ===');
    console.log('Has DB text in section?', section.includes(DB_TEXT) ? 'YES ✅' : 'NO ❌');
    console.log('Has hardcoded text in section?', section.includes(HARDCODED_TEXT) ? 'YES ❌ (problem!)' : 'NO ✅');
  }
} catch (err) {
  console.log('Dev server error:', err.message);
}
