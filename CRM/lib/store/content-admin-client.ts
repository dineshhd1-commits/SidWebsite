import { GalleryItem, Testimonial } from '../types/wedding';

async function parseJsonOrThrow(res: Response) {
  const body = await res.json();
  if (!res.ok) throw new Error(body?.error?.message || body?.error || 'Request failed');
  return body;
}

export interface AdminGalleryItem extends GalleryItem {
  active: boolean;
  displayOrder: number;
}

export async function adminListGalleryItems(): Promise<AdminGalleryItem[]> {
  const res = await fetch('/api/admin/gallery');
  const body = await parseJsonOrThrow(res);
  return (body.items || []).map((row: any) => ({
    id: row.id,
    title: row.title,
    category: row.category,
    mediaType: row.media_type || 'image',
    url: row.url,
    thumbnailUrl: row.thumbnail_url || undefined,
    active: row.active !== false,
    displayOrder: row.display_order ?? 0,
  }));
}

export async function adminSaveGalleryItem(item: AdminGalleryItem): Promise<void> {
  const res = await fetch('/api/admin/gallery', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });
  await parseJsonOrThrow(res);
}

export async function adminDeleteGalleryItem(id: string): Promise<void> {
  const res = await fetch(`/api/admin/gallery/${encodeURIComponent(id)}`, { method: 'DELETE' });
  await parseJsonOrThrow(res);
}

export async function adminToggleGalleryItemActive(id: string, active: boolean): Promise<void> {
  const res = await fetch(`/api/admin/gallery/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ active }),
  });
  await parseJsonOrThrow(res);
}

export interface AdminTestimonial extends Testimonial {
  isGoogleVerified: boolean;
  active: boolean;
  displayOrder: number;
}

export async function adminListTestimonials(): Promise<AdminTestimonial[]> {
  const res = await fetch('/api/admin/testimonials');
  const body = await parseJsonOrThrow(res);
  return (body.items || []).map((row: any) => ({
    id: row.id,
    coupleNames: row.couple_names,
    weddingDate: row.wedding_date || '',
    location: row.location || '',
    rating: row.rating ?? 5,
    comment: row.comment,
    imageUrl: row.image_url || '',
    isGoogleVerified: row.is_google_verified !== false,
    active: row.active !== false,
    displayOrder: row.display_order ?? 0,
  }));
}

export async function adminSaveTestimonial(item: AdminTestimonial): Promise<void> {
  const res = await fetch('/api/admin/testimonials', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });
  await parseJsonOrThrow(res);
}

export async function adminDeleteTestimonial(id: string): Promise<void> {
  const res = await fetch(`/api/admin/testimonials/${encodeURIComponent(id)}`, { method: 'DELETE' });
  await parseJsonOrThrow(res);
}

export async function adminToggleTestimonialActive(id: string, active: boolean): Promise<void> {
  const res = await fetch(`/api/admin/testimonials/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ active }),
  });
  await parseJsonOrThrow(res);
}
