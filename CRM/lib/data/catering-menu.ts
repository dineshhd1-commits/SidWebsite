import rawMenu from './catering-menu.json';
import { CateringMealPeriod, CateringMenuCategory, CateringMenuSection, CateringTiming } from '../types/catering-menu';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export const TIMING_TO_MEAL: Record<CateringTiming, CateringMealPeriod> = {
  morning: 'breakfast',
  afternoon: 'lunch',
  evening: 'dinner',
};

export const BREAKFAST_EVENT_TYPES: string[] = rawMenu.breakfastEventTypes;

const CATEGORY_LIMITS: Record<string, number> = rawMenu.categoryLimits || {};

const ALL_CATEGORIES: CateringMenuCategory[] = rawMenu.categories.map((category) => ({
  id: category.id,
  name: category.name,
  items: category.items.map((name) => {
    const id = `${category.id}__${slugify(name)}`;
    return { id, name, imageUrl: `/catering/${id}.jpg` };
  }),
  maxSelections: CATEGORY_LIMITS[category.id],
}));

const CATEGORY_BY_ID = new Map(ALL_CATEGORIES.map((c) => [c.id, c]));

const MEAL_CATEGORY_IDS: Record<CateringMealPeriod, string[]> = rawMenu.mealCategoryIds as Record<CateringMealPeriod, string[]>;

/** Optional Snacks/Main Course-style grouping, keyed by meal period. Only the
 * Evening/Dinner menu currently defines this - Breakfast and Afternoon/Lunch
 * have no entry and keep rendering as a single flat category list. */
const MEAL_SECTIONS: Partial<Record<CateringMealPeriod, { name: string; categoryIds: string[] }[]>> =
  (rawMenu as any).mealSections || {};

export function getAllCateringCategories(): CateringMenuCategory[] {
  return ALL_CATEGORIES;
}

export function isBreakfastAvailableForEventType(eventTypeId: string | null): boolean {
  return !!eventTypeId && BREAKFAST_EVENT_TYPES.includes(eventTypeId);
}

/** Returns the catering menu categories to show for a given timing selection,
 * respecting which event types get a Breakfast menu (Morning timing only applies
 * to those event types - everyone else only ever sees Lunch/Afternoon and
 * Dinner/Evening). */
export function getCategoriesForTiming(timing: CateringTiming, eventTypeId: string | null): CateringMenuCategory[] {
  const meal = TIMING_TO_MEAL[timing];
  if (meal === 'breakfast' && !isBreakfastAvailableForEventType(eventTypeId)) {
    return [];
  }
  const categoryIds = MEAL_CATEGORY_IDS[meal] || [];
  return categoryIds.map((id) => CATEGORY_BY_ID.get(id)).filter((c): c is CateringMenuCategory => !!c);
}

export function getCateringCategoryById(categoryId: string): CateringMenuCategory | undefined {
  return CATEGORY_BY_ID.get(categoryId);
}

/** Returns the Snacks/Main Course-style section grouping for a timing, or
 * null when that meal has no defined sections (Breakfast, Afternoon) - callers
 * should fall back to a flat category list in that case. */
export function getSectionsForTiming(timing: CateringTiming, eventTypeId: string | null): CateringMenuSection[] | null {
  const meal = TIMING_TO_MEAL[timing];
  if (meal === 'breakfast' && !isBreakfastAvailableForEventType(eventTypeId)) {
    return null;
  }
  const sections = MEAL_SECTIONS[meal];
  if (!sections || sections.length === 0) return null;
  return sections
    .map((section) => ({
      name: section.name,
      categories: section.categoryIds.map((id) => CATEGORY_BY_ID.get(id)).filter((c): c is CateringMenuCategory => !!c),
    }))
    .filter((section) => section.categories.length > 0);
}
