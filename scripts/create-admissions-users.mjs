/**
 * Script to create two admissions-only admin accounts.
 * Usage: node scripts/create-admissions-users.mjs
 *
 * Reads credentials from .env.local and interactively prompts for
 * the email + password of each new user.
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// ── Read .env.local ───────────────────────────────────────────────
const envPath = resolve(process.cwd(), '.env.local');
let envContent;
try {
  envContent = readFileSync(envPath, 'utf-8');
} catch {
  console.error('❌  Cannot find .env.local. Run from the project root.');
  process.exit(1);
}

const env = Object.fromEntries(
  envContent
    .split('\n')
    .map(l => l.trim())
    .filter(l => l && !l.startsWith('#'))
    .map(l => {
      const idx = l.indexOf('=');
      const key = l.slice(0, idx).trim();
      const val = l.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
      return [key, val];
    })
);

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    '❌  Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local'
  );
  process.exit(1);
}

// ── Supabase admin client ─────────────────────────────────────────
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ── Helpers ───────────────────────────────────────────────────────
async function upsertAdmissionsUser(email, password, num) {
  console.log(`\n── User #${num}: ${email} ─────────────────────`);

  // Check if user already exists → update role + password
  const { data: existing } = await supabase.auth.admin.listUsers();
  const found = existing?.users?.find(u => u.email === email);

  if (found) {
    const { error } = await supabase.auth.admin.updateUserById(found.id, {
      user_metadata: { role: 'admissions' },
      password,
    });
    if (error) {
      console.error(`  ❌  Update failed: ${error.message}`);
    } else {
      console.log(`  ✅  Updated existing user → role: admissions`);
    }
    return;
  }

  // Create new user
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    user_metadata: { role: 'admissions' },
    email_confirm: true,
  });

  if (error) {
    console.error(`  ❌  Create failed: ${error.message}`);
  } else {
    console.log(`  ✅  Created (id: ${data.user.id}) → role: admissions`);
  }
}

// ── Main ──────────────────────────────────────────────────────────
const args = process.argv.slice(2); // [email1, pass1, email2, pass2]

if (args.length !== 4) {
  console.error('\nUsage:');
  console.error(
    '  node scripts/create-admissions-users.mjs <email1> <pass1> <email2> <pass2>\n'
  );
  process.exit(1);
}

const [email1, pass1, email2, pass2] = args;

console.log('\n╔══════════════════════════════════════════════╗');
console.log('║     Create Admissions-Only Admin Accounts    ║');
console.log('╚══════════════════════════════════════════════╝');
console.log('These accounts will only see the Admissions page.');

await upsertAdmissionsUser(email1, pass1, 1);
await upsertAdmissionsUser(email2, pass2, 2);

console.log('\n✅  Done! Users can now log in at /login.\n');
