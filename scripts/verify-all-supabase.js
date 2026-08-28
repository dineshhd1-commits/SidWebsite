const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load .env.local if present
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim();
        if (!process.env[key]) process.env[key] = val;
      }
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !anonKey || !serviceRoleKey) {
  console.error('❌ Missing Supabase environment variables in .env.local or process.env');
  process.exit(1);
}

const anonClient = createClient(supabaseUrl, anonKey);
const adminClient = createClient(supabaseUrl, serviceRoleKey);

async function testAll() {
  console.log('=== COMPREHENSIVE SUPABASE INTEGRATION TEST (FROM ENV) ===\n');

  const tables = [
    'catalog_items',
    'catalog_groups',
    'package_levels',
    'event_types',
    'wedding_packages',
    'quotations',
    'inquiries',
    'gallery_items',
    'testimonials'
  ];

  for (const table of tables) {
    try {
      const { data, error, count } = await adminClient
        .from(table)
        .select('*', { count: 'exact', head: false })
        .limit(3);
      if (error) {
        console.log(`❌ Table [${table}]: FAILED - ${error.message}`);
      } else {
        console.log(`✅ Table [${table}]: OK (${count ?? data.length} total rows)`);
      }
    } catch (e) {
      console.log(`❌ Table [${table}]: ERROR - ${e.message}`);
    }
  }

  console.log('\n--- STORAGE BUCKETS ---');
  const buckets = ['enquiry-pdfs', 'catalog-images'];
  for (const b of buckets) {
    try {
      const { data, error } = await adminClient.storage.from(b).list();
      if (error) {
        console.log(`❌ Bucket [${b}]: FAILED - ${error.message}`);
      } else {
        console.log(`✅ Bucket [${b}]: OK (${data.length} objects found)`);
      }
    } catch (e) {
      console.log(`❌ Bucket [${b}]: ERROR - ${e.message}`);
    }
  }

  console.log('\n===============================================');
}

testAll();
