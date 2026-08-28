#!/usr/bin/env node
// Uploads every locally-referenced /public asset (images/videos actually
// imported as string literals from app/, components/, lib/) to the
// `site-assets` Supabase Storage bucket, at the same relative path, so
// lib/asset-url.ts's toAssetUrl() can serve them from Supabase instead of
// the local filesystem. Local files in web/public are left untouched - they
// stay in the repo as a backup/rollback path.
//
// Re-scans the source tree at run time (rather than a hand-maintained list)
// so this stays accurate as files are added/removed from lib/data and the
// handful of direct-reference components. Safe to re-run: uploads with
// upsert: true, and prints a final summary so nothing is silently missed.
//
// Usage: node scripts/upload-site-assets.mjs
// Requires SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) and
// SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_SECRET_KEY) in web/.env.local.

import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const BUCKET = 'site-assets';

// Load .env.local (same minimal loader used by scripts/apply-db-migrations.js)
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

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set (see web/.env.local).');
  process.exit(1);
}

const admin = createClient(supabaseUrl, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } });

// Framework-reserved files Next.js needs at fixed local paths regardless -
// never migrated, even though some are technically referenced in code.
const EXCLUDED = new Set(['/favicon.ico', '/robots.txt', '/sitemap.xml', '/site.webmanifest', '/logo-circle.png']);

const CONTENT_TYPES = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
  '.gif': 'image/gif',
  '.mp4': 'video/mp4',
  '.pdf': 'application/pdf',
};

const ASSET_PATTERN = /["']((\/[^"'\r\n]+\.(?:jpg|jpeg|png|webp|avif|svg|gif|mp4|pdf)))["']/gi;
const SCAN_DIRS = ['app', 'components', 'lib'];

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.next') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, out);
    } else if (/\.(ts|tsx)$/.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

function findUsedAssets() {
  const found = new Set();
  for (const dir of SCAN_DIRS) {
    const dirPath = path.join(ROOT, dir);
    if (!fs.existsSync(dirPath)) continue;
    for (const file of walk(dirPath)) {
      const content = fs.readFileSync(file, 'utf8');
      let match;
      ASSET_PATTERN.lastIndex = 0;
      while ((match = ASSET_PATTERN.exec(content))) {
        found.add(match[1]);
      }
    }
  }
  return Array.from(found).filter((p) => !EXCLUDED.has(p)).sort();
}

async function main() {
  const assets = findUsedAssets();
  console.log(`Found ${assets.length} referenced asset paths.`);

  let uploaded = 0;
  let skippedMissing = 0;
  let failed = 0;
  const failures = [];

  for (const assetPath of assets) {
    const localFile = path.join(ROOT, 'public', assetPath.replace(/^\//, ''));
    if (!fs.existsSync(localFile) || !fs.statSync(localFile).isFile()) {
      skippedMissing++;
      continue;
    }
    const ext = path.extname(localFile).toLowerCase();
    const contentType = CONTENT_TYPES[ext] || 'application/octet-stream';
    const buffer = fs.readFileSync(localFile);
    // Storage object path mirrors the local /public path exactly (minus the
    // leading slash), so toAssetUrl() can derive it with no lookup table.
    const objectPath = assetPath.replace(/^\//, '');

    const { error } = await admin.storage.from(BUCKET).upload(objectPath, buffer, { contentType, upsert: true });
    if (error) {
      failed++;
      failures.push(`${assetPath}: ${error.message}`);
    } else {
      uploaded++;
    }
  }

  console.log('\n--- Upload summary ---');
  console.log(`Uploaded:        ${uploaded}`);
  console.log(`Skipped (missing locally): ${skippedMissing}`);
  console.log(`Failed:          ${failed}`);
  if (failures.length > 0) {
    console.log('\nFailures:');
    for (const f of failures) console.log(`  - ${f}`);
    process.exitCode = 1;
  }
}

main().catch((e) => {
  console.error('Upload script crashed:', e);
  process.exit(1);
});
