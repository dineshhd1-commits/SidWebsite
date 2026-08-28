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

const anonClient = createClient(supabaseUrl, anonKey);
const adminClient = createClient(supabaseUrl, serviceRoleKey);

async function testAll() {
  console.log('--- TESTING SUPABASE CONNECTIONS ---');

  try {
    const { data, error, count } = await anonClient
      .from('catalog_items')
      .select('id, name, group_id', { count: 'exact' })
      .eq('active', true);
    if (error) throw error;
    console.log(`[PASS] Catalog items query: ${data.length} active items retrieved (total count: ${count})`);
  } catch (err) {
    console.error('[FAIL] Catalog items query:', err.message);
  }

  try {
    const { data, error } = await anonClient.storage.from('enquiry-pdfs').list();
    if (error) throw error;
    console.log(`[PASS] Storage bucket 'enquiry-pdfs' accessible. Found ${data.length} entries.`);
  } catch (err) {
    console.error('[FAIL] Storage bucket enquiry-pdfs:', err.message);
  }

  try {
    const { data, error } = await adminClient.from('quotations').select('id, customer_name').limit(3);
    if (error) throw error;
    console.log(`[PASS] Admin quotations table accessible. Found ${data.length} recent rows.`);
  } catch (err) {
    console.error('[FAIL] Quotations table query:', err.message);
  }

  console.log('--- SUPABASE TEST COMPLETE ---');
}

testAll();
