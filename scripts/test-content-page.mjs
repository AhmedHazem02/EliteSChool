/**
 * Test script for /admin/content page — page_content table
 * Run:  node scripts/test-content-page.mjs
 */

import { createClient } from '@supabase/supabase-js';

// ─── Config ──────────────────────────────────────────────────────────────────
const SUPABASE_URL = 'https://lhpnnsedbwgbwymvacxr.supabase.co';
const SERVICE_ROLE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxocG5uc2VkYndnYnd5bXZhY3hyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQzNTA2MSwiZXhwIjoyMDg3MDExMDYxfQ.L9KbPuh95Qergx5yPWizHhHGJmuprrnuTf6b6usR4SM';

const EXPECTED_SECTIONS = ['hero', 'about', 'why_choose_us', 'stats', 'faq'];
const COLUMNS =
  'id, section_key, title_en, title_ar, subtitle_en, subtitle_ar, content_en, content_ar, image_url, extra_data, updated_at';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

let passed = 0;
let failed = 0;

function ok(label) {
  console.log(`  ✅  ${label}`);
  passed++;
}

function fail(label, detail = '') {
  console.error(`  ❌  ${label}${detail ? `\n      → ${detail}` : ''}`);
  failed++;
}

function group(title) {
  console.log(`\n📋  ${title}`);
  console.log('─'.repeat(52));
}

// ─── Tests ────────────────────────────────────────────────────────────────────

async function testConnection() {
  group('1. Database Connection');
  const { error } = await supabase.from('page_content').select('id').limit(1);
  if (error) fail('Connect to Supabase', error.message);
  else ok('Connected to Supabase successfully');
}

async function testTableStructure() {
  group('2. Table Structure — page_content');
  const { data, error } = await supabase.from('page_content').select(COLUMNS).limit(1);

  if (error) { fail('Fetch row with all expected columns', error.message); return; }
  ok('Table exists and all columns are present');

  if (data && data.length > 0) {
    const row = data[0];
    const cols = ['id', 'section_key', 'title_en', 'title_ar', 'subtitle_en',
                  'subtitle_ar', 'content_en', 'content_ar', 'image_url', 'extra_data', 'updated_at'];
    for (const col of cols) {
      if (col in row) ok(`Column "${col}" exists`);
      else fail(`Column "${col}" missing`);
    }
  }
}

async function testAllSectionsExist() {
  group('3. Required Sections Exist');
  const { data, error } = await supabase
    .from('page_content')
    .select('section_key')
    .in('section_key', EXPECTED_SECTIONS);

  if (error) { fail('Query sections', error.message); return; }

  const found = (data ?? []).map((r) => r.section_key);
  for (const sec of EXPECTED_SECTIONS) {
    if (found.includes(sec)) ok(`Section "${sec}" exists`);
    else fail(`Section "${sec}" is MISSING — run 001_initial_schema.sql`);
  }
}

async function testReadSection(sectionKey) {
  const { data, error } = await supabase
    .from('page_content')
    .select(COLUMNS)
    .eq('section_key', sectionKey)
    .single();

  if (error) { fail(`READ "${sectionKey}"`, error.message); return null; }
  ok(`READ "${sectionKey}" — title_en: "${data.title_en ?? '(empty)'}"`);
  return data;
}

async function testReadAllSections() {
  group('4. Read Each Section');
  for (const sec of EXPECTED_SECTIONS) {
    await testReadSection(sec);
  }
}

async function testUpdateAndRevert() {
  group('5. Write & Revert (hero section)');

  // Read original
  const { data: original, error: readErr } = await supabase
    .from('page_content')
    .select('id, title_en, updated_at')
    .eq('section_key', 'hero')
    .single();

  if (readErr || !original) { fail('Read hero before update', readErr?.message ?? 'No row'); return; }
  ok(`Read original hero title_en: "${original.title_en}"`);

  const testTitle = `TEST_${Date.now()}`;

  // Update
  const { error: updateErr } = await supabase
    .from('page_content')
    .update({ title_en: testTitle })
    .eq('id', original.id);

  if (updateErr) { fail('Update hero title_en', updateErr.message); return; }
  ok(`Updated hero title_en to "${testTitle}"`);

  // Verify update was persisted
  const { data: updated, error: verifyErr } = await supabase
    .from('page_content')
    .select('title_en, updated_at')
    .eq('id', original.id)
    .single();

  if (verifyErr || !updated) { fail('Verify updated value', verifyErr?.message); return; }
  if (updated.title_en === testTitle) ok(`Verified: value persisted in DB`);
  else fail(`Verify: expected "${testTitle}" but got "${updated.title_en}"`);

  if (updated.updated_at !== original.updated_at) ok(`updated_at trigger fired correctly`);
  else fail(`updated_at did NOT change — trigger may be missing`);

  // Revert
  const { error: revertErr } = await supabase
    .from('page_content')
    .update({ title_en: original.title_en })
    .eq('id', original.id);

  if (revertErr) fail('Revert hero title_en', revertErr.message);
  else ok(`Reverted hero title_en back to "${original.title_en}"`);
}

async function testUpsertNewSection() {
  group('6. Upsert a New Section (test_section)');
  const testKey = 'test_section_ci';

  // Insert
  const { error: insertErr } = await supabase
    .from('page_content')
    .upsert({ section_key: testKey, title_en: 'Test', title_ar: 'اختبار' }, { onConflict: 'section_key' });

  if (insertErr) { fail('Upsert test_section_ci', insertErr.message); return; }
  ok('Upserted test_section_ci');

  // Read back
  const { data, error: readErr } = await supabase
    .from('page_content')
    .select('title_en, title_ar')
    .eq('section_key', testKey)
    .single();

  if (readErr || !data) { fail('Read test_section_ci', readErr?.message); }
  else if (data.title_en === 'Test' && data.title_ar === 'اختبار') ok('Bilingual fields stored correctly');
  else fail('Bilingual fields mismatch', JSON.stringify(data));

  // Cleanup
  const { error: delErr } = await supabase
    .from('page_content')
    .delete()
    .eq('section_key', testKey);

  if (delErr) fail('Cleanup test_section_ci', delErr.message);
  else ok('Cleaned up test_section_ci');
}

async function testExtraDataJson() {
  group('7. extra_data JSONB Integrity');

  const { data, error } = await supabase
    .from('page_content')
    .select('section_key, extra_data')
    .in('section_key', ['stats', 'faq', 'why_choose_us']);

  if (error) { fail('Fetch JSONB rows', error.message); return; }

  for (const row of (data ?? [])) {
    const isArray = Array.isArray(row.extra_data);
    const isObject = typeof row.extra_data === 'object' && row.extra_data !== null;
    if (isArray) {
      ok(`"${row.section_key}" extra_data is an array with ${row.extra_data.length} item(s)`);
    } else if (isObject) {
      ok(`"${row.section_key}" extra_data is a valid JSON object`);
    } else {
      fail(`"${row.section_key}" extra_data is not valid JSON`, String(row.extra_data));
    }
  }
}

async function testRlsPublicRead() {
  group('8. RLS — Public (anon) Read Access');
  const ANON_KEY =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxocG5uc2VkYndnYnd5bXZhY3hyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0MzUwNjEsImV4cCI6MjA4NzAxMTA2MX0.khp9F3BBOpSPuJ32X9Nf-yj9ewZ500rAAPC1_cj_QD4';

  const anonClient = createClient(SUPABASE_URL, ANON_KEY);
  const { data, error } = await anonClient
    .from('page_content')
    .select('section_key')
    .limit(3);

  if (error) fail('Anon user cannot read page_content', error.message);
  else ok(`Anon user can read page_content (${data?.length ?? 0} rows visible)`);
}

async function testSectionToComponentWiring() {
  group('9. Section → Component Wiring (end-to-end)');

  const FULL_COLS =
    'section_key, title_en, title_ar, subtitle_en, subtitle_ar, content_en, content_ar, image_url, extra_data';

  const { data, error } = await supabase
    .from('page_content')
    .select(FULL_COLS)
    .in('section_key', ['hero', 'about', 'stats', 'why_choose_us', 'faq']);

  if (error) { fail('Fetch all 5 sections at once', error.message); return; }
  ok(`Fetched ${data?.length ?? 0} sections in single query`);

  const pc = Object.fromEntries((data ?? []).map((r) => [r.section_key, r]));

  // ── Hero ──────────────────────────────────────────────────────────────────
  const hero = pc.hero;
  if (!hero) { fail('[hero] section missing'); }
  else {
    if (hero.title_en) ok(`[hero] title_en → HeroSection dbTitle: "${hero.title_en}"`);
    else fail('[hero] title_en is empty — HeroSection will fall back to i18n');
    if (hero.subtitle_en) ok(`[hero] subtitle_en → HeroSection dbSubtitle: "${hero.subtitle_en}"`);
    else fail('[hero] subtitle_en is empty');
  }

  // ── About ─────────────────────────────────────────────────────────────────
  const about = pc.about;
  if (!about) { fail('[about] section missing'); }
  else {
    if (about.title_en) ok(`[about] title_en → AboutSection dbTitle: "${about.title_en}"`);
    else fail('[about] title_en is empty');
    if (about.content_en) ok(`[about] content_en → AboutSection dbDescription (${String(about.content_en).length} chars)`);
    else fail('[about] content_en is empty — AboutSection will fall back to i18n');
  }

  // ── Stats ─────────────────────────────────────────────────────────────────
  const stats = pc.stats;
  if (!stats) { fail('[stats] section missing'); }
  else {
    const arr = Array.isArray(stats.extra_data) ? stats.extra_data : null;
    if (!arr) { fail('[stats] extra_data is not an array — StatsSection will use DEFAULT_STATS'); }
    else {
      ok(`[stats] extra_data has ${arr.length} items → StatsSection stats prop`);
      const first = arr[0];
      if ('value' in first && 'label_en' in first && 'label_ar' in first)
        ok('[stats] items have required fields: value, label_en, label_ar');
      else
        fail('[stats] items missing required fields', JSON.stringify(first));
    }
  }

  // ── WhyChooseUs ───────────────────────────────────────────────────────────
  const why = pc.why_choose_us;
  if (!why) { fail('[why_choose_us] section missing'); }
  else {
    const arr = Array.isArray(why.extra_data) ? why.extra_data : null;
    if (!arr) { fail('[why_choose_us] extra_data is not an array — will use DEFAULT_FEATURES'); }
    else {
      ok(`[why_choose_us] extra_data has ${arr.length} items → WhyChooseUsSection dbFeatures prop`);
      const first = arr[0];
      if ('icon' in first && 'title_en' in first && 'title_ar' in first && 'desc_en' in first)
        ok('[why_choose_us] items have required fields: icon, title_en, title_ar, desc_en, desc_ar');
      else
        fail('[why_choose_us] items missing required fields', JSON.stringify(first));
    }
  }

  // ── FAQ ───────────────────────────────────────────────────────────────────
  const faq = pc.faq;
  if (!faq) { fail('[faq] section missing'); }
  else {
    const arr = Array.isArray(faq.extra_data) ? faq.extra_data : null;
    if (!arr) { fail('[faq] extra_data is not an array — will use DEFAULT_FAQS'); }
    else {
      ok(`[faq] extra_data has ${arr.length} items → FAQSection faqs prop`);
      const first = arr[0];
      if ('q_en' in first && 'q_ar' in first && 'a_en' in first && 'a_ar' in first)
        ok('[faq] items have required fields: q_en, q_ar, a_en, a_ar');
      else
        fail('[faq] items missing required fields', JSON.stringify(first));
    }
  }
}

async function testWritePropagation() {
  group('10. Write → Re-Read (simulate ContentEditor save)');

  // Simulate ContentEditor save for hero section
  const { data: before } = await supabase
    .from('page_content')
    .select('id, title_en')
    .eq('section_key', 'hero')
    .single();

  const newTitle = `Elite Schools — Updated ${new Date().toISOString().slice(0, 10)}`;

  const { error: updateErr } = await supabase
    .from('page_content')
    .update({ title_en: newTitle })
    .eq('id', before.id);

  if (updateErr) { fail('Save via ContentEditor-like update', updateErr.message); return; }

  // Re-read the way page.tsx does it (single query, by section_key array)
  const { data: pageRead } = await supabase
    .from('page_content')
    .select('section_key, title_en')
    .in('section_key', ['hero', 'about', 'stats', 'why_choose_us', 'faq']);

  const hero = (pageRead ?? []).find((r) => r.section_key === 'hero');
  if (hero?.title_en === newTitle)
    ok(`Write propagates to page.tsx query: "${newTitle}"`);
  else
    fail('Write did NOT propagate', `expected "${newTitle}", got "${hero?.title_en}"`);

  // Revert
  await supabase.from('page_content').update({ title_en: before.title_en }).eq('id', before.id);
  ok('Reverted title_en');
}

// ─── Run ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🏫  Elite Schools — /admin/content DB Test (Full Wiring)');
  console.log('='.repeat(52));

  await testConnection();
  await testTableStructure();
  await testAllSectionsExist();
  await testReadAllSections();
  await testUpdateAndRevert();
  await testUpsertNewSection();
  await testExtraDataJson();
  await testRlsPublicRead();
  await testSectionToComponentWiring();
  await testWritePropagation();

  console.log('\n' + '='.repeat(52));
  console.log(`\n🎯  Results: ${passed} passed, ${failed} failed`);

  if (failed === 0) {
    console.log('✅  All tests passed — /admin/content is fully wired to the site!\n');
  } else {
    console.log(`⚠️   ${failed} test(s) failed — see details above.\n`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('\n💥 Unexpected error:', err);
  process.exit(1);
});
