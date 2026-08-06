import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient, CATALOG_IMAGES_BUCKET } from '@/lib/supabase-admin';

const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024; // 8MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const EXTENSION_BY_TYPE: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: `Unsupported file type: ${file.type}` }, { status: 400 });
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json({ error: 'File exceeds 8MB limit' }, { status: 400 });
    }

    const admin = getSupabaseAdminClient();
    // Derived from the validated MIME type, never the client-supplied filename,
    // so a crafted file name can't inject "/" or ".." into the storage key.
    const extension = EXTENSION_BY_TYPE[file.type];
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;

    const { error: uploadError } = await admin.storage
      .from(CATALOG_IMAGES_BUCKET)
      .upload(path, file, { contentType: file.type, upsert: false });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data } = admin.storage.from(CATALOG_IMAGES_BUCKET).getPublicUrl(path);
    return NextResponse.json({ url: data.publicUrl });
  } catch (e) {
    console.error('Admin upload error:', e);
    return NextResponse.json({ error: 'Upload failed. Check Supabase configuration.' }, { status: 500 });
  }
}
