import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { generateEnquiryPdfBlob } from '../lib/builder/enquiry-pdf';
import { cacheDel } from '../lib/redis';

// Load environment variables
const envFile = path.resolve(__dirname, '../.env.local');
const envContent = fs.readFileSync(envFile, 'utf8');
const env: Record<string, string> = {};
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eq = trimmed.indexOf('=');
  if (eq !== -1) {
    env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
}

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || env.SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL or Key not found in .env.local');
  process.exit(1);
}

const admin = createClient(supabaseUrl, supabaseKey);

async function backfill() {
  console.log('Fetching quotes from Supabase...');
  const { data: quotes, error } = await admin
    .from('quotations')
    .select('id, customer_name, customer_phone, customer_email, wedding_date, venue_city, builder_state, price_breakdown, created_at')
    .order('created_at', { ascending: false });

  if (error || !quotes) {
    console.error('Failed to fetch quotes:', error);
    process.exit(1);
  }

  console.log(`Found ${quotes.length} total quotes.`);
  let count = 0;

  for (const q of quotes) {
    const builderState = q.builder_state || {};
    if (builderState.pdfUrl) {
      console.log(`[SKIP] Quote ${q.id} already has PDF: ${builderState.pdfUrl.slice(0, 60)}...`);
      continue;
    }

    console.log(`[PROCESSING] Generating PDF for ${q.id} (${q.customer_name})...`);
    try {
      const fullDetails = builderState.fullDetails || {
        customerName: q.customer_name || 'Customer',
        customerPhone: q.customer_phone || '',
        customerEmail: q.customer_email || '',
        weddingDate: q.wedding_date || '',
        venueCity: q.venue_city || '',
        venueAddress: builderState.venueAddress || '',
        guestCount: builderState.guestCount || 0,
        specialRequirements: builderState.notes || '',
        sections: [],
        cateringMenus: [],
        requestedExtras: [],
        estimatedTotal: q.price_breakdown?.estimatedCost || 0,
        totalSelectionsCount: builderState.selectedServicesCount || 0,
      };

      const pdfBlob = await generateEnquiryPdfBlob(fullDetails, q.id, q.created_at || new Date().toISOString());
      console.log(`  Rendered PDF blob (${pdfBlob.size} bytes). Uploading to Supabase...`);

      const randomSuffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const objectPath = `${q.id}/${randomSuffix}.pdf`;
      const arrayBuffer = await pdfBlob.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const { error: uploadError } = await admin.storage.from('enquiry-pdfs').upload(objectPath, buffer, {
        contentType: 'application/pdf',
        upsert: true,
      });

      if (uploadError) {
        console.error(`  Upload error for ${q.id}:`, uploadError.message);
        continue;
      }

      // 7-day signed URL
      const { data: signData, error: signError } = await admin.storage
        .from('enquiry-pdfs')
        .createSignedUrl(objectPath, 60 * 60 * 24 * 7);

      if (signError || !signData?.signedUrl) {
        console.error(`  Signed URL error for ${q.id}:`, signError?.message);
        continue;
      }

      const pdfUrl = signData.signedUrl;

      // Update quote row in Supabase
      const { error: updateError } = await admin
        .from('quotations')
        .update({
          builder_state: {
            ...builderState,
            pdfUrl,
          },
        })
        .eq('id', q.id);

      if (updateError) {
        console.error(`  Update error for ${q.id}:`, updateError.message);
      } else {
        console.log(`  SUCCESS: Attached PDF to quote ${q.id}!`);
        count++;
      }
    } catch (err) {
      console.error(`  Failed processing quote ${q.id}:`, err);
    }
  }

  await cacheDel('admin:quotes:list').catch(() => {});
  console.log(`\nDone! Successfully backfilled ${count} quotes.`);
}

backfill();
