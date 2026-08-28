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
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function fixWelcomeGirls() {
  const { error } = await supabase.from('catalog_items').upsert([
    {
      id: 'dec-welcome-girls-service',
      supported_event_types: ['wedding'],
      category_key: 'decoration',
      group_id: 'dec-couple-entry',
      name: 'Welcome Girls',
      description: 'Welcome girls to greet and escort guests with flowers and aarti.',
      image_url: '',
      images: [],
      package_level: 'normal',
      price: 5000,
      unit: 'per event',
      quantity_mode: 'single',
      active: true,
      display_order: 8
    },
    {
      id: 'dec-engagement-entry-welcome-girls',
      supported_event_types: ['engagement'],
      category_key: 'decoration',
      group_id: 'dec-entry-engagement',
      name: 'Welcome Girls',
      description: 'Welcome girls to greet and escort guests with flowers and aarti.',
      image_url: '',
      images: [],
      package_level: 'normal',
      price: 5000,
      unit: 'per event',
      quantity_mode: 'single',
      active: true,
      display_order: 10
    },
    {
      id: 'dec-reception-entry-welcome-girls',
      supported_event_types: ['reception'],
      category_key: 'decoration',
      group_id: 'dec-entry-reception',
      name: 'Welcome Girls',
      description: 'Welcome girls to greet and escort guests with flowers and aarti.',
      image_url: '',
      images: [],
      package_level: 'normal',
      price: 5000,
      unit: 'per event',
      quantity_mode: 'single',
      active: true,
      display_order: 10
    }
  ]);
  console.log('Welcome girls upsert error:', error);

  const { data } = await supabase
    .from('catalog_items')
    .select('id, name, group_id')
    .contains('supported_event_types', ['wedding'])
    .eq('group_id', 'dec-couple-entry')
    .eq('active', true);
  console.log('Wedding Couple Entry items now:');
  console.table(data);
}

fixWelcomeGirls();
