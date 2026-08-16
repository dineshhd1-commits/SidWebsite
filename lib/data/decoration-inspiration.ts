import raw from './decoration-inspiration.json';
import { DecorationPhoto } from '../types/decoration-inspiration';

const ALL_PHOTOS: DecorationPhoto[] = raw.photos;

/** Display order + labels for the category filter chips. */
export const DECORATION_CATEGORIES: { slug: string; label: string }[] = [
  { slug: 'stage-decoration', label: 'Stage Decoration' },
  { slug: 'mantap-decoration', label: 'Mantap Decoration' },
  { slug: 'chapra-with-flowers', label: 'Chapra With Flowers' },
  { slug: 'garlands', label: 'Garlands' },
  { slug: 'passage-decoration', label: 'Passage Decoration' },
  { slug: 'door-decoration', label: 'Door & Entrance Decoration' },
  { slug: 'bridal-entry', label: 'Bridal Entry Ideas' },
  { slug: 'saptapadi', label: 'Saptapadi Setup' },
  { slug: 'cold-fire-entry', label: 'Cold Fire Entry' },
];

/** Simple local "looks similar to" graph between categories, ordered by
 * closeness - stands in for real tagging/AI without needing either. Used
 * only to widen the recommendation pool once same-category photos run out. */
const RELATED_CATEGORIES: Record<string, string[]> = {
  'stage-decoration': ['mantap-decoration', 'chapra-with-flowers', 'garlands', 'saptapadi'],
  'mantap-decoration': ['stage-decoration', 'chapra-with-flowers', 'saptapadi', 'garlands'],
  'chapra-with-flowers': ['stage-decoration', 'mantap-decoration', 'garlands'],
  'garlands': ['stage-decoration', 'mantap-decoration', 'chapra-with-flowers', 'door-decoration'],
  'passage-decoration': ['door-decoration', 'bridal-entry', 'garlands'],
  'door-decoration': ['bridal-entry', 'garlands', 'cold-fire-entry', 'passage-decoration'],
  'bridal-entry': ['door-decoration', 'cold-fire-entry', 'passage-decoration'],
  'saptapadi': ['mantap-decoration', 'stage-decoration'],
  'cold-fire-entry': ['bridal-entry', 'door-decoration'],
};

export function getAllDecorationPhotos(): DecorationPhoto[] {
  return ALL_PHOTOS;
}

export function getDecorationPhotosByCategory(category: string | 'all'): DecorationPhoto[] {
  if (category === 'all') return ALL_PHOTOS;
  return ALL_PHOTOS.filter((p) => p.category === category);
}

export function getDecorationPhotoById(id: string): DecorationPhoto | undefined {
  return ALL_PHOTOS.find((p) => p.id === id);
}

/**
 * Local content-based recommender: no ML, just category adjacency.
 * Prioritizes other photos from the same category (most similar), then
 * fills the rest from related categories (per RELATED_CATEGORIES), then
 * pads with anything else if the pool is still short.
 */
export function getSimilarDecorationPhotos(photoId: string, count = 8): DecorationPhoto[] {
  const selected = getDecorationPhotoById(photoId);
  if (!selected) return [];

  // Start just after the selected photo within its own category, wrapping
  // around, so browsing forward through a category feels continuous.
  const categoryList = ALL_PHOTOS.filter((p) => p.category === selected.category);
  const selectedIndexInCategory = categoryList.findIndex((p) => p.id === selected.id);
  const rotatedSameCategory = categoryList
    .filter((p) => p.id !== selected.id)
    .sort((a, b) => {
      const ai = categoryList.findIndex((p) => p.id === a.id);
      const bi = categoryList.findIndex((p) => p.id === b.id);
      const da = (ai - selectedIndexInCategory + categoryList.length) % categoryList.length;
      const db = (bi - selectedIndexInCategory + categoryList.length) % categoryList.length;
      return da - db;
    });

  const result: DecorationPhoto[] = [];
  const usedIds = new Set([selected.id]);

  const take = (pool: DecorationPhoto[], max: number) => {
    for (const p of pool) {
      if (result.length >= count || usedIds.has(p.id)) continue;
      if (max-- <= 0) break;
      result.push(p);
      usedIds.add(p.id);
    }
  };

  // Up to half the slots from the same category first (most similar).
  take(rotatedSameCategory, Math.ceil(count / 2));

  // Round-robin through related categories to diversify the rest.
  const relatedSlugs = RELATED_CATEGORIES[selected.category] || [];
  const relatedPools = relatedSlugs.map((slug) => ALL_PHOTOS.filter((p) => p.category === slug));
  let round = 0;
  while (result.length < count && relatedPools.some((pool) => pool.length > round)) {
    for (const pool of relatedPools) {
      if (result.length >= count) break;
      const candidate = pool[round];
      if (candidate && !usedIds.has(candidate.id)) {
        result.push(candidate);
        usedIds.add(candidate.id);
      }
    }
    round++;
  }

  // Still short (tiny categories like Cold Fire Entry) - fill with any
  // remaining same-category photos, then anything else.
  take(rotatedSameCategory, count);
  if (result.length < count) {
    take(ALL_PHOTOS, count);
  }

  return result.slice(0, count);
}
