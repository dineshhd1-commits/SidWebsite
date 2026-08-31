#!/usr/bin/env node
// Standalone Supabase keep-alive ping - independent of the deployed site,
// so it still works if Vercel Cron (app/api/cron/keep-alive + vercel.json)
// is ever disabled, misconfigured, or the deployment itself is down. Used
// by .github/workflows/supabase-keep-alive.yml as a second, unrelated
// scheduler; having both fail in the same 7-day window is what it'd take
// for the free-tier project to actually auto-pause.
//
// Talks to Supabase directly with the anon key (same key already exposed
// in the site's client bundle, so nothing sensitive here) rather than going
// through the deployed API route, so it has no dependency on the site being
// up or on CRON_SECRET being kept in sync across two platforms.
//
// Usage: node scripts/keep-alive.mjs
// Requires SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) and
// SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY), from web/.env.local
// locally or from GitHub Actions secrets in CI.

import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const envPath = path.join(ROOT, '.env.local');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const val = trimmed.slice(idx + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
}

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !anonKey) {
  console.error('SUPABASE_URL and SUPABASE_ANON_KEY (or their NEXT_PUBLIC_ equivalents) are required.');
  process.exit(1);
}

const client = createClient(supabaseUrl, anonKey);

const { error } = await client.from('event_types').select('id').limit(1);
if (error) {
  console.error('Keep-alive ping failed:', error.message);
  process.exit(1);
}

console.log(`Keep-alive ping OK at ${new Date().toISOString()}`);
