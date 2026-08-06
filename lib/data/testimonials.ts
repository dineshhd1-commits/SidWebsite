import { supabase, isSupabaseConfigured } from '../supabase';
import { Testimonial } from '../types/wedding';
import { MOCK_TESTIMONIALS } from '../mock-data';

export interface TestimonialWithVerification extends Testimonial {
  isGoogleVerified: boolean;
}

function mapRow(row: any): TestimonialWithVerification {
  return {
    id: row.id,
    coupleNames: row.couple_names,
    weddingDate: row.wedding_date || '',
    location: row.location || '',
    rating: row.rating ?? 5,
    comment: row.comment,
    imageUrl: row.image_url || '',
    isGoogleVerified: row.is_google_verified !== false,
  };
}

export async function getTestimonials(): Promise<TestimonialWithVerification[]> {
  if (!isSupabaseConfigured()) {
    return MOCK_TESTIMONIALS.map((t) => ({ ...t, isGoogleVerified: true }));
  }
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('active', true)
      .order('display_order', { ascending: true });
    if (error) throw error;
    if (!data || data.length === 0) {
      return MOCK_TESTIMONIALS.map((t) => ({ ...t, isGoogleVerified: true }));
    }
    return data.map(mapRow);
  } catch (e) {
    console.warn('getTestimonials failed, falling back to mock testimonials:', e);
    return MOCK_TESTIMONIALS.map((t) => ({ ...t, isGoogleVerified: true }));
  }
}
